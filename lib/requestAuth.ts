import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";

function getFriendlyAuthError(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code || "")
      : "";
  const rawMessage =
    error instanceof Error ? error.message : String(error || "");

  switch (code) {
    case "auth/id-token-expired":
    case "auth/session-expired":
      return "Your session has expired. Please refresh the page or sign in again to continue.";
    case "auth/argument-error":
    case "auth/invalid-id-token":
      if (rawMessage.includes("expired")) {
        return "Your session has expired. Please sign in again to continue.";
      }
      return "We couldn't verify your credentials. Please sign out and sign in again.";
    case "auth/id-token-revoked":
      return "Your session has been revoked for security. Please sign in again with your password.";
    case "auth/user-not-found":
      return "This account no longer exists. Please contact support or sign up again.";
    case "auth/user-disabled":
      return "This account has been restricted. Please contact support@tevextra.com for help.";
    case "auth/certificate-error":
    case "auth/invalid-issuer":
    case "auth/Invalid-issuer":
      return "Our security service is temporarily unavailable. Please wait a moment and try again.";
    default:
      if (rawMessage.includes("expired")) {
        return "Your session has expired. Please sign in again to continue.";
      }
      if (
        rawMessage.includes("verifyIdToken") ||
        rawMessage.includes("ID token") ||
        rawMessage.includes("id-token") ||
        rawMessage.includes("Firebase")
      ) {
        return "We couldn't verify your admin session. Please sign out and sign back in, then try again.";
      }
      if (rawMessage && rawMessage.length > 0) return rawMessage;
      return "We couldn't verify your credentials. Please sign in again.";
  }
}

export async function requireUserFromRequest(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    throw new Error(
      "Not signed in. Please sign in to your account to continue.",
    );
  }

  const token = match[1];
  try {
    const decoded = await getAdminAuth().verifyIdToken(token, true);
    return decoded;
  } catch (err) {
    const friendly = getFriendlyAuthError(err);
    throw new Error(friendly);
  }
}

export async function requireAdminFromRequest(request: Request) {
  const decoded = await requireUserFromRequest(request);

  const email = (decoded.email || "").toString().toLowerCase();
  if (email === "cjonwubuya@gmail.com") {
    return decoded;
  }

  try {
    const userDoc = await getAdminDb()
      .collection("users")
      .doc(decoded.uid)
      .get();
    if (userDoc.exists && userDoc.data()?.role === "admin") {
      return decoded;
    }
  } catch (dbErr) {
    console.error("Admin DB lookup failed:", dbErr);
    throw new Error(
      "We couldn't verify your admin permissions right now. Please try again in a moment.",
    );
  }

  throw new Error(
    "You don't have permission to access this admin area. Please contact TeveXtra support to request access.",
  );
}
