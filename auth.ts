import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/client";
import { getUserByEmail, getUserById } from "./data/user";
import { UserRole } from "@prisma/client";
import { getTwofactorConfirmationByUserId } from "./data/auth/two-factor-confirmation";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date(), firstTimerLogin: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        // const existingUser = await getUserByEmail(user.email as string);

        // TODO:::
        // - Check if user in invitation table
        // - If not return false
        // - Else extract information from invitation table and populate tenants table
        // - Also get userId from user table
        // - Delete user from invitation table

        // if (!existingUser) {
        //   await prisma.user.create({
        //     data: {
        //       name: user.name as string,
        //       email: user.email as string,
        //       image: user.image as string,
        //     },
        //   });
        // }

        return true;
      }

      const existingUser = await getUserById(user?.id as string);
      // Check is user email is verified
      if (!existingUser || !existingUser.emailVerified) return false;

      // Check for 2FA Authentication
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwofactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: {
            id: twoFactorConfirmation.id,
          },
        });
      }

      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture;
        session.user.phoneNumber = token.phoneNumber as string;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.picture = existingUser.image;
      token.role = existingUser.role;
      token.phoneNumber = existingUser.phoneNumber;

      return token;
    },
  },
  // debug: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  ...authConfig,
});
