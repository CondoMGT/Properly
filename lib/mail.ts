"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ProperlyResetPasswordEmail from "@/emails/password-reset";
import { auth } from "@/auth";
import ProperlyUserEmail from "@/emails/verification";
import ProperlyVerifyEmail from "@/emails/two-factor";

const domain = process.env.NEXT_PUBLIC_API_URL;
const from = "Properly <condotenantmanagement@gmail.com>";

const mailerTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "condotenantmanagement@gmail.com",
      pass: process.env.APP_PASS,
    },
  });

  return transporter;
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  const session = await auth();

  const transporter = await mailerTransporter();

  const htmlContent = await render(
    ProperlyResetPasswordEmail({
      userFirstname: session?.user.name || "",
      resetPasswordLink: resetLink,
    })
  );

  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset your password",
    html: htmlContent,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const session = await auth();

  const transporter = await mailerTransporter();

  const htmlContent = await render(
    ProperlyUserEmail({
      username: session?.user.name as string,
      inviteLink: confirmLink,
      inviteFromLocation: "Canada",
    })
  );

  await transporter.sendMail({
    from,
    to: email,
    subject: "Confirm your email",
    html: htmlContent,
  });
};

export const sendTwofactorTokenEmail = async (email: string, token: string) => {
  const transporter = await mailerTransporter();

  const htmlContent = await render(
    ProperlyVerifyEmail({
      verificationCode: token,
    })
  );

  await transporter.sendMail({
    from,
    to: email,
    subject: "2FA Code",
    html: htmlContent,
  });
};
