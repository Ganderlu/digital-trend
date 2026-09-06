import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { deepSerializeTimestamps } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdminFromRequest(request);
    const db = getAdminDb();

    const [
      usersSnap,
      investmentsSnap,
      earningsSnap,
    ] = await Promise.all([
      db.collection("users").orderBy("createdAt", "desc").get(),
      db.collection("investments").orderBy("createdAt", "desc").get(),
      db.collection("earnings").orderBy("createdAt", "desc").get(),
    ]);

    const usersById = new Map<string, any>();
    for (const doc of usersSnap.docs) {
      usersById.set(doc.id, { id: doc.id, ...doc.data() });
    }

    type InvestAgg = {
      totalCycles: number;
      activeCycles: number;
      pendingCycles: number;
      completedCycles: number;
      totalInvested: number;
      totalExpected: number;
      totalEarningsPaid: number;
      totalProgressWeighted: number;
    };

    type EarningAgg = {
      totalPayouts: number;
      totalPaid: number;
      matrixPaid: number;
      referralPaid: number;
    };

    const investMap = new Map<string, InvestAgg>();
    const ensureInvest = (uid: string): InvestAgg => {
      let r = investMap.get(uid);
      if (!r) {
        r = {
          totalCycles: 0,
          activeCycles: 0,
          pendingCycles: 0,
          completedCycles: 0,
          totalInvested: 0,
          totalExpected: 0,
          totalEarningsPaid: 0,
          totalProgressWeighted: 0,
        };
        investMap.set(uid, r);
      }
      return r;
    };

    for (const doc of investmentsSnap.docs) {
      const d = doc.data() || {};
      const uid = d.userId as string | undefined;
      if (!uid) continue;
      const amount = Number(d.amount ?? 0);
      const totalReturn = Number(d.totalReturn ?? amount * 2);
      const earningsPaid = Number(d.earningsPaid ?? 0);
      const progress =
        totalReturn > 0 ? Math.min(1, earningsPaid / totalReturn) : 0;

      const statusVal =
        typeof d.status === "string" ? d.status.toLowerCase() : "active";
      let bucket: "completed" | "pending" | "active" = "active";
      if (statusVal === "completed" || statusVal === "mature")
        bucket = "completed";
      else if (statusVal === "pending") bucket = "pending";

      const agg = ensureInvest(uid);
      agg.totalCycles += 1;
      if (bucket === "active") agg.activeCycles += 1;
      else if (bucket === "pending") agg.pendingCycles += 1;
      else agg.completedCycles += 1;
      agg.totalInvested += amount;
      agg.totalExpected += totalReturn;
      agg.totalEarningsPaid += earningsPaid;
      agg.totalProgressWeighted += progress * amount;
    }

    const earnMap = new Map<string, EarningAgg>();
    const ensureEarn = (uid: string): EarningAgg => {
      let r = earnMap.get(uid);
      if (!r) {
        r = {
          totalPayouts: 0,
          totalPaid: 0,
          matrixPaid: 0,
          referralPaid: 0,
        };
        earnMap.set(uid, r);
      }
      return r;
    };

    for (const doc of earningsSnap.docs) {
      const d = doc.data() || {};
      const uid = d.userId as string | undefined;
      if (!uid) continue;
      const amount = Number(d.amount ?? 0);
      const source = String(d.source || d.type || "").toLowerCase();
      const agg = ensureEarn(uid);
      agg.totalPayouts += 1;
      agg.totalPaid += amount;
      if (source.includes("referral") || source.includes("ref")) {
        agg.referralPaid += amount;
      } else {
        agg.matrixPaid += amount;
      }
    }

    const userReferrals = new Map<string, string[]>();
    for (const doc of usersSnap.docs) {
      const d = doc.data() || {};
      const ref = d.referredBy as string | undefined;
      if (ref) {
        const arr = userReferrals.get(ref) || [];
        arr.push(doc.id);
        userReferrals.set(ref, arr);
      }
    }

    const nameOf = (uid: string): string | null => {
      const u = usersById.get(uid);
      if (!u) return null;
      return (
        u.fullName ||
        [u.firstName, u.lastName].filter(Boolean).join(" ").trim() ||
        u.usernameDisplay ||
        u.username ||
        null
      );
    };

    let totalParticipants = 0;
    let totalWithReferrals = 0;
    let totalReferralCount = 0;
    let totalActiveInMatrix = 0;
    let totalStaked = 0;
    let totalExpectedReturn = 0;
    let totalEarningsAllTime = 0;
    let totalMatrixPayouts = 0;
    let totalReferralPayouts = 0;
    let totalCyclesAll = 0;
    let totalCompletedCycles = 0;
    let totalActiveCycles = 0;

    const raws = usersSnap.docs.map((doc) => {
      const u = usersById.get(doc.id)!;
      const inv = investMap.get(doc.id);
      const earn = earnMap.get(doc.id);
      const referrals = userReferrals.get(doc.id) || [];

      const matrixBalance = Number(
        u.matrixBalance ?? u.balance ?? 0,
      );
      const matrixLevel = Number(u.matrixLevel ?? 1);
      const matrixCycles = Number(
        u.matrixCycles ?? inv?.completedCycles ?? 0,
      );

      const totalInvested = inv?.totalInvested ?? 0;
      const hasMatrix =
        totalInvested > 0 ||
        matrixCycles > 0 ||
        referrals.length > 0 ||
        (earn?.totalPaid ?? 0) > 0;

      if (hasMatrix) totalParticipants += 1;
      if (referrals.length > 0) totalWithReferrals += 1;
      totalReferralCount += referrals.length;
      if ((inv?.activeCycles ?? 0) + (inv?.pendingCycles ?? 0) > 0)
        totalActiveInMatrix += 1;
      totalStaked += totalInvested;
      totalExpectedReturn += inv?.totalExpected ?? 0;
      totalEarningsAllTime += earn?.totalPaid ?? 0;
      totalMatrixPayouts += earn?.matrixPaid ?? 0;
      totalReferralPayouts += earn?.referralPaid ?? 0;
      totalCyclesAll += inv?.totalCycles ?? 0;
      totalCompletedCycles += inv?.completedCycles ?? 0;
      totalActiveCycles += (inv?.activeCycles ?? 0) + (inv?.pendingCycles ?? 0);

      const levelFilled = computeMatrixLevels(referrals.length);
      const referrerName = u.referredBy ? nameOf(u.referredBy) : null;

      const activeReferrals = referrals.filter((r) => {
        const ur = investMap.get(r);
        const ud = usersById.get(r);
        return (
          (ur && (ur.activeCycles + ur.pendingCycles + ur.completedCycles) > 0) ||
          (ud && ((ud.activeDeposits ?? 0) > 0 || (ud.totalDeposits ?? 0) > 0))
        );
      }).length;

      return {
        id: doc.id,
        uid: doc.id,
        firstName: u.firstName,
        lastName: u.lastName,
        fullName: u.fullName,
        username: u.username,
        usernameDisplay: u.usernameDisplay,
        email: u.email,
        photoURL: u.photoURL,
        country: u.country,
        city: u.city,
        status: u.status,
        createdAt: u.createdAt,
        joinedDate: u.joinedDate,
        referredBy: u.referredBy || null,
        referredByName: referrerName,
        matrixBalance,
        matrixLevel,
        matrixCycles,
        totalInvested,
        totalExpectedReturn: inv?.totalExpected ?? 0,
        totalEarningsPaid: inv?.totalEarningsPaid ?? 0,
        progressPct:
          (inv?.totalExpected ?? 0) > 0
            ? Math.min(
                100,
                Math.round(
                  ((inv?.totalEarningsPaid ?? 0) / (inv?.totalExpected ?? 1)) *
                    100,
                ),
              )
            : 0,
        totalPayouts: earn?.totalPayouts ?? 0,
        totalPaid: earn?.totalPaid ?? 0,
        matrixPaid: earn?.matrixPaid ?? 0,
        referralPaid: earn?.referralPaid ?? 0,
        cycles: {
          total: inv?.totalCycles ?? 0,
          active: inv?.activeCycles ?? 0,
          pending: inv?.pendingCycles ?? 0,
          completed: inv?.completedCycles ?? 0,
        },
        referrals: {
          total: referrals.length,
          active: activeReferrals,
          level1: levelFilled.level1.filled,
          level2: levelFilled.level2.filled,
          level3: levelFilled.level3.filled,
          level4: levelFilled.level4.filled,
          list: referrals.slice(0, 39).map((rid) => {
            const ru = usersById.get(rid);
            return {
              id: rid,
              email: ru?.email || null,
              fullName: nameOf(rid),
              createdAt: ru?.createdAt || null,
              active:
                (investMap.get(rid) &&
                  (investMap.get(rid)!.activeCycles +
                    investMap.get(rid)!.pendingCycles +
                    investMap.get(rid)!.completedCycles) >
                    0) ||
                (((ru?.activeDeposits ?? 0) > 0 ||
                  (ru?.totalDeposits ?? 0) > 0) as boolean),
            };
          }),
        },
      };
    });

    const matrixRows = deepSerializeTimestamps(raws);

    const summary = {
      totalParticipants,
      totalActiveInMatrix,
      totalWithReferrals,
      totalReferralCount,
      totalStaked,
      totalExpectedReturn,
      totalEarningsAllTime,
      totalMatrixPayouts,
      totalReferralPayouts,
      totalCycles: totalCyclesAll,
      totalActiveCycles,
      totalCompletedCycles,
      averageStakedPerParticipant:
        totalParticipants > 0 ? totalStaked / totalParticipants : 0,
      roiToDate:
        totalStaked > 0
          ? ((totalEarningsAllTime - totalStaked) / totalStaked) * 100
          : 0,
    };

    return NextResponse.json({
      success: true,
      rows: matrixRows,
      summary,
    });
  } catch (error: any) {
    console.error("[admin/matrix GET] ERROR:", error);
    const status =
      error?.message === "Forbidden" ||
      error?.message?.startsWith("Missing Authorization")
        ? 403
        : 500;
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status },
    );
  }
}

function computeMatrixLevels(totalReferrals: number) {
  const l1 = Math.min(totalReferrals, 2);
  const l2 = Math.min(Math.max(totalReferrals - 2, 0), 4);
  const l3 = Math.min(Math.max(totalReferrals - 6, 0), 8);
  const l4 = Math.min(Math.max(totalReferrals - 14, 0), 16);
  return {
    level1: { total: 2, filled: l1 },
    level2: { total: 4, filled: l2 },
    level3: { total: 8, filled: l3 },
    level4: { total: 16, filled: l4 },
  };
}
