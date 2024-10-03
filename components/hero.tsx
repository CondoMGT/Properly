import { FeaturesComp } from "./landing-page/features";
import { Herod } from "./landing-page/herod";
import { HowComp } from "./landing-page/how";
import { WhyComp } from "./landing-page/why";

const plans = [
  {
    title: "Basic Plan",
    description: "For small properties and single-site managers.",
  },
  {
    title: "Pro Plan",
    description: "For multi-property managers with advanced features.",
  },
  {
    title: "Enterprise Plan",
    description: "Custom solutions for large-scale property management.",
  },
];

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
      <div className="w-full max-w-[1266px] mx-auto relative p-4 mb-48">
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-[400px] md:-bottom-60 flex justify-start items-center gap-4">
          <div className="px-5 py-3 bg-[#9fa2a5] rounded-full flex items-center gap-2.5">
            <div className="text-black text-lg font-normal font-kumbh">
              Choose Your Plan
            </div>
            <div className="p-2 bg-[#1e1e1e] rounded-full flex justify-center items-center">
              <div className="w-6 h-6 relative flex justify-center items-center" />
            </div>
          </div>
        </div>
        <div className="absolute left-0 top-0 text-black text-[2.5rem] font-medium font-kyiv leading-[60px] text-center w-full">
          Our Pricing
        </div>
        <div className="absolute left-0 top-[80px] flex flex-col items-start gap-5 w-full px-4">
          {plans.map((plan, index) => (
            <div
              key={index}
              className="flex items-start md:items-center gap-1 md:gap-4 w-full max-w-[669px]"
            >
              <div className="w-4 h-4 bg-[#1e1e1e] border p-1 mt-2 md:mt-0 rounded-full" />
              <div className="w-full flex flex-col justify-start md:flex-row md:items-center gap-2 pl-[11px]">
                <div className="text-black text-xl font-semibold font-kumbh leading-tight flex-[22%]">
                  {plan.title}
                </div>
                <div className="text-black text-lg font-normal font-kumbh leading-normal flex-[75%]">
                  {plan.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SIX */}
      <div className="w-full max-w-[1322px] mx-auto h-auto p-4 bg-white flex justify-between items-center flex-col lg:flex-row mt-96 md:mt-60">
        <div className="flex flex-col justify-center items-start gap-6 lg:w-1/2 p-4">
          <div className="text-black text-[2.5rem] font-medium font-kyiv leading-[60px]">
            Ready to Simplify Your Property Management?
          </div>
          <div className="text-black text-lg font-normal font-kumbh leading-normal text-left">
            Sign up today and experience how Properly can transform your
            property management process.
          </div>
          <div className="w-full flex justify-center items-center">
            <div className="px-5 py-3 bg-[#9fa2a5] rounded-full flex items-center gap-2.5">
              <div className="text-black text-lg font-normal font-kumbh">
                Start Your Free Trial
              </div>
              <div className="p-2 bg-[#1e1e1e] rounded-full flex justify-center items-center">
                <div className="w-6 h-6 relative flex justify-center items-center" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center lg:w-1/2 p-4">
          <img
            className="w-full h-auto max-w-[557px] max-h-[441px]"
            src="https://via.placeholder.com/557x441"
            alt="Placeholder"
          />
        </div>
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
