"use server";

import { prisma } from "@/lib/client";
import { pusherServer } from "@/lib/pusher";
import { RequestPriority } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

interface newMaintenanceProps {
  data: {
    summary: string;
    description: string;
    priority: RequestPriority;
  };
  issue: string;
  userId: string;
  propertyId: string;
  attachments: string[];
}

export const newMaintenance = async (vals: newMaintenanceProps) => {
  if (!vals) {
    return { error: "Invalid data sent!" };
  }

  const { summary, description, priority } = vals.data;
  const { issue, userId, propertyId, attachments } = vals;

  try {
    if (!userId || !propertyId) {
      return { error: "You are not authorized." };
    }

    if (!issue || !summary || !description || !priority) {
      return { error: "Please provide details of the request." };
    }

    let attach: { id: string; attachments: string[] } = {
      id: "",
      attachments: [],
    };

    if (attachments && attachments.length > 0) {
      attach = await prisma.attachment.create({
        data: {
          attachments,
        },
      });
    }

    const newRequest = await prisma.maintenanceRequest.create({
      data: {
        reqId: uuidv4(),
        issue,
        description,
        summary,
        priority,
        userId,
        propertyId,
        attachments: attach.id || null,
      },
      include: {
        user: {
          select: {
            name: true,
            tenant: {
              select: {
                unit: true,
              },
            },
          },
        },
      },
    });

    pusherServer.trigger("maintenance", "update", {
      data: newRequest,
      action: "New Request",
    });

    return { success: "Maintenance request successfully added!" };
  } catch (error) {
    console.log("error", error);
    return { error: "Something went wrong. Please try again!" };
  }
};
