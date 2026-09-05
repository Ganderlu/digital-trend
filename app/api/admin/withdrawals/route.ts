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
      .collection("withdrawals")
      .orderBy("createdAt", "desc")
      .get();

    const userEmailCache = new Map<string, string>();
    const getUserEmail = async (userId: string): Promise<string> => {
      if (!userId) return "Unknown";
      if (userEmailCache.has(userId)) return userEmailCache.get(userId)!;
      try {
        const userDoc = await db.collection("users").doc(userId).get();
        const email = userDoc.exists
          ? userDoc.data()?.email || "Unknown"
          : "Unknown";
        userEmailCache.set(userId, email);
        return email;
      } catch {
        userEmailCache.set(userId, "Unknown");
        return "Unknown";
      }
    };

    const rawWithdrawals = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const userEmail = data.userEmail || (await getUserEmail(data.userId));
        return {
          id: doc.id,
          ...data,
          userEmail,
        };
      }),
    );

    const withdrawals = deepSerializeTimestamps(rawWithdrawals);

    return NextResponse.json({
      success: true,
      withdrawals,
    });
  } catch (error: any) {
    console.error("[admin/withdrawals] ERROR:", error);
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
