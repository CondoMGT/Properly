import { AboutComponent } from "./landing-page/about";
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

      <div className="w-full bg-custom-4 py-8">
        <AboutComponent />
      </div>

      {/* SECOND */}
      <WhyComp />

      {/* THIRD */}
      <div className="w-full bg-custom-4">
        <HowComp />
      </div>

      {/* FOURTH */}

      <FeaturesComp />

      {/* FIVE */}
      <div className="w-full bg-custom-4">
        <PricingComp />
      </div>

      {/* SIX */}

      <JoinComp />

      {/* SEVEN */}
      <div className="w-full bg-custom-4 pb-8">
        <FaqComp />
      </div>
    </div>
  );
};
