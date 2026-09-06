import { NextResponse } from "next/server";
import { requireUserFromRequest } from "@/lib/requestAuth";
import { getAdminDb, getAdminAuth } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

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

async function lookupIPGeo(ip: string): Promise<Record<string, any> | null> {
  if (!ip) return null;
  try {
    const res = await fetch(
      `https://ipapi.co/${encodeURIComponent(ip)}/json/`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.ip) return null;
    return {
      ip: data.ip,
      city: data.city || null,
      region: data.region || null,
      country: data.country_name || data.country || null,
      countryCode: data.country_code || null,
      postal: data.postal || null,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      timezone: data.timezone || null,
      currency: data.currency || null,
      asn: data.asn || null,
      provider: data.org || data.isp || null,
      latitudeLongitude:
        data.latitude && data.longitude
          ? `${data.latitude}, ${data.longitude}`
          : null,
    };
  } catch (e) {
    console.warn("[users/register] IP lookup failed for", ip, e);
    return null;
  }
}

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

    const clientIP = readClientIP(request);
    const serverGeo = await lookupIPGeo(clientIP);

    const mergedLocation: Record<string, any> = {
      ip: serverGeo?.ip || registrationLocation?.ip || clientIP || null,
      city: serverGeo?.city || registrationLocation?.cityAuto || city || null,
      region:
        serverGeo?.region || registrationLocation?.regionAuto || state || null,
      country:
        serverGeo?.country ||
        registrationLocation?.countryAuto ||
        country ||
        null,
      countryCode: serverGeo?.countryCode || null,
      postal: serverGeo?.postal || postalCode || null,
      latitude: serverGeo?.latitude || null,
      longitude: serverGeo?.longitude || null,
      latitudeLongitude: serverGeo?.latitudeLongitude || null,
      timezone:
        serverGeo?.timezone ||
        timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        null,
      currency: serverGeo?.currency || null,
      asn: serverGeo?.asn || null,
      provider: serverGeo?.provider || registrationLocation?.provider || null,
      userSelectedCountry: country || null,
      userSelectedRegion: state || null,
      userSelectedCity: city || null,
      registeredAt: FieldValue.serverTimestamp(),
      userAgent: request.headers.get("user-agent") || null,
      referer: request.headers.get("referer") || null,
    };

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
      registrationLocation: mergedLocation,
      lastActivityAt: FieldValue.serverTimestamp(),
      accountStatus: "pending_verification",
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
