"use server";

import { prisma } from "@/lib/client";

export const fetchContractors = async (propertyId: string) => {
  try {
    const data = await prisma.propertyContractor.findMany({
      where: { propertyId },
      select: {
        contractor: true,
      },
    });

    return data.map((d) => d.contractor);
  } catch {
    return null;
  }
};
