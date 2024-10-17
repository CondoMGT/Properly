"use server";

import { getPasswordResetTokenByToken } from "@/data/auth/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/client";
import { NewPasswordSchema } from "@/schemas";
import { comparePassword, saltAndHashPassword } from "@/utils/passwordHash";

import { z } from "zod";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return {
      error: "Email does not exist!",
    };
  }

  // Check if the new password is different from the old one
  const samePassword = await comparePassword(password, existingUser.password);

  if (samePassword) {
    return {
      error: "New password too similar to old password!",
    };
  }

  const hashedPassword = await saltAndHashPassword(password);

  await prisma.users.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "Password successfully updated!" };
};
