import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/requestAuth";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { serializeSnapshotDocs } from "@/lib/serialize";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdminFromRequest(request);
    const db = getAdminDb();

    const snapshot = await db.collection("users").get();
    const users = serializeSnapshotDocs(snapshot);

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error: any) {
    console.error("[admin/users] ERROR:", error);
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
