"use client";

import Image from "next/image";
import React from "react";
import { WaitingListForm } from "@/components/waiting-list-form";

export const JoinComp = () => {
  return (
    <div className="w-full max-w-[1322px] mx-auto h-auto p-4 flex justify-between items-center flex-col lg:flex-row">
      <div className="flex flex-col items-start gap-6 lg:w-1/2 p-4">
        <div className="text-black text-5xl font-medium font-kyiv leading-[56px]">
          Ready to Transform Your Property Management Experience?
        </div>
        <div className="text-black text-xl font-normal font-kumbh leading-[34px] tracking-tight text-left">
          Start a 2-week free trial by signing up for a demo today. Discover how
          Properly can revolutionize your property management processes with
          zero commitment.
        </div>
        <div className="w-full flex">
          <WaitingListForm />
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
