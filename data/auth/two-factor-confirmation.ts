import { prisma } from "@/lib/client";

export const getTwofactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique(
      {
        where: { userId },
      }
    );

    return twoFactorConfirmation;
  } catch {
    return null;
  }
};
