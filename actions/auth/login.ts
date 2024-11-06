"use server";

import { signIn } from "@/auth";
import { getTwofactorConfirmationByUserId } from "@/data/auth/two-factor-confirmation";
import { getTwofactorTokenByEmail } from "@/data/auth/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/client";
import { pusherServer } from "@/lib/pusher";
import { sendVerificationEmail, sendTwofactorTokenEmail } from "@/lib/mail";
import {
  generateVerificationToken,
  generateTwoFactorToken,
  generatePasswordResetToken,
} from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";
import { redirect } from "next/navigation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid credentials!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist!" };
  }

  // Check if user (tenant) is logging in for the first time
  if (existingUser.role === "TENANT" && !existingUser.firstTimerLogin) {
    const passwordToken = await generatePasswordResetToken(existingUser.email);

    redirect(`/auth/new-password?token=${passwordToken.token}`);
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    // Send verification email
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      // TODO: Verify Code
      const twoFactorToken = await getTwofactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "Code expired!" };
      }

      await prisma.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwofactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwofactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    const redirectUrl =
      existingUser.role === "TENANT" ? "/tenants" : "/managers";
    const finalRedirectUrl =
      callbackUrl || redirectUrl || DEFAULT_LOGIN_REDIRECT;

    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: finalRedirectUrl,
      // redirect: false,
    });

    if (!result) {
      return { error: "Something went wrong!" };
    }

    // Trigger presence channel addition
    await pusherServer.trigger(
      `presence-channel-${existingUser.id}`,
      "user-logged-in",
      {
        userId: existingUser.id,
        path: finalRedirectUrl,
      }
    );

    return { success: "You have successfully logged in." };
  } catch (error) {
    // TODO:
    if (error instanceof AuthError) {
      console.log("ERROR TYPE", error.type);
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials!" };
        default:
          console.error("No result", error);
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
