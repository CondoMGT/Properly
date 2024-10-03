"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full max-w-[1312px] mx-auto h-[74px] px-7 py-3.5 bg-[#d3dfdf] rounded-[60px] flex flex-row justify-between items-center md:gap-8 lg:gap-4">
      <div className="flex justify-between items-center">
        {/* <div className="w-[44.29px] h-10 relative" /> */}

        {/* LOGO */}
        <div className="text-[#003366] text-lg font-medium font-['KyivType Sans'] flex">
          <Image src="/logo.svg" alt="Properly" width={24} height={24} />
          Properly
        </div>
      </div>
      <div className="border-l-2 border-gray-600 h-8 hidden md:block" />{" "}
      {/* Vertical line for larger screens */}
      <div className="hidden md:flex flex-col md:flex-row w-full md:w-auto justify-between items-center space-x-4 md:space-x-8">
        <div className="flex space-x-4 md:space-x-8">
          <div className="text-lg font-medium font-kumbh">Why Properly</div>
          <div className="text-lg font-medium font-kumbh">About Properly</div>
          <div className="text-lg font-medium font-kumbh">Pricing</div>
        </div>

        {/* BUTTONS */}
        <div className="flex space-x-4 md:space-x-8 mt-4 md:mt-0">
          <div className="px-5 py-3 bg-[#003366] rounded-[60px] flex justify-center items-center">
            <div className="text-white text-lg font-medium font-kumbh">
              Join the waiting list
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
          <div className="text-lg font-medium font-kumbh">Why Properly</div>
          <div className="text-lg font-medium font-kumbh">About Properly</div>
          <div className="text-lg font-medium font-kumbh">Pricing</div>
          <div className="px-5 py-3 bg-[#003366] rounded-[60px] flex justify-center items-center">
            <div className="text-white text-lg font-medium font-kumbh">
              Join the waiting list
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
