"use server";

import { prisma } from "@/lib/client";
import { WaitingListSchema } from "@/schemas";
import { z } from "zod";

export const newClient = async (values: z.infer<typeof WaitingListSchema>) => {
  const validatedFields = WaitingListSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid data!" };
  }

  const { email } = validatedFields.data;

  try {
    if (!email) {
      return { error: "Please provide a valid email." };
    }

    // Check if email is already used
    const existingClient = await prisma.waitlist.findUnique({
      where: {
        email,
      },
    });

    if (existingClient) {
      return { error: "Email already in use." };
    }

    await prisma.waitlist.create({
      data: {
        email,
      },
    });

    return { success: "Thank you for joining our waiting list!" };
  } catch (error) {
    console.log("error", error);
    return { error: "Something went wrong. Please try again!" };
  }
};
