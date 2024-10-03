"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { WaitingListForm } from "../waiting-list-form";

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
