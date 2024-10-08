import type { Metadata } from "next";
import localFont from "next/font/local";
import { Kumbh_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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

const kumbhSans = Kumbh_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kumbh-sans",
});
// const kyivTypeSans = KyivType_Sans({ weight: '400', subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kyivTypeSans.variable} ${kumbhSans.className} antialiased pt-6 max-[360px]:w-[114vw]`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
