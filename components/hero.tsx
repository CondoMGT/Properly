import { FaqComp } from "./landing-page/faq";
import { FeaturesComp } from "./landing-page/features";
import { Hero } from "./landing-page/hero";
import { HowComp } from "./landing-page/how";
import { JoinComp } from "./landing-page/join";
import { PricingComp } from "./landing-page/pricing";
import { WhyComp } from "./landing-page/why";

export const HeroPage = () => {
  return (
    <div className="pb-4 space-y-8">
      <Hero />

      {/* SECOND */}
      <div className="w-full bg-custom-4 py-8">
        <WhyComp />
      </div>

      {/* THIRD */}
      <HowComp />

      {/* FOURTH */}
      <div className="w-full bg-custom-4">
        <FeaturesComp />
      </div>

      {/* FIVE */}
      <PricingComp />

      {/* SIX */}
      <div className="w-full bg-custom-4">
        <JoinComp />
      </div>

      {/* SEVEN */}
      <FaqComp />
    </div>
  );
};
