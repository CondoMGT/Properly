"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { WaitingListForm } from "@/components/waiting-list-form";
import { usePathname } from "next/navigation";

const navLinks = [
  { title: "About Properly", href: "/marketing/#about-properly" },
  { title: "Why Properly", href: "/marketing/#why-properly" },
  { title: "Pricing", href: "/marketing/pricing" },
];

const navPaths = ["/marketing", "/marketing/pricing"];

const Navbar = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [currentLink, setCurrentLink] = useState<string | null>(null);

  const handleMobileNavbar = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-[1312px] mx-auto h-[74px] px-7 py-3.5 bg-custom-3 rounded-[60px] flex flex-row justify-between items-center md:gap-8 lg:gap-4">
      <div className="flex-[20%] flex justify-between items-center">
        {/* LOGO */}

        <Link
          href="/"
          className="text-custom-1 text-2xl font-bold font-kyiv flex items-center"
          onClick={() => setCurrentLink(null)}
        >
          <Image
            src="/logo.svg"
            alt="Properly"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          Properly
        </Link>
      </div>

      <div className="hidden flex-[50%] md:flex flex-col md:flex-row w-full md:w-auto justify-between items-center space-x-4 md:space-x-8">
        <div className="flex items-center space-x-4 md:space-x-8">
          {navLinks.map((navLink, index) => (
            <Link
              key={`md-${index + 1}`}
              href={navLink.href}
              className={`text-lg font-medium font-kumbh text-center hover:border-b-2 hover:border-b-gray-600 hover:text-gray-600 hover:pb-1 hover:font-semibold${
                currentLink === navLink.title && navPaths.includes(pathname)
                  ? " border-b-2 border-b-black pb-1 font-semibold"
                  : ""
              }`}
              onClick={() => setCurrentLink(navLink.title)}
            >
              {navLink.title}
            </Link>
          ))}
        </div>

        {/* BUTTONS */}
        <WaitingListForm inNav />
      </div>
      {/* MENU FOR MOBILE */}
      <div
        className="md:hidden flex flex-col gap-2 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="border-t-2 border-white w-8" />
        <div className="border-t-2 border-white w-8" />
        <div className="border-t-2 border-white w-8" />
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-custom-3 rounded-b-[20px] flex flex-col items-center space-y-4 p-4 z-10 md:hidden">
          {/* Close Button */}
          <button
            className="absolute top-2 self-end text-white text-3xl font-medium"
            onClick={handleMobileNavbar}
          >
            &times; {/* Close icon */}
          </button>
          <Link
            href="/marketing"
            className="text-custom-1 text-2xl font-bold font-kyiv flex mb-4"
            onClick={handleMobileNavbar}
          >
            <Image
              src="/logo.svg"
              alt="Properly"
              width={28}
              height={28}
              className="w-7 h-7"
            />
            Properly
          </Link>
          <Link
            href="/marketing/#about-properly"
            className="text-lg font-medium font-kumbh"
            onClick={handleMobileNavbar}
          >
            About Properly
          </Link>

          <Link
            href="/marketing/#why-properly"
            className="text-lg font-medium font-kumbh"
            onClick={handleMobileNavbar}
          >
            Why Properly
          </Link>

          <Link
            href="/marketing/pricing"
            className="text-lg font-medium font-kumbh"
            onClick={handleMobileNavbar}
          >
            Pricing
          </Link>
          <WaitingListForm inNav />
        </div>
      )}
    </div>
  );
};

export default Navbar;
