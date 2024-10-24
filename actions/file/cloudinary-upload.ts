"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "doqfvbdxe",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

type CloudinaryResourceType = "auto" | "image" | "video" | "raw";

type CloudinaryUploadOptions = {
  resourceType?: CloudinaryResourceType;
  folder?: string;
};

type CloudinaryUploadResult = {
  url: string;
  type: string;
  name: string;
};

type CloudinaryUploadApiResponse = {
  secure_url: string;
  resource_type: string;
  original_filename: string;
  [key: string]: any;
};

export async function uploadToCloudinary(
  file: string,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult | null> {
  const { resourceType = "auto", folder = "uploads" } = options;

  try {
    const uploadResponse = await new Promise<CloudinaryUploadApiResponse>(
      (resolve, reject) => {
        const uploadPreset = "properly";

        cloudinary.uploader.unsigned_upload(
          file,
          uploadPreset,
          {
            resource_type: resourceType,
            folder: folder,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      }
    );

    return {
      url: uploadResponse.secure_url,
      type: uploadResponse.resource_type,
      name: uploadResponse.original_filename,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    return null;
  }
}
