import React from "react";

export const AboutComponent = () => {
  return (
    <div
      id="about-properly"
      className="w-full h-auto max-w-[1272px] mx-auto py-8 px-4 flex flex-col md:flex-row justify-between items-center md:gap-16"
    >
      <div className="w-full flex-[20%] h-auto py-2.5 flex justify-start items-center gap-2.5">
        <div className="text-black text-4xl md:text-5xl font-semibold font-nunito leading-[56px]">
          About Properly
        </div>
      </div>

      <div className="w-full grid h-auto">
        <div className="w-full">
          <span className="text-custom-2 text-2xl font-semibold font-nunito leading-[30px]">
            Properly
          </span>
          <span className="text-black text-xl font-normal font-['Open Sans'] leading-[34px] tracking-tight">
            {" "}
            {/* is a modern property management platform that simplifies
            communication and maintenance between property managers and tenants.
            It offers real-time updates, easy issue reporting, and seamless
            communication.  */}
            is a comprehensive property management platform designed to simplify
            and streamline the complexities of managing real estate portfolios.
            With a focus on efficiency and innovation, Properly offers tools
            that enhance communication, expedite maintenance requests, and
            automate workflows for property managers and landlords alike.
            Whether managing a small portfolio or a large-scale operation,
            Properly delivers real-time solutions that minimize delays, reduce
            tenant dissatisfaction, and protect against financial risks.
            <br />
            <br />
            {/* Our{" "} */}
            Our platform is fully customizable, offering seamless integration
            with existing systems and white-labelling options to ensure your
            brand shines. With tiered pricing plans and scalable solutions,
            Properly adapts to your business needs, empowering property managers
            to deliver exceptional service while saving time and costs.
            <br />
            <br />
            Maximize operational success and keep your properties running
            smoothly with Properly—your partner in smart property management.
          </span>
          {/* <span className="text-custom-2 text-2xl font-medium font-kyiv leading-[30px]">
            AI-powered chatbot
          </span>
          <span className="text-black text-xl font-normal font-['Open Sans'] leading-[34px] tracking-tight">
            , Bri, helps tenants resolve common maintenance issues before
            involving property managers, ensuring faster resolutions and
            reducing delays. With advanced analytics, automated notifications,
            and feedback loops, Properly boosts tenant satisfaction and protects
            property managers from legal and financial risks.
          </span> */}
        </div>
      </div>
    </div>
  );
};
