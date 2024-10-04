"use client";

import Image from "next/image";
import React from "react";
import { WaitingListForm } from "@/components/waiting-list-form";

export const Hero = () => {
  return (
    <div className="w-full max-w-[1272px] mx-auto h-auto pt-[23px] flex flex-col-reverse md:flex-row-reverse items-center gap-4 px-4">
      <div className="w-full md:w-1/2 py-[43px] flex flex-col justify-center gap-[30px]">
        <div className="font-kyiv self-stretch h-auto text-black text-6xl font-medium leading-[72px]">
          Property Management, Done Properly
        </div>

        <div className="w-full text-black text-lg font-normal font-kumbh leading-7 tracking-tight">
          Empower your team with real-time tools to streamline communication,
          resolve maintenance issues quickly, and safeguard your operations from
          costly delays, tenant dissatisfaction, financial loss, and legal
          actions.
        </div>

        <div className="justify-start items-center gap-4 flex flex-row">
          <WaitingListForm />
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
