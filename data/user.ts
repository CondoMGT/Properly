"use server";

import { prisma } from "@/lib/client";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      console.warn(`User not found for ID: ${id}`);
    }
    return user;
  } catch {
    return null;
  }
};
