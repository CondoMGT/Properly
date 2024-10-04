import Image from "next/image";
import React from "react";

export const HowComp = () => {
  return (
    <div className="w-full max-w-[1266px] mx-auto h-auto flex-col justify-start items-start gap-10 p-4">
      <div className="w-full flex justify-start items-center mb-8">
        <div className="text-black text-[40px] font-medium font-kyiv tracking-tight leading-[56px]">
          How Properly Works
        </div>
      </div>

      {/* <div className="flex flex-col md:flex-row justify-start items-center gap-6"> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Property Managers Section */}
        <div className="col-span-1 flex flex-col h-auto px-6 pt-[61px] pb-[19px] bg-custom-3 w-full">
          <div className="flex flex-col justify-start items-start">
            <Image
              className="w-[50px] h-[50px]"
              src="/managers.png"
              alt="Property Managers"
              width={50}
              height={50}
            />
            <div className="flex flex-col justify-start items-start">
              <div className="text-black text-xl font-medium font-kyiv leading-[60px] w-full text-center">
                Property Managers
              </div>
              <div className="w-full text-black text-base font-light font-kumbh leading-normal">
                Invite tenants to sign up with a simple link and start managing
                all maintenance requests from one centralized dashboard.
              </div>
            </div>
          </div>
        </div>

        {/* Tenants Section */}
        <div className="col-span-1 flex justify-center items-center w-full bg-custom-2">
          <div className="flex flex-col justify-start items-start px-6 py-10 bg-white rounded-tl-[120px] rounded-br-[120px] w-full h-full">
            <Image
              className="w-[50px] h-[50px]"
              src="/tenants.png"
              alt="Tenants"
              width={50}
              height={50}
            />
            <div className="flex flex-col justify-start items-start">
              <div className="text-black text-xl font-medium font-kyiv leading-[60px] w-full text-center">
                Tenants
              </div>
              <div className="w-full text-black text-base font-light font-kumbh leading-normal">
                Submit requests effortlessly through the portal, receive
                temporary solutions, and track the progress of your request in
                real-time.
              </div>
            </div>
          </div>
        </div>

        {/* Proactive Resolution Section */}
        <div className="col-span-1 flex flex-col h-auto px-6 py-[35px] bg-custom-3 w-full">
          <div className="flex flex-col justify-start items-start">
            <Image
              className="w-[50px] h-[50px]"
              src="/pro.png"
              alt="Proactive Resolution"
              width={50}
              height={50}
            />
            <div className="flex flex-col justify-start items-start">
              <div className="text-black text-xl font-medium font-kyiv leading-[60px] w-full text-center">
                Proactive Resolution
              </div>
              <div className="w-full text-black text-base font-light font-kumbh leading-normal">
                Use AI-powered troubleshooting to minimize downtime and provide
                actionable solutions to tenants while tracking all feedback.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
