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
  term: z.boolean().refine((value) => value === true, {
    message: "You must agree to the terms and conditions.",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(8, {
    message: "Minimum 8 characters required",
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
