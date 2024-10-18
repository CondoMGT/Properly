import Image from "next/image";
import React from "react";

const properlyWhys = [
  {
    name: "AI Chatbot Bri",
    description:
      "Meet Bri, the smart assistant that helps tenants fix minor issues themselves, cutting down property managers’ workloads and speeding up solutions. Enhance efficiency, improve tenant satisfaction, and simplify property management with Bri.",
    icon: "chatbot.png",
  },
  {
    name: "Automated Feedback Loop",
    description:
      "Enhance your property management with Properly’s Automated Feedback Loop, collecting instant tenant feedback to drive service improvements and foster loyalty.",
    icon: "loop.png",
  },
  {
    name: "Real-time Communication",
    description:
      "Enjoy instant notifications for efficient issue reporting and maintenance tracking, ensuring no concern goes unnoticed and every task is addressed promptly. Transform your property management experience today!.",
    icon: "communik.png",
  },
  {
    name: "Prevent Legal and Financial Risks",
    description:
      "Properly ensures timely issue resolution, reducing legal liabilities and financial risks. Protect your operations today!.",
    icon: "legal.png",
  },
];

export const WhyComp = () => {
  return (
    <div
      id="why-properly"
      className="w-full h-auto max-w-[1272px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:gap-8"
    >
      <div className="w-full flex-[20%] h-auto py-2.5 flex justify-start items-center gap-2.5">
        <div className="text-black text-4xl md:text-5xl font-semibold font-nunito leading-[56px]">
          Why Choose Properly
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 px-2 gap-8 h-auto">
        {properlyWhys.map((why, index) => (
          <div className="relative space-x-6" key={index}>
            <Image
              src={`/${why.icon}`}
              alt={why.icon.split(".")[0]}
              width={60}
              height={60}
              className="absolute w-auto h-15 left-0 top-6"
            />
            <div className="pl-12">
              <div className="text-black text-2xl font-semibold leading-[30px] font-nunito mb-4">
                {why.name}
              </div>
              <div className="text-black text-base font-normal leading-normal tracking-tight">
                {why.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
