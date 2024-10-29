"use server";

import { Contractor } from "@/components/contractor/contractor-management";
import { prisma } from "@/lib/client";

export const addContractor = async (values: Contractor, propertyId: string) => {
  // Validate that either content or attachments are present
  if (!values) {
    return { error: "Cannot add an empty contractor" };
  }

  try {
    const data = await prisma.contractor.create({
      data: {
        name: values.name,
        specialty: values.specialty,
        companyName: values.companyName,
        phoneNumber: values.phoneNumber,
        email: values.email,
        licenseNumber: values.licenseNumber,
        yearsOfExperience: values.yearsOfExperience,
        serviceArea: values.serviceArea,
        availability: values.availability,
        startHour: values.startHour,
        endHour: values.endHour,
        emergency: values.emergency,
        rating: values.rating,
        insurance: values.insurance,
        ratePerHour: values.ratePerHour,
      },
    });

    if (!data) {
      return { error: "Error adding contractor. Try again later!" };
    }

    await prisma.propertyContractor.create({
      data: {
        contractorId: data.id,
        propertyId,
      },
    });

    return { success: "Contractor added!" };
  } catch (error) {
    console.log("error", error);
    return { error: "Something went wrong. Please try again!" };
  }
};
