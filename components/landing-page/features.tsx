import { Check } from "lucide-react";
import React from "react";

const features = [
  {
    title: "AI-Powered Troubleshooting",
    description: "Resolve issues faster with built-in AI assistance.",
  },
  {
    title: "Real-Time Updates",
    description:
      "Tenants can upload photos or videos of issues for faster diagnosis.",
  },
  {
    title: "Integrated Calendar",
    description:
      "Schedule and track maintenance with an easy-to-use calendar feature.",
  },
  {
    title: "Messaging System",
    description:
      "Communicate directly with tenants or send bulk announcements.",
  },
  {
    title: "Feedback Loop & Dispute Management",
    description:
      "Receive and act on tenant feedback, track disputes, and resolve issues efficiently.",
  },
  {
    title: "Visual Documentation",
    description:
      "Tenants can upload photos or videos of issues for faster diagnosis.",
  },
];

export const FeaturesComp = () => {
  return (
    <div className="w-full h-auto relative p-4 pb-8">
      <div className="w-full max-w-[1262px] mx-auto py-2.5 flex justify-start items-center gap-2.5">
        <div className="w-full text-black text-[2.5rem] font-medium font-kyiv leading-[3rem]">
          Features That Make Properly Easier
        </div>
      </div>

      <div className="w-full max-w-[1262px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
        {features.map((feature, index) => (
          <div key={index} className="w-full flex items-start gap-4">
            <div className="p-2 bg-[#008080] rounded-full flex justify-center items-center">
              <Check className="w-6 h-6 text-white" />
            </div>

            <div className="grid grid-cols-2 w-full">
              <div className="text-black text-lg font-medium font-kyiv leading-normal">
                {feature.title}
              </div>
              <div className="text-black text-lg font-normal font-kumbh leading-normal">
                {feature.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
