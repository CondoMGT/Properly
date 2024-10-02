"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="text-white text-2xl font-bold">Properly</div>
          </Link>
          <ul className="flex space-x-4">
            <li>
              <Link
                href="/dashboard"
                className="text-gray-300 hover:text-white"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-300 hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="w-full max-w-[1312px] mx-auto h-[74px] px-7 py-3.5 bg-[#9ea1a4] rounded-[60px] flex flex-row justify-between items-center md:gap-8 lg:gap-4">
        <div className="flex justify-between items-center">
          {/* <div className="w-[44.29px] h-10 relative" /> */}

          {/* LOGO */}
          <div className="text-[#003366] text-lg font-medium font-['KyivType Sans'] flex">
            <Image src="/logo.svg" alt="Properly" width={24} height={24} />
            Properly
          </div>
        </div>
        <div className="border-l-2 border-white h-8 hidden md:block" />{" "}
        {/* Vertical line for larger screens */}
        <div className="hidden md:flex flex-col md:flex-row w-full md:w-auto justify-between items-center space-x-4 md:space-x-8">
          <div className="flex space-x-4 md:space-x-8">
            <div className="text-white text-lg font-medium font-['Kumbh Sans']">
              Why Properly
            </div>
            <div className="text-white text-lg font-medium font-['Kumbh Sans']">
              About Properly
            </div>
            <div className="text-white text-lg font-medium font-['Kumbh Sans']">
              Pricing
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex space-x-4 md:space-x-8 mt-4 md:mt-0">
            <div className="px-5 py-3 bg-white rounded-[60px] flex justify-center items-center">
              <div className="text-black text-lg font-medium font-['Kumbh Sans']">
                Get Started
              </div>
            </div>
            <div className="px-5 py-3 bg-white rounded-[60px] flex justify-center items-center">
              <div className="text-black text-lg font-medium font-['Kumbh Sans']">
                Request Demo
              </div>
            </div>
          </div>
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
          <div className="absolute top-16 left-0 w-full bg-[#9ea1a4] rounded-b-[20px] flex flex-col items-center space-y-4 p-4 md:hidden">
            {/* Close Button */}
            <button
              className="self-end text-white text-xl font-medium"
              onClick={() => setIsOpen(false)}
            >
              &times; {/* Close icon */}
            </button>
            <div className="text-white text-lg font-medium font-['Kumbh Sans']">
              Why Properly
            </div>
            <div className="text-white text-lg font-medium font-['Kumbh Sans']">
              About Properly
            </div>
            <div className="text-white text-lg font-medium font-['Kumbh Sans']">
              Pricing
            </div>
            <div className="px-5 py-3 bg-white rounded-[60px] flex justify-center items-center">
              <div className="text-black text-lg font-medium font-['Kumbh Sans']">
                Get Started
              </div>
            </div>
            <div className="px-5 py-3 bg-white rounded-[60px] flex justify-center items-center">
              <div className="text-black text-lg font-medium font-['Kumbh Sans']">
                Request Demo
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
