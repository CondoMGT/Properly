import Image from "next/image";
import React from "react";

export const HowComp = () => {
  return (
    <div className="w-full max-w-[1266px] mx-auto h-auto flex-col justify-start items-start gap-10 p-4">
      <div className="w-full flex justify-start items-center mb-8">
        <div className="text-black text-4xl md:text-5xl font-medium font-kyiv tracking-tight leading-[56px]">
          How Properly Works
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Property Managers Section */}
        <div className="col-span-1 flex flex-col h-auto px-6 pt-[22px] pb-[34px] bg-custom-3 w-full">
          <div className="flex flex-col justify-start items-start h-full">
            <Image
              className="w-[50px] h-[50px]"
              src="/prop-manager.png"
              alt="Property Managers"
              width={50}
              height={50}
            />
            <div className="flex flex-col justify-start items-start">
              <div className="text-gray-900 text-2xl font-medium font-kyiv leading-[30px] w-full py-2.5">
                Property Managers
              </div>
              <div className="w-full text-black text-base font-normal font-kumbh leading-normal tracking-tight">
                Invite tenants, manage requests via a centralized dashboard, and
                communicate in real time. Properly tracks requests, uses
                feedback loops, and offers dispute management to boost
                transparency and reduce legal risks.
              </div>
            </div>
          </div>
        </div>

        {/* Tenants Section */}
        <div className="col-span-1 flex justify-center items-center w-full bg-custom-2">
          <div className="flex flex-col justify-start items-start px-6 py-10 bg-white rounded-tl-[120px] rounded-br-[120px] w-full h-full">
            <Image
              className="w-[50px] h-[50px]"
              src="/resident.png"
              alt="Tenants"
              width={50}
              height={50}
            />
            <div className="flex flex-col justify-start items-start">
              <div className="text-gray-900 text-2xl font-medium font-kyiv leading-[30px] py-2.5 w-full">
                Tenants
              </div>
              <div className="w-full text-black text-base font-normal font-kumbh leading-normal tracking-tight">
                Easily submit and track requests, upload media for clarity, and
                receive real-time updates. Properly ensures transparent
                communication, minimizing delays and frustration.
              </div>
            </div>
          </div>
        </div>

        {/* Proactive Resolution Section */}
        <div className="col-span-1 flex flex-col h-auto px-6 pt-[22px] pb-[34px] bg-custom-3 w-full">
          <div className="flex flex-col justify-start items-start">
            <Image
              className="w-[50px] h-[50px]"
              src="/resolution.png"
              alt="Proactive Resolution"
              width={50}
              height={50}
            />
            <div className="flex flex-col justify-start items-start">
              <div className="text-gray-900 text-2xl font-medium font-kyiv leading-[30px] py-2.5 w-full">
                Proactive Resolution
              </div>
              <div className="w-full text-black text-base font-normal font-kumbh leading-normal tracking-tight">
                With AI chatbot Bri, tenants troubleshoot issues quickly. For
                complex problems, real-time communication ensures fast
                resolutions, supported by feedback and dispute management to
                avoid conflicts.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
