"use server";

import { prisma } from "@/lib/client";

export const getTenantsForManager = async (userId: string) => {
  try {
    const property = await prisma.propertyManager.findFirst({
      where: { userId },
      select: {
        properties: {
          select: {
            id: true,
          },
        },
      },
    });

    const tenants = await prisma.tenant.findMany({
      where: {
        propertyId: property?.properties[0].id,
      },
      select: {
        property: {
          select: {
            address: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            receivedMessages: true,
          },
        },
      },
    });

    const formattedTenants = tenants.map((tenant) => ({
      ...tenant,
      user: {
        id: tenant.user.id,
        name: tenant.user.name,
        avatar: tenant.user.image,
        unread:
          tenant.user.receivedMessages.filter(
            (msg) => msg.receiverId === userId && !msg.readByReceiver
          ).length || 0,
      },
    }));

    return formattedTenants;
  } catch {
    return null;
  }
};

export const getManagerId = async (userId: string) => {
  try {
    const manager = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        tenant: {
          select: {
            property: {
              select: {
                propertyManager: {
                  select: {
                    userId: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return manager?.tenant?.property.propertyManager.userId;
  } catch {
    return null;
  }
};

export const getPropertyId = async (userId: string) => {
  try {
    const propertyInfo = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        propertyManager: {
          select: {
            properties: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!propertyInfo) {
      return null;
    }

    return propertyInfo.propertyManager?.properties[0].id;
  } catch {
    return null;
  }
};

export const getPropertyTenants = async (userId: string) => {
  try {
    const property = await prisma.propertyManager.findUnique({
      where: {
        userId,
      },
      select: {
        properties: {
          select: {
            tenants: {
              select: {
                id: true,
                unit: true,
                startDate: true,
                endDate: true,
                user: {
                  select: {
                    name: true,
                    email: true,
                    phoneNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return property?.properties;
  } catch (error) {
    console.error("Error fetching tenants for property:", error);
    return null;
  }
};
