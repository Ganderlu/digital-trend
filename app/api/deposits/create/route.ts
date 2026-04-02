import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { requireUserFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";

const allowedCurrencies = new Set(["BTC", "ETH", "USDT", "XRP"]);

export async function POST(request: Request) {
  try {
    const decoded = await requireUserFromRequest(request);
    const body = (await request.json().catch(() => ({}))) as {
      amount?: number;
      currency?: string;
      transactionHash?: string;
    };

    const currency = String(body.currency || "").toUpperCase();
    const amount = Number(body.amount);
    const transactionHash = String(body.transactionHash || "Not provided");

    if (!allowedCurrencies.has(currency)) {
      return NextResponse.json({ ok: false, error: "Invalid currency" }, { status: 400 });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid amount" }, { status: 400 });
    }

    const adminDb = getAdminDb();
    const settingsSnap = await adminDb.collection("settings").doc("global").get();
    const settings = settingsSnap.data() || {};
    const walletByCurrency: Record<string, string> = {
      BTC: String(settings.walletBTC || ""),
      ETH: String(settings.walletETH || ""),
      USDT: String(settings.walletUSDT || ""),
      XRP: String(settings.walletXRP || ""),
    };

    const walletAddress = walletByCurrency[currency] || "";
    if (!walletAddress) {
      return NextResponse.json({ ok: false, error: "Wallet address not configured" }, { status: 400 });
    }

    const userEmail = decoded.email || "";
    const ref = await adminDb.collection("deposits").add({
      userId: decoded.uid,
      userEmail,
      amount,
      currency,
      status: "pending",
      walletAddress,
      transactionHash,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true, depositId: ref.id });
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
