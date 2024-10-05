import { Check } from "lucide-react";
import React from "react";

const features = [
  {
    title: "AI-Powered Troubleshooting",
    description:
      "Properly's AI-powered chatbot, Bri, helps tenants resolve common maintenance issues quickly, reducing unnecessary escalations and saving time for both tenants and property managers.",
  },
  {
    title: "Real-Time Updates",
    description:
      "Instant notifications keep tenants and property managers informed at every step, ensuring transparency and minimizing delays or confusion.",
  },
  {
    title: "Integrated Feedback Loop",
    description:
      "Gather tenant feedback after issue resolution to improve service quality and quickly address any disputes, maintaining high tenant satisfaction.",
  },
  {
    title: "White-Label Solutions",
    description:
      "Customize Properly to match your brand, providing a seamless experience for tenants while maintaining your unique identity.",
  },
  {
    title: "Partnering with Service Providers",
    description:
      "Easily integrate external service providers to handle complex maintenance tasks, ensuring faster and more efficient resolutions.",
  },
  // {
  //   title: "Visual Documentation",
  //   description:
  //     "Tenants can upload photos or videos of issues for faster diagnosis.",
  // },
];

export const FeaturesComp = () => {
  return (
    <div className="w-full h-auto relative p-5 pb-8">
      <div className="w-full max-w-[1262px] mx-auto py-2.5 flex justify-start items-center gap-2.5">
        <div className="w-full text-black text-4xl md:text-5xl font-medium font-kyiv leading-[56px]">
          Features That Make Properly Easier
        </div>
      </div>

      {/* <div className="w-full max-w-[1262px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 mt-6"> */}
      <div className="w-full max-w-[1262px] mx-auto flex flex-col mt-6 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="w-full flex items-start gap-4">
            <div
              className={`p-2 ${
                (index + 1) % 2 === 0 ? "bg-custom-2" : "bg-custom-1"
              } rounded-full flex justify-center items-center`}
            >
              <Check className="w-6 h-6 text-white" />
            </div>

            <div className="grid grid-cols-2 md:flex gap-4 w-full">
              <div className="flex-[30%] text-black text-xl font-medium font-kyiv leading-7">
                {feature.title}
              </div>
              <div className="flex-[70%] text-black text-lg font-normal font-kumbh leading-7 tracking-tight">
                {feature.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
