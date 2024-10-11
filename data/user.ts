import { prisma } from "@/lib/client";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.users.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.users.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};
