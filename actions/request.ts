"use server";

import { prisma } from "@/lib/client";
import { pusherServer } from "@/lib/pusher";
import { RequestPriority, RequestStatus } from "@prisma/client";
import PushNotifications from "@pusher/push-notifications-server";

type RequestProp = {
  category: string;
  contractor: string;
  priority: RequestPriority;
  status: RequestStatus;
};

const beamsClient = new PushNotifications({
  instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
  secretKey: process.env.BEAMS_SECRET_KEY!,
});

export const updateRequest = async (id: string, data: RequestProp) => {
  try {
    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        ...data,
        status: data.status === "Progress" ? "Progress" : data.status,
      },
    });

    if (!updatedRequest) {
      return {
        error: "Error updating the maintenance request.",
      };
    }

    pusherServer.trigger("maintenance", "update", {
      data: updatedRequest,
      action: "Manager Update",
    });

    // TODO: SEND NOTIFICATION TO TENANT
    try {
      await beamsClient.publishToUsers([updatedRequest.userId], {
        web: {
          notification: {
            title: "Updated Maintenance Request",
            body: "You have an update on a maintenance request",
            icon: "https://res.cloudinary.com/doqfvbdxe/image/upload/v1730303244/uploads/k5fozza3te6srxjpvbms.png",
          },
        },
      });
      console.log("Notification sent successfully");
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
    }

    return { success: "Successfully updated the request!" };
  } catch (error) {
    console.error("Error updating request:", error);
    return {
      error: "An error occurred while updating the maintenance request.",
    };
  }
};

export const updateTenantRequest = async (id: string, data: Date) => {
  try {
    const updatedRequest = await prisma.maintenanceRequest.update({
      where: { id },
      data: {
        maintenanceDate: data,
        scheduledDate: new Date(),
      },
    });

    if (!updatedRequest) {
      return {
        error: "Error updating the maintenance request.",
      };
    }

    pusherServer.trigger("maintenance", "update", {
      data: updatedRequest,
      action: "Tenant Update",
    });

    // TODO: SEND NOTIFICATION TO TENANT
    try {
      await beamsClient.publishToUsers([updatedRequest.userId], {
        web: {
          notification: {
            title: "Updated Maintenance Request",
            body: "Tenant updated the maintenance request",
            icon: "https://res.cloudinary.com/doqfvbdxe/image/upload/v1730303244/uploads/k5fozza3te6srxjpvbms.png",
          },
        },
      });
      console.log("Notification sent successfully");
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
    }

    return { success: "Successfully confirmed your appointment!" };
  } catch (error) {
    console.error("Error updating request:", error);
    return {
      error: "An error occurred while confirming your appointment.",
    };
  }
};
