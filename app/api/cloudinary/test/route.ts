import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const CLOUD_NAME =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "ddhhtyev6";
  const API_KEY =
    process.env.CLOUDINARY_API_KEY ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    "874492728653311";
  const API_SECRET =
    process.env.CLOUDINARY_API_SECRET || "R4WTfNPjIw2QxIGXWCZeQIbgobw";

  try {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
      secure: true,
    });

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing Cloudinary environment variables",
          cloudName: CLOUD_NAME || "Missing",
          apiKey: API_KEY ? "Configured" : "Missing",
          apiSecret: API_SECRET ? "Configured" : "Missing",
        },
        { status: 500 },
      );
    }

    const usageResult = await cloudinary.api.usage();

    return NextResponse.json({
      success: true,
      message: "Cloudinary is configured and working correctly",
      cloudName: CLOUD_NAME,
      apiKey: "Configured",
      apiSecret: "Configured",
      usage: {
        plan: usageResult.plan,
        lastUpdated: usageResult.last_updated,
      },
    });
  } catch (error: any) {
    console.error("Cloudinary test error:", {
      message: error?.message,
      name: error?.name,
      code: error?.code,
      http_code: error?.http_code,
    });
    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Cloudinary configuration error (check server logs for details)",
        error: error?.message || "Unknown error",
        cloudName: CLOUD_NAME || "Missing",
        apiKey: API_KEY ? "Configured" : "Missing",
        apiSecret: API_SECRET ? "Configured" : "Missing",
      },
      { status: 500 },
    );
  }
}
