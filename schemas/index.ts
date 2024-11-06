import { Palanquin } from "next/font/google";
import { z } from "zod";

export const WaitingListSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  userType: z.enum(["Tenant", "Manager"], {
    required_error: "You need to select a type.",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(8, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z
    .string()
    .min(10, {
      message: "Password must be at least 10 characters.",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one capital letter.",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one number.",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character.",
    })
    .refine((value) => !/(.)\1{2,}/.test(value), {
      message:
        "Password must not contain three consecutive identical characters.",
    }),
  phoneNumber: z
    .string()
    .min(10, { message: "Please enter a valid phone number." }),
  cycle: z
    .enum(["monthly", "annually"], {
      required_error: "Billing cycle is required",
    })
    .optional(),
  plan: z
    .string({
      required_error: "Please select a plan that meets your needs",
    })
    .optional(),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(10, {
      message: "Minimum 10 characters required",
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Password must contain at least one capital letter.",
    })
    .refine((value) => /[0-9]/.test(value), {
      message: "Password must contain at least one number.",
    })
    .refine((value) => /[!@#$%^&*(),.?":{}|<>]/.test(value), {
      message: "Password must contain at least one special character.",
    })
    .refine((value) => !/(.)\1{2,}/.test(value), {
      message:
        "Password must not contain three consecutive identical characters.",
    }),
});

const MAX_FILE_SIZE = 26000000; // 26MB
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
export const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg"];

export const MaintenanceSchema = z.object({
  title: z.string().min(2).max(50, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  media: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 25MB.`)
        .refine(
          (file) =>
            [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].includes(
              file.type
            ),
          "Only .jpg, .jpeg, .png, .webp, .mp4, .webm and .ogg formats are supported."
        )
    )
    .optional()
    .default([]),
});

export const ContractorSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    specialty: z.string().min(1, { message: "Please select a specialty." }),
    companyName: z
      .string()
      .min(2, { message: "Company Name must be at least 2 characters." }),
    phoneNumber: z
      .string()
      .min(10, { message: "Please enter a valid phone number." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    licenseNumber: z
      .string()
      .min(1, { message: "License number is required." }),
    yearsOfExperience: z
      .number()
      .min(0, { message: "Years of experience must be 0 or greater." }),
    serviceArea: z
      .string()
      .min(1, { message: "Please select a service area." }),
    availability: z
      .array(z.string())
      .min(1, { message: "Please select at least one availability." }),
    startHour: z
      .number()
      .min(0)
      .max(23, { message: "Start hour must be between 0 and 23." }),
    endHour: z
      .number()
      .min(0)
      .max(23, { message: "Start hour must be between 0 and 23." }),
    emergency: z.boolean(),
    rating: z
      .number()
      .min(0)
      .max(5, { message: "Rating must be between 0 and 5." }),
    insurance: z.boolean(),
    ratePerHour: z
      .number()
      .min(0, { message: "Rate per hour must be 0 or greater." }),
  })
  .refine((data) => data.startHour < data.endHour, {
    message: "End hour must be after start hour",
    path: ["endHour"],
  });

export const TenantSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    unit: z.string().min(1, "Unit number is required"),
    startDate: z.date({
      required_error: "Start date is required",
    }),
    endDate: z.date({
      required_error: "End date is required",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date",
    path: ["endDate"],
  })
  .refine(
    (data) => {
      const sixMonthsFromStart = new Date(data.startDate);
      sixMonthsFromStart.setMonth(sixMonthsFromStart.getMonth() + 6);
      return data.endDate >= sixMonthsFromStart;
    },
    {
      message: "End date must be at least 6 months after start date",
      path: ["endDate"],
    }
  );

export type TenantFormValues = z.infer<typeof TenantSchema>;
