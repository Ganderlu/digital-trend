import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME ||
    "ddhhtyev6",
  api_key:
    process.env.CLOUDINARY_API_KEY ||
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ||
    "874492728653311",
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "R4WTfNPjIw2QxIGXWCZeQIbgobw",
  secure: true,
});

export default cloudinary;

export async function uploadImage(
  file: string,
  folder: string = "uploads",
  publicId?: string,
) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      public_id: publicId,
      overwrite: true,
      resource_type: "auto",
    });
    return {
      publicId: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
}

export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}

export async function getImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  },
) {
  try {
    const url = cloudinary.url(publicId, {
      width: options?.width,
      height: options?.height,
      crop: options?.crop || "fill",
      quality: options?.quality || "auto",
      format: options?.format || "auto",
      secure: true,
    });
    return url;
  } catch (error) {
    console.error("Cloudinary URL generation error:", error);
    throw error;
  }
}
