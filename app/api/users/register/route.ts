import { NextResponse } from "next/server";
import { requireUserFromRequest } from "@/lib/requestAuth";
import { getAdminDb, getAdminAuth } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const decoded = await requireUserFromRequest(request);
    const uid = decoded.uid;
    const db = getAdminDb();

    const body = await request.json();
    const {
      username,
      usernameDisplay,
      firstName,
      lastName,
      email,
      phone,
      country,
      state,
      city,
      address,
      postalCode,
      timezone,
      language,
      referredBy,
      registrationLocation,
      photoURL,
      photoPublicId,
    } = body;

    const fullName = `${firstName || ""} ${lastName || ""}`.trim();

    const userData: Record<string, any> = {
      username: (username || "").toLowerCase(),
      usernameDisplay: usernameDisplay || username || "",
      firstName: firstName || "",
      lastName: lastName || "",
      fullName,
      email: email || "",
      phone: phone || "",
      country: country || "",
      state: state || "",
      city: city || "",
      address: address || "",
      postalCode: postalCode || "",
      timezone: timezone || "",
      language: language || "English",
      createdAt: FieldValue.serverTimestamp(),
      joinedDate: FieldValue.serverTimestamp(),
      referredBy: referredBy || null,
      activeDeposits: 0,
      totalInvested: 0,
      referralEarnings: 0,
      balance: 0,
      registrationLocation: registrationLocation || null,
      profileVerificationStatus: "pending_review",
      profileSubmittedAt: FieldValue.serverTimestamp(),
    };

    if (photoURL) {
      userData.photoURL = photoURL;
      userData.photoPublicId = photoPublicId || null;
      userData.profileImageUploaded = true;
    }

    await db.collection("users").doc(uid).set(userData);

    try {
      await getAdminAuth().setCustomUserClaims(uid, {
        displayName: fullName || usernameDisplay || username || null,
      });
    } catch (claimsErr) {
      console.warn("[users/register] Could not set custom claims:", claimsErr);
    }

    return NextResponse.json({
      success: true,
      uid,
    });
  } catch (error: any) {
    console.error("[users/register] ERROR:", error);
    const status =
      error?.message === "Missing Authorization header" ||
      error?.code === "auth/id-token-expired" ||
      error?.code === "auth/argument-error"
        ? 401
        : 500;
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status },
    );
  }
}
