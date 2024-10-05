import Image from "next/image";
import React from "react";

const properlyWhys = [
  {
    name: "AI Chatbot Bri",
    description:
      "Bri helps tenants resolve minor issues independently, reducing property managers' workload and providing faster solutions for tenants.",
    icon: "chatbot.png",
  },
  {
    name: "Automated Feedback Loop",
    description:
      "After resolving issues, tenants provide feedback to help property managers improve service quality.",
    icon: "loop.png",
  },
  {
    name: "Real-time Communication",
    description:
      "Instant updates and notifications enable seamless communication, making issue reporting and maintenance tracking efficient for both parties.",
    icon: "communik.png",
  },
  {
    name: "Prevent Legal and Financial Risks",
    description:
      "By ensuring timely issue resolution, Properly minimizes the risk of legal liabilities and financial losses.",
    icon: "legal.png",
  },
];

export const WhyComp = () => {
  return (
    <div className="w-full h-auto max-w-[1272px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center md:gap-8">
      <div className="w-full flex-[20%] h-auto py-2.5 flex justify-start items-center gap-2.5">
        <div className="text-black text-4xl md:text-5xl font-medium font-kyiv leading-[56px]">
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
              className="absolute w-15 h-15 left-0 top-6"
            />
            <div className="pl-12">
              <div className="text-black text-2xl font-medium leading-[30px] font-kyiv mb-4">
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
