"use client";

import { cn } from "@/lib/utils";
import { appName } from "@/utils/constants";
import {
  FacebookIcon,
  InstagramIcon,
  Computer,
  Sun,
  Moon,
  LinkedinIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  const pathName = usePathname();

  return (
    <footer className={cn("sticky bottom-0", className)}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ABOUT US */}

          <div className="flex">
            <Image
              src="/frame2.png"
              width={100}
              height={50}
              alt="Condo building"
              priority
              className="w-24 md:w-32 h-auto object-contain"
            />
            <div>
              <h3 className="text-lg font-semibold mb-4">About {appName}</h3>
              <p className="text-sm text-gray-600">
                {appName} is the leading platform for streamlined condo
                management, enhancing communication between tenants and property
                managers.
              </p>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* SOCIALS AND THEME */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>

            <div className="flex md:flex-col mt-auto justify-between">
              <div className="flex space-x-4 md:mb-16">
                <Link
                  href="https://facebook.com"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <FacebookIcon className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>

                <Link
                  href="https://instagram.com"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <InstagramIcon className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>

                <Link
                  href="https://twitter.com"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>

                <Link
                  href="https://www.linkedin.com"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <LinkedinIcon className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>

              {pathName === "/" && (
                <div className="flex space-x-2 border border-slate-400 rounded-full w-fit">
                  <div
                    className={`flex items-center justify-center p-1 rounded-full${
                      theme === "system" &&
                      " border border-slate-400 rounded-full"
                    }`}
                  >
                    <Computer
                      onClick={() => setTheme("system")}
                      className={`w-4 h-4 cursor-pointer ${
                        theme === "system"
                          ? "text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center justify-center p-1 rounded-full${
                      theme === "light" &&
                      " border border-slate-400 rounded-full"
                    }`}
                  >
                    <Sun
                      onClick={() => setTheme("light")}
                      className={`w-4 h-4 cursor-pointer ${
                        theme === "light"
                          ? "text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center justify-center p-1 rounded-full${
                      theme === "dark" &&
                      " border border-slate-400 rounded-full"
                    }`}
                  >
                    <Moon
                      onClick={() => setTheme("dark")}
                      className={`w-4 h-4 cursor-pointer ${
                        theme === "dark"
                          ? "text-gray-900"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
