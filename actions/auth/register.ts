"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";

import { getUserByEmail } from "@/data/user";

import { prisma } from "@/lib/client";
import { saltAndHashPassword } from "@/utils/passwordHash";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid credentials!" };
  }

  const { name, email, password, phoneNumber } = validatedFields.data;
  const hashedPassword = await saltAndHashPassword(password);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  const newUser = await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: "MANAGER",
      firstTimerLogin: new Date(),
      phoneNumber,
    },
  });

  // Create verification token
  const verificationToken = await generateVerificationToken(email);

  // Send Verification token
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: "Confirmation email sent!" };
};
