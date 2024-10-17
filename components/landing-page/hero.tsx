"use client";

import Image from "next/image";
import React from "react";
import { WaitingListForm } from "@/components/waiting-list-form";

export const Hero = () => {
  return (
    <div className="w-full max-w-[1272px] mx-auto pt-[23px] flex flex-col-reverse lg:flex-row-reverse items-stretch gap-4 px-4">
      <div className="w-full lg:w-1/2 py-[43px] max-[560px]:pr-6 flex flex-col justify-center gap-[30px]">
        <div className="font-kyiv text-black text-5xl text-[52px] md:text-6xl font-semibold leading-[72px]">
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
      <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-auto">
        <Image
          src="/leohoho.png"
          alt="Hero"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
        />
      </div>
    </div>
  );
};
