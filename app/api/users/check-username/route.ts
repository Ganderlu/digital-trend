import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = (searchParams.get("username") || "").trim().toLowerCase();

    if (!username || username.length < 3) {
      return NextResponse.json({
        success: true,
        available: false,
        checked: false,
      });
    }

    const db = getAdminDb();
    const snap = await db
      .collection("users")
      .where("username", "==", username)
      .limit(1)
      .get();

    return NextResponse.json({
      success: true,
      available: snap.empty,
      checked: true,
    });
  } catch (error: any) {
    console.error("[users/check-username] ERROR:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Unknown error" },
      { status: 500 },
    );
  }
}
