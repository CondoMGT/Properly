"use server";

import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import ProperlyResetPasswordEmail from "@/emails/password-reset";
import { auth } from "@/auth";

const domain = process.env.NEXT_PUBLIC_API_URL;

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
    from: "Properly <condotenantmanagement@gmail.com>",
    to: email,
    subject: "Reset your password",
    html: htmlContent,
  });
};
