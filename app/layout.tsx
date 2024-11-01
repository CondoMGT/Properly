import type { Metadata } from "next";
import localFont from "next/font/local";
import { Kumbh_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { PresenceProvider } from "@/contexts/PresenceContext";
import { Layout } from "@/components/Layout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const kyivTypeSans = localFont({
  src: "./fonts/KyivTypeSans.woff",
  variable: "--font-kyiv-sans",
  weight: "100 400 700 800 900",
});

const nunitoSans = localFont({
  weight: "400 500 700 800 900",
  variable: "--font-nunito-sans",
  src: "./fonts/NunitoSans.ttf",
});

const kumbhSans = Kumbh_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
});

const openSans = Open_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Properly",
  description: "Property Management, Done Properly.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en">
        <head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${kyivTypeSans.variable} ${kumbhSans.className} ${nunitoSans.variable} ${openSans.variable} antialiased w-screen bg-custom-4`}
        >
          <Toaster richColors />

          <PresenceProvider>
            <Layout>{children}</Layout>
          </PresenceProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
