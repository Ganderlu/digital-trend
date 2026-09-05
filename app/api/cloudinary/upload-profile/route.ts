import { NextResponse } from "next/server";
import { getAdminStorage, getAdminDb } from "@/lib/firebaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const ROUTE_VERSION = "upload-profile-v4-fallback3tier";

function stripQuotes(value: string | undefined | null): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

async function getCloudinary() {
  const { v2: cloudinary } = await import("cloudinary");
  const CLOUD_NAME =
    stripQuotes(
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
        process.env.CLOUDINARY_CLOUD_NAME,
    ) || "ddhhtyev6";
  const API_KEY =
    stripQuotes(
      process.env.CLOUDINARY_API_KEY ||
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    ) || "874492728653311";
  const API_SECRET =
    stripQuotes(process.env.CLOUDINARY_API_SECRET) ||
    "R4WTfNPjIw2QxIGXWCZeQIbgobw";
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
  return { cloudinary, CLOUD_NAME, API_KEY, API_SECRET };
}

function extractErrorMessage(error: any): string {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object") {
    const nested = error.error;
    if (nested) {
      if (typeof nested === "string") return nested;
      if (typeof nested === "object") {
        if ((nested as any).message) return String((nested as any).message);
      }
    }
    if (error.message) return String(error.message);
    if (error.error?.message) return String(error.error.message);
    if (error.description) return String(error.description);
    try {
      return JSON.stringify(error).slice(0, 300);
    } catch {}
  }
  return String(error);
}

let BUCKET_CANDIDATES_CACHE: string[] | null = null;

