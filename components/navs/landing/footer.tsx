import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full h-auto flex-col justify-center items-start gap-0 inline-flex">
      <div className="self-stretch h-auto px-4 py-6 bg-custom-2 flex justify-center items-center">
        <div className="self-stretch flex justify-center items-center gap-5 flex-wrap text-center">
          <Link
            href="/marketing/careers"
            className="text-white text-lg md:text-xl font-semibold font-kumbh"
          >
            Careers
          </Link>
          <Link
            href="/marketing/contact-us"
            className="text-white text-lg md:text-xl font-semibold font-kumbh"
          >
            Contact Us
          </Link>
          <Link
            href="/marketing/data-policy"
            className="text-white text-lg md:text-xl font-semibold font-kumbh"
          >
            Data Policy
          </Link>
          <Link
            href="/marketing/terms"
            className="text-white text-lg md:text-xl font-semibold font-kumbh"
          >
            Terms
          </Link>
          <Link
            href="/marketing/privacy"
            className="text-white text-lg md:text-xl font-semibold font-kumbh"
          >
            Privacy
          </Link>
        </div>
      </div>
      <div className="border-t border-gray-700 font-light" />
      <div className="self-stretch h-auto pt-6 pb-4 bg-custom-2 flex justify-center items-center">
        <div className="flex justify-start items-center gap-2">
          <div className="text-white text-sm md:text-lg font-light font-kumbh">
            &copy; {new Date().getFullYear()} Properly. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
