import { FeaturesComp } from "./landing-page/features";
import { Herod } from "./landing-page/herod";
import { HowComp } from "./landing-page/how";
import { JoinComp } from "./landing-page/join";
import { PricingComp } from "./landing-page/pricing";
import { WhyComp } from "./landing-page/why";

export const Hero = () => {
  return (
    <div className="pb-4 space-y-8">
      <Herod />

      {/* SECOND */}
      <div className="w-full bg-[#f0f1f2] py-8">
        <WhyComp />
      </div>

      {/* THIRD */}
      <HowComp />

      {/* FOURTH */}
      <div className="w-full bg-[#f0f1f2]">
        <FeaturesComp />
      </div>

      {/* FIVE */}
      <PricingComp />

      {/* SIX */}
      <div className="w-full bg-[#f0f1f2]">
        <JoinComp />
      </div>

      {/* SEVEN */}
      <div className="w-full max-w-[1322px] mx-auto h-auto flex flex-col justify-start items-start gap-6 p-4">
        <div className="self-stretch text-black text-[2.5rem] font-medium font-kyiv leading-[60px] text-center md:text-left">
          Our Frequently Asked Questions
        </div>
        <div className="flex-col justify-end items-start gap-2 flex w-full">
          <div className="self-stretch p-4 bg-white border-b border-[#e1e1e2] flex-col justify-center items-start gap-4">
            <div className="flex justify-between items-center">
              <div className="text-[#202024] text-[1.375rem] font-medium font-kumbh leading-normal">
                How does Properly help tenants with maintenance requests?
              </div>
              <div className="w-4 h-4 relative border border-black flex items-center justify-center rounded-full">
                <span className="text-sm font-bold leading-none">&minus;</span>
              </div>
            </div>
            <div className="self-stretch text-[#3c3c43] text-lg font-light font-kumbh leading-7">
              Tenants can easily submit requests, upload visual documentation,
              and track the status of their issues in real-time.
            </div>
          </div>
          <div className="self-stretch p-4 bg-white border-b border-[#e1e1e2] flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div className="text-[#202024] text-[1.375rem] font-medium font-kumbh leading-normal">
                How does the AI-powered troubleshooting work?
              </div>
              <div className="w-4 h-4 relative border border-black flex items-center justify-center rounded-full">
                <span className="text-sm font-bold leading-none">+</span>
              </div>
            </div>
          </div>
          <div className="self-stretch p-4 bg-white border-b border-[#e1e1e2] flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div className="text-[#202024] text-[1.375rem] font-medium font-kumbh leading-normal">
                What are the pricing plans?
              </div>
              <div className="w-4 h-4 relative border border-black flex items-center justify-center rounded-full">
                <span className="text-sm font-bold leading-none">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
