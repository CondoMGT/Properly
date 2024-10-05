import React from "react";

export const AboutComponent = () => {
  return (
    <div className="w-full h-auto max-w-[1272px] mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center md:gap-16">
      <div className="flex-[20%] h-auto py-2.5 flex justify-center items-center gap-2.5">
        <div className="text-black text-5xl font-medium font-kyiv leading-[56px]">
          About Properly
        </div>
      </div>

      <div className="w-full grid h-auto">
        <div className="w-full">
          <span className="text-custom-2 text-2xl font-medium font-kyiv leading-[30px]">
            Properly
          </span>
          <span className="text-black text-xl font-normal font-['Open Sans'] leading-[34px] tracking-tight">
            {" "}
            is a modern property management platform that simplifies
            communication and maintenance between property managers and tenants.
            It offers real-time updates, easy issue reporting, and seamless
            communication. <br />
            <br />
            Our{" "}
          </span>
          <span className="text-custom-2 text-2xl font-medium font-kyiv leading-[30px]">
            AI-powered chatbot
          </span>
          <span className="text-black text-xl font-normal font-['Open Sans'] leading-[34px] tracking-tight">
            , Bri, helps tenants resolve common maintenance issues before
            involving property managers, ensuring faster resolutions and
            reducing delays. With advanced analytics, automated notifications,
            and feedback loops, Properly boosts tenant satisfaction and protects
            property managers from legal and financial risks.
          </span>
        </div>
      </div>
    </div>
  );
};
