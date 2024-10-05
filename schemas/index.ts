import { z } from "zod";

export const WaitingListSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  userType: z.enum(["Tenant", "Manager"], {
    required_error: "You need to select a type.",
  }),
});
