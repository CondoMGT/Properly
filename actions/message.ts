"use server";

import { prisma } from "@/lib/client";
import { pusherServer } from "@/lib/pusher";
import { CloudinaryUploadResult, MessageServer } from "@/lib/types";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "doqfvbdxe",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const MAX_BODY_SIZE = 7 * 1024 * 1024; // 5MB in bytes

export const sendMessage = async (values: MessageServer) => {
  try {
    // Check body size
    const bodySize = JSON.stringify(values).length;
    console.log("BODY SIZE", bodySize);
    if (bodySize > MAX_BODY_SIZE) {
      return {
        error:
          "Message size exceeds 2MB limit. Please reduce the size of your message or attachments.",
      };
    }

    const files: string[] = [];
    let attach: { id: string; attachments: string[] } = {
      id: "",
      attachments: [],
    };

    if (values.attachments) {
      // Use Promise.all to handle multiple async uploads
      const uploadPromises = values.attachments.map(async (attach) => {
        const buffer = new Uint8Array(attach.buffer);

        return new Promise<string>((resolve, reject) => {
          cloudinary.uploader
            .unsigned_upload_stream(
              "properly",
              { resource_type: "auto", folder: "uploads" },
              (error, result: CloudinaryUploadResult) => {
                if (error) {
                  reject(error);
                } else {
                  const stringResult = JSON.stringify({
                    url: result.secure_url,
                    type: attach.type,
                    name: attach.name,
                  });
                  resolve(stringResult); // Now TypeScript knows that result has secure_url
                }
              }
            )
            .end(buffer);
        });
      });

      try {
        // Wait for all uploads to finish
        const uploadedUrls = await Promise.all(uploadPromises);
        console.log(uploadedUrls);
        files.push(...uploadedUrls);
      } catch (error) {
        return { error: "Failed to upload file" };
      }
    }

    if (files && files.length > 0) {
      // TO DO: store urls in database
      attach = await prisma.attachment.create({
        data: {
          attachments: files,
        },
      });
    }

    const data = await prisma.message.create({
      data: {
        ...values,
        content: files.length > 0 ? values.content || "" : values.content,
        timestamp: new Date(values.timestamp),
        attachments: files.length > 0 ? attach.id : null,
      },
    });

    pusherServer.trigger("chat-app", "new-message", data);

    return { success: "Message sent!" };
  } catch (error) {
    console.log("error", error);
    return { error: "Something went wrong. Please try again!" };
  }
};
