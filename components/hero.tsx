import { Herod } from "./landing-page/herod";

const features = [
  {
    title: "AI-Powered Troubleshooting",
    description: "Resolve issues faster with built-in AI assistance.",
  },
  {
    title: "Integrated Calendar",
    description:
      "Schedule and track maintenance with an easy-to-use calendar feature.",
  },
  {
    title: "Feedback Loop & Dispute Management",
    description:
      "Receive and act on tenant feedback, track disputes, and resolve issues efficiently.",
  },
  {
    title: "Real-Time Updates",
    description:
      "Tenants can upload photos or videos of issues for faster diagnosis.",
  },
  {
    title: "Messaging System",
    description:
      "Communicate directly with tenants or send bulk announcements.",
  },
  {
    title: "Visual Documentation",
    description:
      "Tenants can upload photos or videos of issues for faster diagnosis.",
  },
];

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
    <div className="pb-4">
      <Herod />

      {/* SECOND */}
      <div className="w-full h-auto max-w-[1272px] mx-auto py-5 flex flex-col md:flex-row justify-between items-center">
        <div className="h-auto py-2.5 flex justify-center items-center gap-2.5">
          <div className="text-black text-2xl md:text-[40px] font-semibold md:font-medium font-kyiv">
            Why Choose Properly
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 h-auto">
          <div className="relative">
            <img
              className="w-10 h-10 absolute left-0 top-[18.31px]"
              src="https://via.placeholder.com/40x40"
              alt="Icon 1"
            />
            <div className="pl-12">
              <div className="text-black text-xl font-medium font-kyiv">
                Efficient Maintenance Management
              </div>
              <div className="text-black text-base font-light font-kumbh leading-normal">
                Easily handle and track all maintenance requests with AI-powered
                troubleshooting and real-time updates.
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              className="w-10 h-10 absolute left-0 top-[9px]"
              src="https://via.placeholder.com/40x40"
              alt="Icon 2"
            />
            <div className="pl-12">
              <div className="text-black text-xl font-medium font-kyiv">
                Proactive Communication
              </div>
              <div className="text-black text-base font-light font-kumbh leading-normal">
                Stay in touch with tenants and provide clear updates with
                automatic notifications and messaging.
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              className="w-10 h-10 absolute left-0 top-[18px]"
              src="https://via.placeholder.com/40x40"
              alt="Icon 3"
            />
            <div className="pl-12">
              <div className="text-black text-xl font-medium font-kyiv">
                Smart Analytics
              </div>
              <div className="text-black text-base font-light font-kumbh leading-normal">
                Get powerful insights into your property’s performance, tenant
                satisfaction, and maintenance efficiency.
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              className="w-10 h-10 absolute left-0 top-[17px]"
              src="https://via.placeholder.com/60x38"
              alt="Icon 4"
            />
            <div className="pl-12">
              <div className="text-black text-xl font-medium font-kyiv">
                Tenant-Friendly
              </div>
              <div className="text-black text-base font-light font-kumbh leading-normal">
                Give tenants a seamless experience with a simple request
                submission process using AI to troubleshoot issues and upload
                visual documents.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* THIRD */}
      <div className="w-full max-w-[1266px] mx-auto h-auto flex-col justify-start items-start gap-10 p-4">
        <div className="w-full flex justify-center items-center mb-8">
          <div className="text-black text-[40px] font-medium font-kyiv">
            How Properly Works
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-start items-center gap-6">
          {/* Property Managers Section */}
          <div className="flex flex-col h-auto px-6 pt-[61px] pb-[19px] bg-white w-full md:w-1/3">
            <div className="flex flex-col justify-start items-start">
              <img
                className="w-[50px] h-[50px]"
                src="https://via.placeholder.com/50x50"
                alt="Property Managers"
              />
              <div className="flex flex-col justify-start items-start">
                <div className="text-black text-xl font-medium font-kyiv leading-[60px] w-full text-center">
                  Property Managers
                </div>
                <div className="w-full text-black text-base font-light font-kumbh leading-normal">
                  Invite tenants to sign up with a simple link and start
                  managing all maintenance requests from one centralized
                  dashboard.
                </div>
              </div>
            </div>
          </div>

          {/* Tenants Section */}
          <div className="flex justify-center items-center w-full md:w-1/3 bg-[#9fa2a5]">
            <div className="flex flex-col justify-start items-start px-6 py-10 bg-white rounded-tl-[120px] rounded-br-[120px] w-full">
              <img
                className="w-[50px] h-[50px]"
                src="https://via.placeholder.com/50x50"
                alt="Tenants"
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
          <div className="flex flex-col h-auto px-6 py-[35px] bg-white w-full md:w-1/3">
            <div className="flex flex-col justify-start items-start">
              <img
                className="w-[50px] h-[50px]"
                src="https://via.placeholder.com/50x50"
                alt="Proactive Resolution"
              />
              <div className="flex flex-col justify-start items-start">
                <div className="text-black text-xl font-medium font-kyiv leading-[60px] w-full text-center">
                  Proactive Resolution
                </div>
                <div className="w-full text-black text-base font-light font-kumbh leading-normal">
                  Use AI-powered troubleshooting to minimize downtime and
                  provide actionable solutions to tenants while tracking all
                  feedback.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOURTH */}
      <div className="w-full h-auto relative bg-white p-4 pb-8">
        <div className="max-w-[1072px] mx-auto py-2.5 flex justify-center items-center gap-2.5">
          <div className="text-black text-[2.5rem] font-medium font-kyiv leading-[3rem] text-center">
            Features That Make Properly Easier
          </div>
        </div>
        {/* <div className="w-[1262px] left-[66px] top-[114px] absolute justify-start items-start gap-[33px] inline-flex"> */}
        <div className="w-full max-w-[1262px] mx-auto flex flex-col gap-5 mt-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="p-2 bg-[#1e1e1e] rounded-full flex justify-center items-center">
                <div className="w-6 h-6 relative flex justify-center items-center" />
              </div>
              <div className="flex flex-col">
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
