"use server";

import { prisma } from "@/lib/client";
import { pusherServer } from "@/lib/pusher";
import { RequestPriority, RequestStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

type RequestProp = {
  category: string;
  contractor: string;
  priority: RequestPriority;
  status: RequestStatus;
};

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

    pusherServer.trigger("maintenance", "update", updatedRequest);

    // TODO: SEND NOTIFICATION TO TENANT

    return { success: "Successfully updated the request!" };
  } catch (error) {
    console.error("Error updating request:", error);
    return {
      error: "An error occurred while updating the maintenance request.",
    };
  }
};
