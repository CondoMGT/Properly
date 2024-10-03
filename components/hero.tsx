import { FaqComp } from "./landing-page/faq";
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
      <FaqComp />
    </div>
  );
};
