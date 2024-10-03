"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { WaitingListForm } from "../waiting-list-form";

export const Herod = () => {
  return (
    <div className="w-full max-w-[1272px] mx-auto h-auto pt-[23px] flex flex-col-reverse md:flex-row-reverse items-center gap-4 px-4">
      <div className="w-full md:w-1/2 py-[43px] flex flex-col justify-center items-center gap-[30px]">
        <div className="font-kyiv self-stretch h-auto text-black text-5xl lg:text-6xl font-medium leading-[60px]">
          Effortless Property Management and Tenant Communication
        </div>

        <div className="w-full text-black text-lg font-normal font-kumbh leading-normal">
          Streamline maintenance requests, enhance tenant satisfaction, and
          simplify communication with real-time updates.
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
