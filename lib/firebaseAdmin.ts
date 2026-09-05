import {
  applicationDefault,
  cert,
  initializeApp,
  getApps,
  getApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function stripQuotes(value: string) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseServiceAccount(raw: string) {
  const cleaned = stripQuotes(raw);
  const tryParse = (text: string) => {
    const parsed = JSON.parse(text);
    if (typeof parsed?.private_key === "string") {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  };

  try {
    return tryParse(cleaned);
  } catch {
    try {
      const decoded = Buffer.from(cleaned, "base64").toString("utf8");
      return tryParse(decoded);
    } catch {
      return null;
    }
  }
}

let initDone = false;
let initError: Error | null = null;

function resolveStorageBucket(projectId?: string): string {
  const validBucket = (candidate: string | undefined | null): string | null => {
    if (!candidate) return null;
    const cleaned = stripQuotes(candidate).trim();
    if (!cleaned) return null;
    if (cleaned.endsWith(".firebasestorage.app")) {
      return cleaned.replace(/\.firebasestorage\.app$/, ".appspot.com");
    }
    return cleaned;
  };

  const candidates = [
    validBucket(process.env.FIREBASE_STORAGE_BUCKET),
    validBucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
    projectId ? `${projectId}.appspot.com` : null,
    "digital-trend-4334a.appspot.com",
  ].filter(Boolean) as string[];

  return candidates[0];
}

function ensureAdminInitialized() {
  if (initDone) return;
  if (getApps().length > 0) {
    try {
      getApp();
      initDone = true;
      return;
    } catch {}
  }
  initDone = true;

  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  const serviceAccount = serviceAccountRaw
    ? parseServiceAccount(serviceAccountRaw)
    : null;

  const projectId =
    serviceAccount?.project_id ||
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  const storageBucket = resolveStorageBucket(projectId);
  console.log("[firebaseAdmin] Resolved storage bucket:", storageBucket);

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  try {
    if (serviceAccount?.client_email && serviceAccount?.private_key) {
      initializeApp({
        credential: cert(serviceAccount),
        projectId,
        storageBucket,
      });
      if (projectId) {
        console.log("Firebase Admin initialized with projectId:", projectId);
      }
      return;
    }

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
        storageBucket,
      });
      console.log("Firebase Admin initialized with projectId:", projectId);
      return;
    }

    if (projectId) {
      initializeApp({
        credential: applicationDefault(),
        projectId,
        storageBucket,
      });
      console.log("Firebase Admin initialized with projectId:", projectId);
      return;
    }

    initError = new Error(
      "Firebase Admin not configured: missing projectId. Set FIREBASE_SERVICE_ACCOUNT_KEY (JSON or base64) on the server (Vercel Environment Variables), or set FIREBASE_PROJECT_ID.",
    );
  } catch (error: unknown) {
    initError =
      error instanceof Error
        ? error
        : new Error("Firebase Admin initialization failed");
  }
}

export function getAdminAuth() {
  ensureAdminInitialized();
  if (initError) throw initError;
  return getAuth();
}

export function getAdminDb() {
  ensureAdminInitialized();
  if (initError) throw initError;
  return getFirestore();
}

export function getAdminStorage() {
  ensureAdminInitialized();
  if (initError) throw initError;
  return getStorage();
}
