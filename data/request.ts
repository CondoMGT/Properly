"use server";

import { prisma } from "@/lib/client";

export const getRequestInfoForTenant = async (userId: string) => {
  try {
    const reqInfo = await prisma.maintenanceRequest.findMany({
      where: { userId },
    });

    return reqInfo.map((r) => {
      r.id, r.issue, r.createdAt, r.status;
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getRequestInfoForManager = async (userId: string) => {
  try {
    // FIND THE PROPERTY
    const property = await prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        propertyManager: {
          select: {
            properties: {
              select: {
                id: true,
                propertyName: true,
                address: true,
              },
            },
          },
        },
      },
    });

    const reqInfo = await prisma.maintenanceRequest.findMany({
      where: { propertyId: property?.propertyManager?.properties[0].id },
    });

    return reqInfo;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
