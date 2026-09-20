import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireUserFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";

type PlanType = "investment" | "matrix";

type MatrixMeta = {
  matrixStructure?: string;
  matrixCyclePayout?: number;
  matrixLevel?: number;
};

export async function POST(request: Request) {
  try {
    const decoded = await requireUserFromRequest(request);
    const body = (await request.json().catch(() => ({}))) as {
      planId?: string;
      planName?: string;
      planType?: PlanType;
      amount?: number;
      roi?: number;
      durationDays?: number;
      totalReturn?: number;
      matureAt?: string;
      matrixStructure?: string;
      matrixCyclePayout?: number;
      matrixLevel?: number;
    };

    const planType: PlanType =
      body.planType === "matrix" ? "matrix" : "investment";
    const planId = String(body.planId || "").slice(0, 100);
    const planName = String(body.planName || "").slice(0, 200);
    const amount = Number(body.amount);
    const roi = body.roi != null ? Number(body.roi) : 0;
    const durationDays = body.durationDays != null ? Number(body.durationDays) : 0;
    const totalReturn =
      body.totalReturn != null ? Number(body.totalReturn) : amount + roi * amount;
    const matureAt =
      body.matureAt && !isNaN(Date.parse(body.matureAt))
        ? new Date(body.matureAt)
        : durationDays > 0
        ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
        : null;

    if (!planId || !planName) {
      return NextResponse.json(
        { ok: false, error: "Plan details missing" },
        { status: 400 },
      );
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json(
        { ok: false, error: "Invalid amount" },
        { status: 400 },
      );
    }

    const adminDb = getAdminDb();
    const userRef = adminDb.collection("users").doc(decoded.uid);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { ok: false, error: "User not found" },
        { status: 404 },
      );
    }

    const currentBalance = Number(userSnap.data()?.balance || 0);
    if (currentBalance < amount) {
      return NextResponse.json(
        { ok: false, error: "Insufficient balance" },
        { status: 400 },
      );
    }

    await adminDb.runTransaction(async (tx) => {
      const lockedUserSnap = await tx.get(userRef);
      const lockedBalance = Number(lockedUserSnap.data()?.balance || 0);
      if (lockedBalance < amount) {
        throw new Error("Insufficient balance");
      }

      tx.update(userRef, {
        balance: FieldValue.increment(-amount),
        activeDeposits: FieldValue.increment(amount),
        ...(planType === "matrix"
          ? { matrixLevel: Math.max(Number(lockedUserSnap.data()?.matrixLevel || 1), 1) }
          : {}),
        updatedAt: FieldValue.serverTimestamp(),
      });

      const investmentRef = adminDb.collection("investments").doc();
      const baseInvestment = {
        userId: decoded.uid,
        userEmail: decoded.email || "",
        planId,
        planName,
        planType,
        amount,
        status: "active",
        startDate: FieldValue.serverTimestamp(),
        createdAt: FieldValue.serverTimestamp(),
        earningsPaid: 0,
        totalReturn,
        ...(planType === "investment"
          ? {
              roi,
              durationDays,
              matureAt: matureAt ? FieldValue.serverTimestamp() : null,
              ...(matureAt ? { matureAtTimestamp: matureAt.getTime() } : {}),
            }
          : {
              roi: 0,
              durationDays: 0,
              matureAt: null,
              ...(body.matrixStructure
                ? { matrixStructure: String(body.matrixStructure).slice(0, 50) }
                : {}),
              ...(body.matrixCyclePayout != null
                ? { matrixCyclePayout: Number(body.matrixCyclePayout) }
                : {}),
              ...(body.matrixLevel != null
                ? { matrixLevel: Number(body.matrixLevel) }
                : {}),
            }),
      };

      tx.create(investmentRef, baseInvestment);
    });

    return NextResponse.json({ ok: true, amount, planType });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isProjectIdError =
      typeof message === "string" &&
      (message.includes("Unable to detect a Project Id") ||
        message.includes("Firebase Admin not configured"));

    return NextResponse.json(
      {
        ok: false,
        error: isProjectIdError
          ? "Server Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY (JSON or base64) on the server (Vercel Environment Variables), or set FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY."
          : message,
      },
      { status: 500 },
    );
  }
}
