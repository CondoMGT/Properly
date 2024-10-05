import { AboutComponent } from "@/components/landing-page/about";
import { FaqComp } from "@/components/landing-page/faq";
import { FeaturesComp } from "@/components/landing-page/features";
import { Hero } from "@/components/landing-page/hero";
import { HowComp } from "@/components/landing-page/how";
import { JoinComp } from "@/components/landing-page/join";
import { PricingComp } from "@/components/landing-page/pricing";
import { WhyComp } from "@/components/landing-page/why";

const heroPageComponents = [
  Hero,
  AboutComponent,
  WhyComp,
  HowComp,
  FeaturesComp,
  PricingComp,
  JoinComp,
  FaqComp,
];

const renderComponents = () => {
  return heroPageComponents.map((Comp, index) =>
    index % 2 === 0 ? (
      <Comp key={index} />
    ) : (
      <div className="w-full bg-custom-4" key={index}>
        <Comp />
      </div>
    )
  );
};

export const HeroPage = () => {
  return <div className="pb-4 space-y-8">{renderComponents()}</div>;
};
