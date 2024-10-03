"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";

export const JoinComp = () => {
  return (
    <div className="w-full max-w-[1322px] mx-auto h-auto p-4 flex justify-between items-center flex-col lg:flex-row">
      <div className="flex flex-col justify-center items-start gap-6 lg:w-1/2 p-4">
        <div className="text-black text-[2.5rem] font-medium font-kyiv leading-[60px]">
          Ready to Simplify Your Property Management?
        </div>
        <div className="text-black text-lg font-normal font-kumbh leading-normal text-left">
          Sign up today and experience how Properly can transform your property
          management process.
        </div>
        <div className="w-full flex justify-center items-center">
          <div className="px-4 py-2 md:px-5 md:py-3 bg-[#003366] rounded-full justify-center items-center gap-2.5 flex">
            <div className="text-white text-sm md:text-lg font-normal font-kumbh">
              Join the waiting list
            </div>
            <div className="flex p-2 bg-[#008080] rounded-[60px] justify-start items-center gap-2.5">
              <div className="w-6 h-6 justify-center items-center flex">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* IMAGE */}
      <div className="relative w-full lg:w-1/2 h-[50vh]">
        <Image
          src="/leo.png"
          alt="Hero"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 50vh, 100vh"
        />
      </div>
    </div>
  );
};
