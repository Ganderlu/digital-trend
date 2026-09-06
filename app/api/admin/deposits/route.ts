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
      .collection("deposits")
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

    const rawDeposits = await Promise.all(
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

    const deposits = deepSerializeTimestamps(rawDeposits);

    return NextResponse.json({
      success: true,
      deposits,
    });
  } catch (error: any) {
    console.error("[admin/deposits GET] ERROR:", error);
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
    const { depositId, status } = body || {};

    if (!depositId || typeof depositId !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid depositId" },
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

    const depositRef = db.collection("deposits").doc(depositId);

    const result = await db.runTransaction(async (transaction) => {
      const depositDoc = await transaction.get(depositRef);
      if (!depositDoc.exists) {
        throw new Error("Deposit document does not exist");
      }

      const depositData = depositDoc.data();
      if (depositData?.status !== "pending") {
        throw new Error("Deposit is already processed");
      }

      const userId = depositData?.userId;
      const amount = Number(depositData?.amount ?? 0);
      if (!userId) {
        throw new Error("Deposit is missing userId");
      }

      const userRef = db.collection("users").doc(userId);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User document does not exist");
      }

      const userData = userDoc.data() || {};

      let referralBonusApplied = false;
      let referralBonusAmount = 0;

      if (status === "approved") {
        const isFirstInvestment =
          (Number(userData.totalInvested) || 0) === 0 && !!userData.referredBy;

        if (isFirstInvestment) {
          const referrerRef = db.collection("users").doc(userData.referredBy);
          const referrerDoc = await transaction.get(referrerRef);
          if (referrerDoc.exists) {
            referralBonusAmount = amount * 0.1;
            referralBonusApplied = true;
            transaction.update(referrerRef, {
              balance: FieldValue.increment(referralBonusAmount),
              referralEarnings: FieldValue.increment(referralBonusAmount),
            });
          }
        }

        transaction.update(userRef, {
          balance: FieldValue.increment(amount),
          totalInvested: FieldValue.increment(amount),
          activeDeposits: FieldValue.increment(1),
        });
      }

      transaction.update(depositRef, {
        status,
        processedAt: Timestamp.now(),
      });

      return {
        referralBonusApplied,
        referralBonusAmount,
        userId,
        amount,
      };
    });

    return NextResponse.json({
      success: true,
      message: `Deposit ${status} successfully`,
      ...result,
    });
  } catch (error: any) {
    console.error("[admin/deposits PATCH] ERROR:", error);
    const status =
      error?.message === "Forbidden" ||
      error?.message?.startsWith("Missing Authorization")
        ? 403
        : error?.message === "Deposit document does not exist" ||
            error?.message === "Deposit is already processed" ||
            error?.message === "User document does not exist" ||
            error?.message === "Deposit is missing userId" ||
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
