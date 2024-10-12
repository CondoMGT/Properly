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
