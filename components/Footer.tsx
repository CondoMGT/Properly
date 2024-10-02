import React from "react";

const Footer = () => {
  return (
    <>
      {/* <footer className="bg-gray-800 p-4 fixed bottom-0 w-full mt-8">
        <div className="container mx-auto text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} CondoMgt. All Rights Reserved.
          </p>
          <ul className="flex justify-center space-x-4 mt-2">
            <li>
              <a href="/privacy" className="text-gray-300 hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/terms" className="text-gray-300 hover:text-white">
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
      </footer> */}

      <div className="w-full h-auto flex-col justify-center items-start gap-0 inline-flex">
        <div className="self-stretch h-auto px-4 py-6 bg-[#313131] flex justify-center items-center">
          <div className="self-stretch flex justify-start items-center gap-5 flex-wrap text-center md:text-left">
            <div className="text-white text-lg md:text-xl font-semibold font-kumbh">
              Careers
            </div>
            <div className="text-white text-lg md:text-xl font-semibold font-kumbh">
              Contact Us
            </div>
            <div className="text-white text-lg md:text-xl font-semibold font-kumbh">
              Data Policy
            </div>
            <div className="text-white text-lg md:text-xl font-semibold font-kumbh">
              Terms
            </div>
            <div className="text-white text-lg md:text-xl font-semibold font-kumbh">
              Privacy
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 font-light" />
        <div className="self-stretch h-auto pt-6 pb-4 bg-[#313131] flex justify-center items-center">
          <div className="flex justify-start items-center gap-2">
            <div className="text-white text-sm md:text-lg font-light font-kumbh">
              &copy; {new Date().getFullYear()} Properly. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
