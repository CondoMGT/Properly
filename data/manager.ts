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
    const manager = await prisma.users.findUnique({
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
