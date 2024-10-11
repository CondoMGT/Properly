import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { comparePassword } from "@/utils/passwordHash";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const validatedFields = LoginSchema.safeParse(credentials);
          if (!validatedFields.success) {
            throw new Error("Invalid credentials format");
          }

          const { email, password } = validatedFields.data;
          const user = await getUserByEmail(email);

          if (!user || !user.password) {
            throw new Error("User not found or password not set");
          }

          const passwordsMatch = await comparePassword(password, user.password);

          if (!passwordsMatch) {
            throw new Error("Incorrect password");
          }

          // Authentication successful
          return user;
        } catch (error: any) {
          console.error("Authentication error:", error.message);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
