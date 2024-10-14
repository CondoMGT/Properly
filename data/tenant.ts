"use server";

import { prisma } from "@/lib/client";
import { getManagerId } from "./manager";

export const getTenantMessagesWithManager = async (
  userId: string
  // managerId: string
) => {
  try {
    // const manager = await prisma.tenant.findFirst({
    //   where: { userId },
    //   select: {
    //     property: {
    //       select: {
    //         propertyManager: {
    //           select: {
    //             userId: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });

    const managerId = await getManagerId(userId);

    if (managerId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: userId,
            },
            {
              // senderId: manager?.property.propertyManager.userId,
              senderId: managerId as string,
            },
            {
              receiverId: userId,
            },
            {
              receiverId: managerId as string,
            },
          ],
        },
        // select: {
        //   property: {
        //     select: {
        //       address: true,
        //     },
        //   },
        //   user: {
        //     select: {
        //       id: true,
        //       name: true,
        //       image: true,
        //       receivedMessages: true,
        //     },
        //   },
        // },
      });

      return messages;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
