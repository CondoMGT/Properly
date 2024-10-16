"use server";

import { prisma } from "@/lib/client";
import { getManagerId } from "./manager";

export const getTenantMessagesWithManager = async (userId: string) => {
  try {
    const managerId = await getManagerId(userId);

    if (managerId) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            {
              senderId: userId,
            },
            {
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
        include: {
          attachmentMessage: {
            select: {
              id: true,
              attachments: true,
            },
          },
        },
      });

      const formattedMessages = messages.map(
        ({
          id,
          senderId,
          receiverId,
          content,
          timestamp,
          status,
          isStarred,
          readByReceiver,
          readBySender,
          attachmentMessage,
        }) => ({
          id,
          senderId,
          receiverId,
          content,
          timestamp,
          status,
          isStarred,
          readByReceiver,
          readBySender,
          attachments: attachmentMessage,
        })
      );

      return formattedMessages;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};
