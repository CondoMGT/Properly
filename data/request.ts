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

export const getContractorInfo = async (id: string) => {
  try {
    const data = await prisma.contractor.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        availability: true,
        startHour: true,
        endHour: true,
      },
    });

    const refinedAvailability = data?.availability.map((d) => {
      if (d === "Monday") return 1;
      if (d === "Tuesday") return 2;
      if (d === "Wednesday") return 3;
      if (d === "Thursday") return 4;
      if (d === "Friday") return 5;
      if (d === "Saturday") return 6;
      if (d === "Sunday") return 7;
    });

    return { ...data, availability: refinedAvailability };
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};