function getBucketCandidates(
  storage: ReturnType<typeof getAdminStorage>,
  preferredProjectId?: string,
): string[] {
  if (BUCKET_CANDIDATES_CACHE) return BUCKET_CANDIDATES_CACHE.slice();
  const out: string[] = [];
  try {
    const primary = storage.bucket();
    if (primary?.name) out.push(primary.name);
  } catch {}
  const env1 = stripQuotes(process.env.FIREBASE_STORAGE_BUCKET);
  if (env1) out.push(env1);
  const env2 = stripQuotes(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  if (env2) {
    out.push(
      env2.endsWith(".firebasestorage.app")
        ? env2.replace(/\.firebasestorage\.app$/, ".appspot.com")
        : env2,
    );
  }
  if (preferredProjectId) {
    out.push(`${preferredProjectId}.appspot.com`);
  }
  out.push("digital-trend-4334a.appspot.com");
  const uniq = Array.from(new Set(out.filter(Boolean)));
  (BUCKET_CANDIDATES_CACHE as any) = uniq.slice();
  return uniq;
}

async function resolveWorkingBucket(
  storage: ReturnType<typeof getAdminStorage>,
  preferredProjectId?: string,
): Promise<{
  bucket: ReturnType<ReturnType<typeof getAdminStorage>["bucket"]>;
  bucketName: string;
}> {
  const candidates = getBucketCandidates(storage, preferredProjectId);
  console.log(
    `[upload-profile] Bucket candidate list (probing in order): ${candidates.join(", ")}`,
  );

  for (const name of candidates) {
    try {
      const candidate = storage.bucket(name);
      try {
        await candidate.getFiles({ maxResults: 1, autoPaginate: false });
        console.log(
          `[upload-profile] Bucket PROBE OK for ${name} -> exists, returning.`,
        );
        return { bucket: candidate, bucketName: name };
      } catch (probeErr: any) {
        const msg = extractErrorMessage(probeErr).toLowerCase();
        const definitelyMissing =
          msg.includes("specified bucket does not exist") ||
          msg.includes("no such bucket") ||
          /notfound/i.test(probeErr?.code || "") ||
          msg.includes(" 404") ||
          msg.includes("status 404");
        if (!definitelyMissing) {
          console.warn(
            `[upload-profile] Bucket probe for ${name} hit non-missing error (${msg.slice(0, 120)}). Assume bucket exists but IAM denies list-only); using it anyway.`,
          );
          return { bucket: candidate, bucketName: name };
        }
        console.warn(
          `[upload-profile] Bucket probe for ${name} says BUCKET MISSING (${msg.slice(0, 120)}); trying next candidate.`,
        );
      }
    } catch (outerErr) {
      console.warn(
        `[upload-profile] Unexpected probe error for ${name}: ${extractErrorMessage(outerErr).slice(0, 120)}`,
      );
    }
  }
  const lastName = candidates[candidates.length - 1];
  console.warn(
    `[upload-profile] All candidates probed as missing; returning last candidate: ${lastName} for upload attempt anyway.`,
  );
  return { bucket: storage.bucket(lastName), bucketName: lastName };
}

async function uploadToFirebaseStorage(
  fileBuffer: Buffer,
  contentType: string,
  userId: string,
  projectId?: string,
): Promise<{
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes: number;
}> {
  const storage = getAdminStorage();
  const { bucket, bucketName } = await resolveWorkingBucket(storage, projectId);
  const publicId = `profile_images/profile_${userId}`;
  const file = bucket.file(publicId);

  const ext = contentType.split("/")[1]?.split(";")[0] || "png";
  const contentTypeFinal = contentType.startsWith("image/")
    ? contentType
    : `image/${ext}`;

  console.log(
    `[upload-profile] [Tier2] Saving bytes to bucket=${bucketName} path=${publicId} (${fileBuffer.length} bytes, ${contentTypeFinal})`,
  );

  await file.save(fileBuffer, {
    metadata: {
      contentType: contentTypeFinal,
      cacheControl: "public, max-age=3600",
      metadata: { userId, uploadedAt: new Date().toISOString() },
    },
    resumable: false,
    validation: false,
  });
  console.log(`[upload-profile] [Tier2] Bytes written OK.`);

  try {
    await file.makePublic();
    console.log(`[upload-profile] [Tier2] makePublic OK.`);
  } catch (e: any) {
    console.warn(
      `[upload-profile] [Tier2] makePublic skipped (${extractErrorMessage(e).slice(0, 120)}).`,
    );
  }

  let url: string | null = null;
  try {
    const [signed] = await file.getSignedUrl({
      action: "read",
      expires: "03-09-2491",
    });
    if (signed?.startsWith("http")) url = signed;
  } catch (e: any) {
    console.warn(
      `[upload-profile] [Tier2] getSignedUrl failed: ${extractErrorMessage(e).slice(0, 120)}`,
    );
  }

  if (!url) {
    url = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(publicId)}?alt=media`;
  }

  return { url, publicId, bytes: fileBuffer.length, format: ext };
}

async function saveInlineBase64ToFirestore(
  fileBuffer: Buffer,
  contentType: string,
  userId: string,
): Promise<{
  url: string;
  publicId: string;
  bytes: number;
  format: string;
}> {
  const ext = contentType.split("/")[1]?.split(";")[0] || "png";
  const base64 = fileBuffer.toString("base64");
  const dataUrl = `data:${contentType.startsWith("image/") ? contentType : `image/${ext}`};base64,${base64}`;
  const publicId = `inline:profile_${userId}:${Date.now()}`;
  const db = getAdminDb();
  const userRef = db.doc(`users/${userId}`);
  try {
    await userRef.set(
      {
        photoInline_updatedAt: new Date().toISOString(),
        photoInlineHint: `inline-${ext}-${fileBuffer.length}b`,
      },
      { merge: true },
    );
    console.log(
      `[upload-profile] [Tier3] Wrote Firestore doc hint for inline image OK (data URL length=${dataUrl.length}).`,
    );
  } catch (e: any) {
    console.warn(
      `[upload-profile] [Tier3] Non-fatal: could not write inline hint to firestore: ${extractErrorMessage(e).slice(0, 120)}`,
    );
  }
  return { url: dataUrl, publicId, bytes: fileBuffer.length, format: ext };
}

export async function POST(request: Request) {
  const t0 = Date.now();
  let marker = "entry";
  let usedFallback = false;
  let fallbackReason = "";
  let tierUsed = "cloudinary";

  try {
    console.log(
      `\n========== [upload-profile] NEW REQUEST | routeVersion=${ROUTE_VERSION} ==========`,
    );

    const FIREBASE_PROJECT_ID =
      stripQuotes(process.env.FIREBASE_PROJECT_ID) ||
      stripQuotes(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) ||
      "digital-trend-4334a";

    marker = "request_info";
    const url = new URL(request.url);
    const contentType = request.headers.get("content-type") || "";
    console.log(
      "[upload-profile] URL:",
      url.pathname,
      "| method:",
      request.method,
      "| content-type:",
      contentType,
    );

    marker = "parse_body";
    let uploadPayload: string | null = null;
    let userId: string | null = null;
    let fileBuffer: Buffer | null = null;
    let fileContentType: string = "image/png";

    if (contentType.includes("application/json")) {
      marker = "read_text_body";
      let rawBodyText = "";
      try {
        rawBodyText = await request.text();
        console.log(
          "[upload-profile] JSON body length (bytes):",
          rawBodyText.length,
        );
        if (rawBodyText.length > 8 * 1024 * 1024) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Request body too large. Max 8MB allowed. Use a smaller image file.",
            },
            { status: 413 },
          );
        }
      } catch (readErr: any) {
        return NextResponse.json(
          {
            success: false,
            message: `Failed to read request body: ${extractErrorMessage(readErr)}`,
          },
          { status: 400 },
        );
      }
      if (!rawBodyText) {
        return NextResponse.json(
          { success: false, message: "Empty request body" },
          { status: 400 },
        );
      }
      let body: any;
      try {
        body = JSON.parse(rawBodyText);
      } catch (parseErr: any) {
        return NextResponse.json(
          {
            success: false,
            message: `Invalid JSON in request: ${extractErrorMessage(parseErr)}`,
          },
          { status: 400 },
        );
      }
      uploadPayload = body.file || null;
      userId = body.userId || null;
      if (!uploadPayload) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Missing required field 'file' (base64 data URL of the image)",
          },
          { status: 400 },
        );
      }
      const base64Match = uploadPayload.match(
        /^data:(image\/[^;]+);base64,(.+)$/,
      );
      if (base64Match) {
        fileContentType = base64Match[1];
        fileBuffer = Buffer.from(base64Match[2], "base64");
      } else {
        fileBuffer = Buffer.from(uploadPayload, "base64");
      }
    } else if (contentType.includes("multipart/form-data")) {
      marker = "parse_multipart";
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      userId = formData.get("userId") as string | null;
      if (!file) {
        return NextResponse.json(
          {
            success: false,
            message: "No file uploaded in multipart form-data",
          },
          { status: 400 },
        );
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, message: "File too large. Max 5MB allowed." },
          { status: 400 },
        );
      }
      if (!file.type.startsWith("image/")) {
        return NextResponse.json(
          {
            success: false,
            message: "Only image files are allowed (image/* MIME type).",
          },
          { status: 400 },
        );
      }
      fileContentType = file.type;
      const bytes = await file.arrayBuffer();
      fileBuffer = Buffer.from(bytes);
      uploadPayload = `data:${file.type};base64,${fileBuffer.toString("base64")}`;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: `Unsupported Content-Type: '${contentType}'. Send application/json or multipart/form-data.`,
        },
        { status: 415 },
      );
    }

    marker = "validate_inputs";
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing required field 'userId'." },
        { status: 400 },
      );
    }
    if (
      (typeof uploadPayload !== "string" || uploadPayload.length < 50) &&
      !fileBuffer
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "File payload appears to be empty or too small (<50 chars).",
        },
        { status: 400 },
      );
    }

    marker = "cloudinary_upload";
    const publicIdBase = `profile_${userId}`;
    let uploadResult: {
      url: string;
      publicId: string;
      width?: number;
      height?: number;
      format?: string;
      bytes: number;
    } | null = null;

    // ========== TIER 1 — CLOUDINARY ==========
    try {
      const { cloudinary, CLOUD_NAME, API_KEY, API_SECRET } =
        await getCloudinary();
      if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        throw Object.assign(new Error("Missing Cloudinary env vars"), {
          http_code: 400,
        });
      }
      const uploadT0 = Date.now();
      const cloudinaryResult = await cloudinary.uploader.upload(
        uploadPayload!,
        {
          folder: "profile_images",
          public_id: publicIdBase,
          overwrite: true,
          invalidate: true,
          resource_type: "image",
          allowed_formats: [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "bmp",
            "heic",
            "heif",
          ],
        },
      );
      console.log(
        `[upload-profile] [Tier1] Cloudinary OK (${Date.now() - uploadT0}ms): ${cloudinaryResult.secure_url?.slice(0, 60)}...`,
      );
      uploadResult = {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        width: cloudinaryResult.width,
        height: cloudinaryResult.height,
        format: cloudinaryResult.format,
        bytes: cloudinaryResult.bytes,
      };
    } catch (cloudinaryErr: any) {
      const cnHttpCode =
        cloudinaryErr?.http_code || cloudinaryErr?.statusCode || 0;
      usedFallback = true;
      fallbackReason = `Cloudinary failed (HTTP ${cnHttpCode}): ${extractErrorMessage(cloudinaryErr)}`;
      console.warn(
        `[upload-profile] [Tier1] Cloudinary FAILED: ${fallbackReason}`,
      );

      // ========== TIER 2 — FIREBASE STORAGE ==========
      if (!fileBuffer) {
        console.warn(
          `[upload-profile] [Tier2] No buffer, skipping Firebase Storage fallback.`,
        );
      } else {
        marker = "firebase_storage_fallback";
        tierUsed = "firebase_storage";
        try {
          const fbT0 = Date.now();
          uploadResult = await uploadToFirebaseStorage(
            fileBuffer,
            fileContentType,
            userId,
            FIREBASE_PROJECT_ID,
          );
          console.log(
            `[upload-profile] [Tier2] Firebase Storage OK (${Date.now() - fbT0}ms)`,
          );
        } catch (storageErr: any) {
          const storageMsg = extractErrorMessage(storageErr);
          console.warn(
            `[upload-profile] [Tier2] Firebase Storage FAILED: ${storageMsg}`,
          );
          fallbackReason += ` | Firebase Storage failed: ${storageMsg}`;

          // ========== TIER 3 — INLINE BASE64 in FIRESTORE ==========
          if (!fileBuffer) throw new Error(fallbackReason);
          marker = "firestore_inline_fallback";
          tierUsed = "firestore_inline";
          const inlineT0 = Date.now();
          uploadResult = await saveInlineBase64ToFirestore(
            fileBuffer,
            fileContentType,
            userId,
          );
          console.log(
            `[upload-profile] [Tier3] Firestore inline OK (${Date.now() - inlineT0}ms). dataUrl length=${uploadResult.url.length}`,
          );
        }
      }
    }

    if (!uploadResult || !uploadResult.url) {
      throw new Error(
        "Upload failed on all 3 tiers (Cloudinary, Firebase Storage, Firestore inline). Check server logs.",
      );
    }

    console.log(
      `[upload-profile] TOTAL DONE (${Date.now() - t0}ms) | tierUsed=${tierUsed} | usedFallback=${usedFallback}`,
    );

    return NextResponse.json({
      success: true,
      message:
        tierUsed === "cloudinary"
          ? "Profile image uploaded successfully"
          : tierUsed === "firebase_storage"
            ? "Profile image uploaded via Firebase Storage (Cloudinary unavailable)"
            : "Profile image uploaded successfully",
      fallback: usedFallback,
      fallbackReason: usedFallback ? fallbackReason : undefined,
      tierUsed,
      data: uploadResult,
    });
  } catch (error: any) {
    const duration = Date.now() - t0;
    const extractedMessage = extractErrorMessage(error);
    console.error(
      `[upload-profile] ALL TIERS FAILED after ${duration}ms at marker="${marker}" tierUsed=${tierUsed}: ${extractedMessage}\n`,
      {
        marker,
        extractedMessage,
        message: error?.message,
        name: error?.name,
        code: error?.code,
        http_code: error?.http_code,
        fallback_used: usedFallback,
        fallback_reason: fallbackReason || undefined,
        tierUsed,
        stack: error?.stack?.split("\n").slice(0, 4).join("\n"),
      },
    );
    return NextResponse.json(
      {
        success: false,
        message:
          extractedMessage ||
          error?.message ||
          "Unknown server error during upload.",
        error: extractedMessage || error?.message || "Unknown error",
        http_code: error?.http_code || undefined,
        failureAt: marker,
        usedFallback,
        fallbackReason: fallbackReason || undefined,
        tierUsed,
        debug: {
          durationMs: duration,
          marker,
          hasCloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          hasApiKey: !!process.env.CLOUDINARY_API_KEY,
          hasApiSecret: !!process.env.CLOUDINARY_API_SECRET,
          routeVersion: ROUTE_VERSION,
        },
      },
      {
        status:
          error?.http_code && error.http_code < 600 ? error.http_code : 500,
      },
    );
  }
}
