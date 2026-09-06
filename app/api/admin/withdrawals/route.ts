import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { deepSerializeTimestamps } from "@/lib/serialize";
import { FieldValue, Timestamp } from "firebase-admin/firestore";

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
    console.error("[admin/withdrawals GET] ERROR:", error);
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
    await requireAdminFromRequest(request);
    const db = getAdminDb();

    const body = await request.json();
    const { withdrawalId, status } = body || {};

    if (!withdrawalId || typeof withdrawalId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid withdrawalId" },
        { status: 400 },
      );
    }

    if (status !== "approved" && status !== "rejected") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid status. Must be 'approved' or 'rejected'",
        },
        { status: 400 },
      );
    }

    const withdrawalRef = db.collection("withdrawals").doc(withdrawalId);

    const result = await db.runTransaction(async (transaction) => {
      const withdrawalDoc = await transaction.get(withdrawalRef);
      if (!withdrawalDoc.exists) {
        throw new Error("Withdrawal document does not exist");
      }

      const withdrawalData = withdrawalDoc.data();
      if (withdrawalData?.status !== "pending") {
        throw new Error("Withdrawal is already processed");
      }

      const userId = withdrawalData?.userId;
      const amount = Number(withdrawalData?.amount ?? 0);
      if (!userId) {
        throw new Error("Withdrawal is missing userId");
      }

      const userRef = db.collection("users").doc(userId);

      if (status === "approved") {
        const userDoc = await transaction.get(userRef);
        if (!userDoc.exists) {
          throw new Error("User document does not exist");
        }

        const currentBalance = Number(userDoc.data()?.balance ?? 0);
        if (currentBalance < amount) {
          throw new Error(
            `Insufficient user balance! Current: ${currentBalance}, Requested: ${amount}`,
          );
        }

        transaction.update(userRef, {
          balance: FieldValue.increment(-amount),
        });
      }

      transaction.update(withdrawalRef, {
        status,
        processedAt: Timestamp.now(),
      });

      return {
        userId,
        amount,
        deducted: status === "approved",
      };
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal ${status} successfully`,
      ...result,
    });
  } catch (error: any) {
    console.error("[admin/withdrawals PATCH] ERROR:", error);
    const status =
      error?.message === "Forbidden" ||
      error?.message?.startsWith("Missing Authorization")
        ? 403
        : error?.message === "Withdrawal document does not exist" ||
            error?.message === "Withdrawal is already processed" ||
            error?.message === "User document does not exist" ||
            error?.message === "Withdrawal is missing userId" ||
            error?.message?.startsWith("Insufficient user balance") ||
            error?.message?.startsWith("Invalid status") ||
            error?.message?.startsWith("Missing or invalid")
          ? 400
          : 500;
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status },
    );
  }
}
