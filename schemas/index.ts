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
