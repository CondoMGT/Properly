"use client";

import { ArrowUpRight } from "lucide-react";
import React from "react";

const plans = [
  {
    title: "Basic Plan",
    description: "For small properties and single-site managers.",
  },
  {
    title: "Pro Plan",
    description: "For multi-property managers with advanced features.",
  },
  {
    title: "Enterprise Plan",
    description: "Custom solutions for large-scale property management.",
  },
];

export const PricingComp = () => {
  return (
    <div className="w-full max-w-[1266px] mx-auto p-4 space-y-4">
      <div className="max-w-[1072px] py-2.5 flex justify-start items-center gap-2.5">
        <div className="w-full text-black text-[2.5rem] font-medium font-kyiv leading-[3rem]">
          Our Pricing
        </div>
      </div>
      <div className="flex flex-col items-start gap-5 w-full px-4 pl-11">
        {plans.map((plan, index) => (
          <div
            key={index}
            className="flex items-start md:items-center gap-1 md:gap-4 w-full max-w-[669px]"
          >
            <div className="w-4 h-4 bg-[#1e1e1e] border p-1 mt-2 md:mt-0 rounded-full" />
            <div className="w-full flex flex-col justify-start md:flex-row md:items-center gap-2 pl-[11px]">
              <div className="text-black text-xl font-semibold font-kumbh leading-tight flex-[23%]">
                {plan.title}
              </div>
              <div className="text-black text-lg font-normal font-kumbh leading-normal flex-[75%]">
                {plan.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* BUTTON */}
      <div className="justify-end items-center gap-4 flex flex-row">
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
  );
};
