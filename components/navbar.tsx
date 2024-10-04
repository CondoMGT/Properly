"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { WaitingListForm } from "@/components/waiting-list-form";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMobileNavbar = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-[1312px] mx-auto h-[74px] px-7 py-3.5 bg-[#d3dfdf] rounded-[60px] flex flex-row justify-between items-center md:gap-8 lg:gap-4">
      <div className="flex justify-between items-center">
        {/* LOGO */}

        <Link
          href="/"
          className="text-[#003366] text-xl font-medium font-Kyiv flex"
        >
          <Image
            src="/logo.svg"
            alt="Properly"
            width={24}
            height={24}
            className="w-6 h-6"
          />
          Properly
        </Link>
      </div>

      <div className="hidden md:flex flex-col md:flex-row w-full md:w-auto justify-between items-center space-x-4 md:space-x-8">
        <div className="flex space-x-4 md:space-x-8">
          <Link href="/why-properly" className="text-lg font-medium font-kumbh">
            Why Properly
          </Link>
          <Link
            href="/about-properly"
            className="text-lg font-medium font-kumbh"
          >
            About Properly
          </Link>
          <Link href="/pricing" className="text-lg font-medium font-kumbh">
            Pricing
          </Link>
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
        <div className="absolute top-12 left-0 w-full bg-[#d3dfdf] rounded-b-[20px] flex flex-col items-center space-y-4 p-4 z-10 md:hidden">
          {/* Close Button */}
          <button
            className="self-end text-white text-3xl font-medium"
            onClick={handleMobileNavbar}
          >
            &times; {/* Close icon */}
          </button>
          <Link
            href="/"
            className="text-[#003366] text-2xl font-medium font-Kyiv flex mb-4"
            onClick={handleMobileNavbar}
          >
            <Image src="/logo.svg" alt="Properly" width={24} height={24} />
            Properly
          </Link>
          <Link
            href="/why-properly"
            className="text-lg font-medium font-kumbh"
            onClick={handleMobileNavbar}
          >
            Why Properly
          </Link>
          <Link
            href="/about-properly"
            className="text-lg font-medium font-kumbh"
            onClick={handleMobileNavbar}
          >
            About Properly
          </Link>
          <Link
            href="/pricing"
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
