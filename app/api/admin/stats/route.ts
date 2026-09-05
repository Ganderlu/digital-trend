import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdminFromRequest(request);
    const db = getAdminDb();

    const [
      usersSnapshot,
      depositsSnapshot,
      withdrawalsSnapshot,
      investmentsSnapshot,
    ] = await Promise.all([
      db.collection("users").get(),
      db.collection("deposits").get(),
      db.collection("withdrawals").get(),
      db.collection("investments").get(),
    ]);

    const totalUsers = usersSnapshot.size;

    let totalDeposits = 0;
    let pendingDeposits = 0;
    depositsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === "approved" || data.status === "completed") {
        totalDeposits += Number(data.amount) || 0;
      } else if (data.status === "pending") {
        pendingDeposits++;
      }
    });

    let totalWithdrawals = 0;
    let pendingWithdrawals = 0;
    withdrawalsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === "approved" || data.status === "completed") {
        totalWithdrawals += Number(data.amount) || 0;
      } else if (data.status === "pending") {
        pendingWithdrawals++;
      }
    });

    let activeInvestments = 0;
    investmentsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.status === "active") {
        activeInvestments++;
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalDeposits,
        totalWithdrawals,
        activeInvestments,
        pendingDeposits,
        pendingWithdrawals,
      },
    });
  } catch (error: any) {
    console.error("[admin/stats] ERROR:", error);
    const status = error?.message === "Forbidden" || error?.message?.startsWith("Missing Authorization")
      ? 403
      : 500;
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status },
    );
  }
}
