import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export async function requireUserFromRequest(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    throw new Error("Missing Authorization header");
  }

  const token = match[1];
  const decoded = await adminAuth.verifyIdToken(token);
  return decoded;
}

export async function requireAdminFromRequest(request: Request) {
  const decoded = await requireUserFromRequest(request);

  const email = decoded.email || "";
  if (email.toLowerCase() === "cjonwubuya@gmail.com") {
    return decoded;
  }

  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  if (userDoc.exists && userDoc.data()?.role === "admin") {
    return decoded;
  }

  throw new Error("Forbidden");
}
