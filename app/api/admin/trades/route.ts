import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { deepSerializeTimestamps } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdminFromRequest(request);
    const db = getAdminDb();

    const snapshot = await db
      .collection("trades")
      .orderBy("createdAt", "desc")
      .get();

    const userEmailCache = new Map<string, string>();
    const userFullNameCache = new Map<string, string>();

    const getUserInfo = async (userId: string) => {
      if (!userId) return { email: "Unknown", fullName: null };
      if (userEmailCache.has(userId)) {
        return {
          email: userEmailCache.get(userId) || "Unknown",
          fullName: userFullNameCache.get(userId) || null,
        };
      }
      try {
        const userDoc = await db.collection("users").doc(userId).get();
        const d = userDoc.exists ? userDoc.data() || {} : {};
        const email = (d.email as string) || "Unknown";
        const fullName =
          (d.fullName as string) ||
          [d.firstName, d.lastName].filter(Boolean).join(" ").trim() ||
          (d.usernameDisplay as string) ||
          null;
        userEmailCache.set(userId, email);
        userFullNameCache.set(userId, fullName || "");
        return { email, fullName };
      } catch {
        userEmailCache.set(userId, "Unknown");
        userFullNameCache.set(userId, "");
        return { email: "Unknown", fullName: null };
      }
    };

    let totalTrades = 0;
    let totalVolume = 0;
    let totalWon = 0;
    let totalLost = 0;
    let totalActive = 0;
    let totalSettled = 0;
    let totalPayout = 0;
    let totalPnl = 0;
    let totalInvested = 0;
    let uniqueTraders = new Set<string>();

    const rawTrades = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data() || {};
        const userId = (data.userId as string) || "";
        const { email, fullName } = data.userEmail
          ? { email: data.userEmail as string, fullName: null }
          : await getUserInfo(userId);

        const investment = Number(data.investment ?? 0);
        const payout = Number(data.payout ?? 0);
        const pnl = Number(data.pnl ?? (payout - investment));
        const status = (data.status as string) || "active";

        totalTrades += 1;
        totalVolume += investment;
        if (userId) uniqueTraders.add(userId);

        if (status === "won") {
          totalWon += 1;
          totalSettled += 1;
          totalInvested += investment;
          totalPayout += payout;
          totalPnl += pnl;
        } else if (status === "lost") {
          totalLost += 1;
          totalSettled += 1;
          totalInvested += investment;
          totalPnl += pnl;
        } else if (status === "settled") {
          totalSettled += 1;
          totalInvested += investment;
          totalPayout += payout;
          totalPnl += pnl;
        } else if (status === "active") {
          totalActive += 1;
          totalInvested += investment;
        }

        return {
          id: doc.id,
          ...data,
          userId,
          userEmail: email,
          userFullName: fullName,
          investment,
          payout,
          pnl,
          status,
        };
      }),
    );

    const trades = deepSerializeTimestamps(rawTrades);

    const winRate = totalWon + totalLost > 0
      ? (totalWon / (totalWon + totalLost)) * 100
      : 0;

    const summary = {
      totalTrades,
      totalVolume,
      totalInvested,
      totalWon,
      totalLost,
      totalActive,
      totalSettled,
      totalPayout,
      totalPnl,
      winRate,
      uniqueTraders: uniqueTraders.size,
      avgProfitPerTrade: totalSettled > 0 ? totalPnl / totalSettled : 0,
    };

    return NextResponse.json({
      success: true,
      trades,
      summary,
    });
  } catch (error: any) {
    console.error("[admin/trades GET] ERROR:", error);
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
