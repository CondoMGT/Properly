"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";

import { getUserByEmail } from "@/data/user";

import { prisma } from "@/lib/client";
import { saltAndHashPassword } from "@/utils/passwordHash";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid credentials!" };
  }

  const { name, email, password, term } = validatedFields.data;
  const hashedPassword = await saltAndHashPassword(password);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use!" };
  }

  if (term) {
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "TENANT",
      },
    });

    // const manager = await prisma.propertyManager.create({
    //   data: {
    //     userId: newUser.id,
    //   },
    // });

    // await prisma.property.create({
    //   data: {
    //     propertyName: "PropsVent",
    //     address: "123 Properly Ave., NW, T2E4Y7, Calgary, AB, Canada",
    //     propertyManagerId: manager.id,
    //   },
    // });

    return { success: "Confirmation email sent!" };
  }

  // Create verification token
  // const verificationToken = await generateVerificationToken(email);

  // Send verification email
  // await sendVerificationEmail(verificationToken.email, verificationToken.token);
};
