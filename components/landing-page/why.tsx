import Image from "next/image";
import React from "react";

export const WhyComp = () => {
  return (
    <div className="w-full h-auto max-w-[1272px] mx-auto py-5 px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="h-auto py-2.5 flex justify-center items-center gap-2.5">
        <div className="text-black text-4xl font-medium font-kyiv">
          Why Choose Properly
        </div>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 h-auto">
        <div className="relative space-x-4">
          <Image
            src="/span.png"
            alt="Icon-1"
            width={40}
            height={40}
            className="absolute w-10 h-10 left-0 top-0"
          />
          <div className="pl-12">
            <div className="text-black text-2xl font-medium tracking-tight mb-6">
              Efficient Maintenance Management
            </div>
            <div className="text-black text-base font-light leading-normal tracking-tight">
              Easily handle and track all maintenance requests with AI-powered
              troubleshooting and real-time updates.
            </div>
          </div>
        </div>

        <div className="relative space-x-4">
          <Image
            src="/bots.png"
            alt="Icon-1"
            width={56}
            height={40}
            className="absolute w-14 h-10 left-0 top-0"
          />
          <div className="pl-12">
            <div className="text-black text-2xl font-medium tracking-tight mb-6">
              Tenant-Friendly
            </div>
            <div className="text-black text-base font-light leading-normal tracking-tight">
              Give tenants a seamless experience with a simple request
              submission process using AI to troubleshoot issues and upload
              visual documents.
            </div>
          </div>
        </div>

        <div className="relative space-x-4">
          <Image
            src="/network.png"
            alt="Icon-1"
            width={40}
            height={40}
            className="absolute w-10 h-10 left-0 top-0"
          />
          <div className="pl-12">
            <div className="text-black text-2xl font-medium tracking-tight mb-6">
              Proactive Communication
            </div>
            <div className="text-black text-base font-light leading-normal tracking-tight">
              Stay in touch with tenants and provide clear updates with
              automatic notifications and messaging.
            </div>
          </div>
        </div>

        <div className="relative space-x-4">
          <Image
            src="/analytics.png"
            alt="Icon-1"
            width={40}
            height={40}
            className="absolute w-10 h-10 left-0 top-0"
          />
          <div className="pl-12">
            <div className="text-black text-2xl font-medium tracking-tight mb-6">
              Smart Analytics
            </div>
            <div className="text-black text-base font-light leading-normal tracking-tight">
              Get powerful insights into your property’s performance, tenant
              satisfaction, and maintenance efficiency.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
