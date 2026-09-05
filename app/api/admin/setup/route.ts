import { NextResponse } from "next/server";
import { getAdminAuth, getAdminDb } from "@/lib/firebaseAdmin";
import { requireUserFromRequest } from "@/lib/requestAuth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const decoded = await requireUserFromRequest(request);
    const uid = decoded.uid;
    const email = (decoded.email || "").toLowerCase();

    const auth = getAdminAuth();
    const db = getAdminDb();

    const SUPER_ADMIN_EMAIL = "cjonwubuya@gmail.com";

    const isSuperAdminEmail = email === SUPER_ADMIN_EMAIL.toLowerCase();

    const userDocRef = db.collection("users").doc(uid);
    const userSnap = await userDocRef.get();
    const userData = userSnap.exists ? userSnap.data() : null;
    const hasFirestoreAdminRole = userData?.role === "admin" || userData?.role === "ADMIN";

    let firstUserEver = false;
    if (!isSuperAdminEmail && !hasFirestoreAdminRole) {
      const usersSnapshot = await db
        .collection("users")
        .limit(2)
        .get();
      firstUserEver = usersSnapshot.size <= 1 && usersSnapshot.docs[0]?.id === uid;
    }

    const authorized =
      isSuperAdminEmail || hasFirestoreAdminRole || firstUserEver;

    if (!authorized) {
      console.warn(
        `[admin/setup] Unauthorized attempt by uid=${uid} email=${email}. ` +
          `Not super-admin, no Firestore admin role, and not the first user.`,
      );
      return NextResponse.json(
        {
          success: false,
          error:
            "Not authorized to grant admin claims. " +
            "You must be the first user, the super-admin (" +
            SUPER_ADMIN_EMAIL +
            "), or already have Firestore role=admin.",
        },
        { status: 403 },
      );
    }

    await auth.setCustomUserClaims(uid, {
      admin: true,
      isAdmin: true,
      role: "admin",
      grantedAt: new Date().toISOString(),
      grantedBy: isSuperAdminEmail
        ? "superadmin-email"
        : firstUserEver
          ? "first-user-bootstrap"
          : "existing-firestore-role",
    });

    try {
      await userDocRef.set(
        {
          role: "admin",
          adminClaimsGrantedAt: new Date().toISOString(),
          updatedAt: new Date(),
        },
        { merge: true },
      );
    } catch (mergeErr) {
      console.warn(
        "[admin/setup] Non-fatal: could not write role=admin to users doc:",
        mergeErr,
      );
    }

    try {
      await auth.revokeRefreshTokens(uid);
    } catch (revokeErr) {
      console.warn(
        "[admin/setup] Non-fatal: could not revoke refresh tokens (user must sign out manually):",
        revokeErr,
      );
    }

    const refreshed = await auth.getUser(uid);

    console.log(
      `[admin/setup] Admin custom claims GRANTED for uid=${uid} email=${email}. ` +
        `Source=${
          isSuperAdminEmail
            ? "superadmin-email"
            : firstUserEver
              ? "first-user-bootstrap"
              : "existing-firestore-role"
        }`,
    );

    return NextResponse.json({
      success: true,
      message:
        "Admin custom claims set. Please SIGN OUT and SIGN BACK IN for the new token to take effect.",
      mustSignOutAndBackIn: true,
      user: {
        uid: refreshed.uid,
        email: refreshed.email,
        customClaims: refreshed.customClaims,
      },
    });
  } catch (error: any) {
    console.error("[admin/setup] ERROR:", error);
    const status = error?.message?.startsWith("Missing Authorization")
      ? 401
      : 500;
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status },
    );
  }
}
