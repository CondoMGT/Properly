"use client";

import Image from "next/image";
import React from "react";

export const Herod = () => {
  return (
    <div className="w-full max-w-[1272px] mx-auto h-auto py-[23px] flex flex-col-reverse md:flex-row-reverse items-center gap-4">
      <div className="w-full md:w-1/2 py-[43px] flex flex-col justify-center items-center gap-[30px]">
        <div className="font-kyiv self-stretch h-auto text-black text-6xl font-medium leading-[60px]">
          Effortless Property Management and Tenant Communication
        </div>

        <div className="w-full text-black text-lg font-normal font-kumbh leading-normal">
          Streamline maintenance requests, enhance tenant satisfaction, and
          simplify communication with real-time updates.
        </div>

        <div className="justify-start items-center gap-4 flex flex-row">
          <div className="px-4 py-2 md:px-5 md:py-3 bg-[#003366] rounded-full justify-center items-center gap-2.5 flex">
            <div className="text-white text-sm md:text-lg font-normal font-kumbh">
              Join the waiting list
            </div>
            <div className="flex p-2 bg-[#008080] rounded-[60px] justify-start items-center gap-2.5">
              <div className="w-6 h-6 justify-center items-center flex">
                <div className="w-6 h-6 relative flex-col justify-start items-start flex"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE */}
      <div className="relative w-full md:w-1/2 h-[50vh]">
        <Image
          src="/leohoho.png"
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
