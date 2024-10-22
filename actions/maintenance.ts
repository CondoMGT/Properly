"use server";

import { prisma } from "@/lib/client";
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
}

export const newMaintenance = async (vals: newMaintenanceProps) => {
  if (!vals) {
    return { error: "Invalid data sent!" };
  }

  const { summary, description, priority } = vals.data;
  const { issue, userId, propertyId } = vals;

  try {
    if (!userId || !propertyId) {
      return { error: "You are not authorized." };
    }

    if (!issue || !summary || !description || !priority) {
      return { error: "Please provide details of the request." };
    }

    await prisma.maintenanceRequest.create({
      data: {
        reqId: uuidv4(),
        issue,
        description,
        summary,
        priority,
        userId,
        propertyId,
      },
    });

    revalidatePath("/tenants/maintenance");
    revalidatePath("/managers/maintenance");

    return { success: "Maintenance request successfully added!" };
  } catch (error) {
    console.log("error", error);
    return { error: "Something went wrong. Please try again!" };
  }
};
