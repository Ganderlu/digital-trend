import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { file, folder, publicId } = body;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File (base64 or URL) is required" },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, folder, publicId);

    return NextResponse.json({
      success: true,
      message: "Upload successful",
      data: result,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
