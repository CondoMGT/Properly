"use client";

import React from "react";
import { WaitingListForm } from "@/components/waiting-list-form";

const plans = [
  {
    title: "Basic Plan (5-10 Properties):",
    description: "$1,200 per license/year",
  },
  {
    title: "Deluxe Plan (11-20 properties):",
    description: "$960 per license/year",
  },
  {
    title: "Premium Plan (21+ properties):",
    description: "$720 per license/year",
  },
];

export const PricingComp = () => {
  return (
    <div className="w-full max-w-[1266px] mx-auto p-4 space-y-4">
      <div className="max-w-[1072px] py-2.5 flex justify-start items-center gap-2.5">
        <div className="w-full text-black text-5xl font-medium font-kyiv leading-[56px]">
          Our Pricing
        </div>
      </div>
      <div className="flex flex-col items-start gap-5 w-full px-4">
        <div className="text-custom-2 text-2xl font-medium font-kyiv leading-[30px]">
          We offer flexible, tiered pricing to suit property managers of all
          sizes
        </div>
        {plans.map((plan, index) => (
          <div
            key={index}
            className="flex items-start md:items-center gap-1 md:gap-4 w-full"
          >
            <div
              className={`w-4 h-4 ${
                (index + 1) % 2 === 0 ? "bg-custom-2" : "bg-[#1e1e1e]"
              } border p-1 mt-2 md:mt-0 rounded-full`}
            />
            <div className="w-full flex flex-col justify-start md:flex-row md:items-center gap-16">
              <div className="text-black text-xl font-medium font-kyiv leading-7 flex-[40%]">
                {plan.title}
              </div>
              <div className="text-black text-xl font-normal font-kumbh leading-[34px] tracking-tight flex-[60%]">
                {plan.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-black text-xl font-normal font-['Open Sans'] leading-[34px] tracking-tight px-4">
        Choose the plan that fits your portfolio and enjoy a scalable solution
        that grows with your property management needs.
      </div>

      {/* BUTTON */}
      <div className="justify-end items-center gap-4 flex flex-row">
        <WaitingListForm />
      </div>
    </div>
  );
};
