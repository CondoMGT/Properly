"use server";

import { prisma } from "@/lib/client";
import { pusherServer } from "@/lib/pusher";
import { MessageStatus } from "@prisma/client";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string | Date;
  status: MessageStatus;
}

export const sendMessage = async (values: Message) => {
  // const validatedFields = WaitingListSchema.safeParse(values);

  // if (!validatedFields.success) {
  //   return { error: "Invalid data!" };
  // }

  // const { email, userType } = validatedFields.data;

  try {
    //   if (!email) {
    //     return { error: "Please provide a valid email." };
    //   }

    //   // Check if email is already used
    //   const existingClient = await prisma.waitlist.findUnique({
    //     where: {
    //       email,
    //     },
    //   });

    //   if (existingClient) {
    //     return { error: "Email already in use." };
    //   }

    const data = await prisma.message.create({
      data: {
        ...values,
        timestamp: new Date(values.timestamp),
      },
    });

    pusherServer.trigger("chat-app", "new-message", data);

    return { success: "Message sent!" };
  } catch (error) {
    console.log("error", error);
    return { error: "Something went wrong. Please try again!" };
  }
};
