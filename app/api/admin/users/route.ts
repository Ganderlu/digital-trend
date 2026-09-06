import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { deepSerializeTimestamps } from "@/lib/serialize";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

function readClientIP(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  const cfConnecting = request.headers.get("cf-connecting-ip");
  if (cfConnecting) return cfConnecting.trim();
  const trueClient = request.headers.get("true-client-ip");
  if (trueClient) return trueClient.trim();
  try {
    const url = new URL(request.url);
    const host = url.hostname;
    if (host === "localhost" || host === "127.0.0.1") return "127.0.0.1";
    return "";
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  try {
    await requireAdminFromRequest(request);
    const db = getAdminDb();

    const [
      usersSnap,
      depositsSnap,
      withdrawalsSnap,
      investmentsSnap,
      referralsSnap,
    ] = await Promise.all([
      db.collection("users").orderBy("createdAt", "desc").get(),
      db.collection("deposits").get(),
      db.collection("withdrawals").get(),
      db.collection("investments").get(),
      db.collection("referrals").get(),
    ]);

    type AggMap = Map<
      string,
      {
        depositCount: number;
        depositTotal: number;
        approvedDeposits: number;
        approvedDepositTotal: number;
        withdrawCount: number;
        withdrawTotal: number;
        approvedWithdrawals: number;
        approvedWithdrawTotal: number;
        investmentCount: number;
        investmentTotal: number;
        activeInvestments: number;
        activeInvestmentTotal: number;
        referralCount: number;
        referralEarningsTotal: number;
      }
    >;

    const agg: AggMap = new Map();
    const ensure = (uid: string) => {
      let r = agg.get(uid);
      if (!r) {
        r = {
          depositCount: 0,
          depositTotal: 0,
          approvedDeposits: 0,
          approvedDepositTotal: 0,
          withdrawCount: 0,
          withdrawTotal: 0,
          approvedWithdrawals: 0,
          approvedWithdrawTotal: 0,
          investmentCount: 0,
          investmentTotal: 0,
          activeInvestments: 0,
          activeInvestmentTotal: 0,
          referralCount: 0,
          referralEarningsTotal: 0,
        };
        agg.set(uid, r);
      }
      return r;
    };

    for (const doc of depositsSnap.docs) {
      const d = doc.data();
      const uid = d.userId;
      if (!uid) continue;
      const r = ensure(uid);
      const amt =
        typeof d.amount === "number" ? d.amount : Number(d.amount) || 0;
      r.depositCount += 1;
      r.depositTotal += amt;
      if (
        d.status === "approved" ||
        d.status === "completed" ||
        d.status === "success"
      ) {
        r.approvedDeposits += 1;
        r.approvedDepositTotal += amt;
      }
    }

    for (const doc of withdrawalsSnap.docs) {
      const d = doc.data();
      const uid = d.userId;
      if (!uid) continue;
      const r = ensure(uid);
      const amt =
        typeof d.amount === "number" ? d.amount : Number(d.amount) || 0;
      r.withdrawCount += 1;
      r.withdrawTotal += amt;
      if (
        d.status === "approved" ||
        d.status === "completed" ||
        d.status === "success" ||
        d.status === "paid"
      ) {
        r.approvedWithdrawals += 1;
        r.approvedWithdrawTotal += amt;
      }
    }

    for (const doc of investmentsSnap.docs) {
      const d = doc.data();
      const uid = d.userId;
      if (!uid) continue;
      const r = ensure(uid);
      const amt =
        typeof d.amount === "number" ? d.amount : Number(d.amount) || 0;
      r.investmentCount += 1;
      r.investmentTotal += amt;
      if (d.status === "active") {
        r.activeInvestments += 1;
        r.activeInvestmentTotal += amt;
      }
    }

    for (const doc of referralsSnap.docs) {
      const d = doc.data();
      const uid = d.referrerId || d.fromUserId || d.referredBy;
      if (!uid) continue;
      const r = ensure(uid);
      r.referralCount += 1;
      const earned =
        typeof d.earnings === "number"
          ? d.earnings
          : typeof d.amount === "number"
            ? d.amount
            : Number(d.earnings || d.amount) || 0;
      r.referralEarningsTotal += earned;
    }

    const users = await Promise.all(
      usersSnap.docs.map(async (doc) => {
        const base = {
          id: doc.id,
          ...doc.data(),
        };
        const stats = agg.get(doc.id) || {
          depositCount: 0,
          depositTotal: 0,
          approvedDeposits: 0,
          approvedDepositTotal: 0,
          withdrawCount: 0,
          withdrawTotal: 0,
          approvedWithdrawals: 0,
          approvedWithdrawTotal: 0,
          investmentCount: 0,
          investmentTotal: 0,
          activeInvestments: 0,
          activeInvestmentTotal: 0,
          referralCount: 0,
          referralEarningsTotal: 0,
        };

        const baseAny = base as any;
        let referredByName = null;
        try {
          const refId = baseAny.referredBy;
          if (refId && typeof refId === "string" && refId.length > 0) {
            const refDoc = await db
              .collection("users")
              .where("username", "==", refId.toLowerCase())
              .limit(1)
              .get();
            if (!refDoc.empty) {
              const rd = refDoc.docs[0].data();
              referredByName =
                (rd.fullName as string) ||
                `${rd.firstName || ""} ${rd.lastName || ""}`.trim() ||
                rd.usernameDisplay ||
                rd.username ||
                refId;
            } else {
              const byIdDoc = await db.collection("users").doc(refId).get();
              if (byIdDoc.exists) {
                const rd = byIdDoc.data() || {};
                referredByName =
                  (rd.fullName as string) ||
                  `${rd.firstName || ""} ${rd.lastName || ""}`.trim() ||
                  rd.usernameDisplay ||
                  rd.username ||
                  refId;
              }
            }
          }
        } catch {}

        return deepSerializeTimestamps({
          ...base,
          stats,
          referredByName,
        });
      }),
    );

    const summary = {
      totalUsers: users.length,
      activeUsers: users.filter(
        (u) => u.status === undefined || u.status === "active",
      ).length,
      bannedUsers: users.filter((u) => u.status === "banned").length,
      pendingVerification: users.filter(
        (u) => u.profileVerificationStatus === "pending_review",
      ).length,
      verified: users.filter(
        (u) =>
          u.profileVerificationStatus === "approved" ||
          u.profileVerificationStatus === "verified",
      ).length,
      totalBalance: users.reduce(
        (s: number, u) => s + (Number(u.balance) || 0),
        0,
      ),
      totalDepositsAgg: users.reduce(
        (s: number, u) => s + (u.stats?.approvedDepositTotal || 0),
        0,
      ),
      totalWithdrawalsAgg: users.reduce(
        (s: number, u) => s + (u.stats?.approvedWithdrawTotal || 0),
        0,
      ),
    };

    return NextResponse.json({
      success: true,
      users,
      summary,
    });
  } catch (error: any) {
    console.error("[admin/users] ERROR:", error);
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

export async function PATCH(request: Request) {
  try {
    const adminClaim = await requireAdminFromRequest(request);
    const db = getAdminDb();

    const body = await request.json();
    const { userId, action, amount, note, status, verificationStatus } =
      body || {};

    if (!userId || typeof userId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid userId" },
        { status: 400 },
      );
    }

    const VALID_ACTIONS = [
      "increase_balance",
      "decrease_balance",
      "set_status",
      "set_verification",
    ] as const;
    type ValidAction = (typeof VALID_ACTIONS)[number];

    if (!VALID_ACTIONS.includes(action as any)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid action. Must be one of: ${VALID_ACTIONS.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const userRef = db.collection("users").doc(userId);
    const adminIp = readClientIP(request);
    const adminEmail =
      (adminClaim as any)?.email || (adminClaim as any)?.uid || "unknown_admin";
    const actionTyped = action as ValidAction;

    const result = await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User document does not exist");
      }
      const userData = userDoc.data() || {};

      if (
        actionTyped === "increase_balance" ||
        actionTyped === "decrease_balance"
      ) {
        const numAmount = Number(amount);
        if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
          throw new Error("Invalid amount. Must be a positive number");
        }
        if (note !== undefined && note !== null && typeof note !== "string") {
          throw new Error("Invalid note. Must be a string");
        }
        const delta =
          actionTyped === "increase_balance" ? numAmount : -numAmount;
        const oldBalance = Number(userData.balance) || 0;
        const newBalance = oldBalance + delta;

        if (actionTyped === "decrease_balance" && newBalance < 0) {
          throw new Error(
            "Insufficient balance. Cannot decrease below current balance.",
          );
        }

        transaction.update(userRef, {
          balance: FieldValue.increment(delta),
        });

        const logRef = db
          .collection("users")
          .doc(userId)
          .collection("balanceAdjustments")
          .doc();

        transaction.set(logRef, {
          id: logRef.id,
          userId,
          action: actionTyped,
          amount: numAmount,
          delta,
          oldBalance,
          newBalance,
          note: note || null,
          adminEmail,
          adminIp,
          createdAt: Timestamp.now(),
        });

        return {
          userId,
          action: actionTyped,
          amount: numAmount,
          delta,
          oldBalance,
          newBalance,
        };
      }

      if (actionTyped === "set_status") {
        if (status !== "active" && status !== "banned") {
          throw new Error("Invalid status. Must be 'active' or 'banned'");
        }
        const oldStatus = userData.status || "active";
        transaction.update(userRef, { status });
        return {
          userId,
          action: actionTyped,
          oldStatus,
          newStatus: status,
        };
      }

      if (actionTyped === "set_verification") {
        const validV = ["approved", "rejected", "pending_review", "verified"];
        if (!validV.includes(verificationStatus)) {
          throw new Error(
            `Invalid verificationStatus. Must be one of: ${validV.join(", ")}`,
          );
        }
        const oldVerification = userData.profileVerificationStatus || null;
        transaction.update(userRef, {
          profileVerificationStatus: verificationStatus,
        });
        return {
          userId,
          action: actionTyped,
          oldVerification,
          newVerification: verificationStatus,
        };
      }

      throw new Error("Unhandled action");
    });

    return NextResponse.json({
      success: true,
      message: `${actionTyped.replace("_", " ")} completed successfully`,
      ...result,
    });
  } catch (error: any) {
    console.error("[admin/users PATCH] ERROR:", error);
    const status =
      error?.message === "Forbidden" ||
      error?.message?.startsWith("Missing Authorization")
        ? 403
        : error?.message === "User document does not exist" ||
            error?.message ===
              "Insufficient balance. Cannot decrease below current balance." ||
            error?.message?.startsWith("Invalid ") ||
            error?.message?.startsWith("Missing or invalid")
          ? 400
          : 500;
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status },
    );
  }
}
