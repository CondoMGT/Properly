"use server";

import { prisma } from "@/lib/client";

export const getRequestInfoForTenant = async (userId: string) => {
  try {
    const reqInfo = await prisma.maintenanceRequest.findMany({
      where: { userId },
    });

    return reqInfo.map((r) => {
      return {
        id: r.id,
        issue: r.issue,
        createdAt: r.createdAt,
        status: r.status,
      };
    });
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getAllRequestInfoForTenant = async (userId: string) => {
  try {
    const reqInfo = await prisma.maintenanceRequest.findMany({
      where: { userId },
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

    return reqInfo;
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

    return {
      property: {
        name: property?.propertyManager?.properties[0].propertyName,
        address: property?.propertyManager?.properties[0].address,
      },
      reqInfo,
    };
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const getPropertyContractors = async (propertyId: string) => {
  try {
    const data = await prisma.propertyContractor.findMany({
      where: {
        propertyId,
      },
      select: {
        contractor: true,
      },
    });

    return data;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
