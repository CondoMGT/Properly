"use server";

import { signIn } from "@/auth";
// import { getTwofactorConfirmationByUserId } from "@/data/two-factor-confirmation";
// import { getTwofactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { prisma } from "@/lib/client";
import { pusherServer } from "@/lib/pusher";
// import { sendVerificationEmail, sendTwofactorTokenEmail } from "@/lib/mail";
// import {
//   generateVerificationToken,
//   generateTwoFactorToken,
// } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

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

  // if (!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(
  //     existingUser.email
  //   );

  //   // Send verification email
  //   await sendVerificationEmail(
  //     verificationToken.email,
  //     verificationToken.token
  //   );

  //   return { success: "Confirmation email sent!" };
  // }

  // if (existingUser.isTwoFactorEnabled && existingUser.email) {
  //   if (code) {
  //     // TODO: Verify Code
  //     const twoFactorToken = await getTwofactorTokenByEmail(existingUser.email);

  //     if (!twoFactorToken) {
  //       return { error: "Invalid code!" };
  //     }

  //     if (twoFactorToken.token !== code) {
  //       return { error: "Invalid code!" };
  //     }

  //     const hasExpired = new Date(twoFactorToken.expires) < new Date();

  //     if (hasExpired) {
  //       return { error: "Code expired!" };
  //     }

  //     await prisma.twoFactorToken.delete({
  //       where: {
  //         id: twoFactorToken.id,
  //       },
  //     });

  //     const existingConfirmation = await getTwofactorConfirmationByUserId(
  //       existingUser.id
  //     );

  //     if (existingConfirmation) {
  //       await prisma.twoFactorConfirmation.delete({
  //         where: {
  //           id: existingConfirmation.id,
  //         },
  //       });
  //     }

  //     await prisma.twoFactorConfirmation.create({
  //       data: {
  //         userId: existingUser.id,
  //       },
  //     });
  //   } else {
  //     const twoFactorToken = await generateTwoFactorToken(existingUser.email);

  //     await sendTwofactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

  //     return { twoFactor: true };
  //   }
  // }

  try {
    const redirectUrl =
      existingUser.role === "TENANT" ? "/tenants" : "/managers";
    const result = await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || redirectUrl || DEFAULT_LOGIN_REDIRECT,
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
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
