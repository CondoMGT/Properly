"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  additionalPricing?: string;
};

const plans: Plan[] = [
  {
    name: "Freemium",
    price: "Free for Ever",
    description: "For small property owners",
    features: [
      "Manage up to 5 Tenants",
      "Manage 1 seat",
      "AI-Powered Chatbot",
      "5 AI prompt daily / tenant",
      "Screen Reader Compatibility",
      "Email Notifications",
    ],
    additionalPricing: "",
  },
  {
    name: "Starter",
    price: "$99.99",
    description: "For small property owners",
    features: [
      "Manage up to 50 Tenants",
      "Manage up to 2 seats",
      "Basic Reporting",
      "API Access",
      "AI-Powered Chatbot",
      "Screen Reader Compatibility",
      "Language Customization",
      "Email Notifications",
    ],
    additionalPricing: "$50 for every 50 additional tenants",
  },
  {
    name: "Pro",
    price: "$79.99",
    description: "For growing property portfolios",
    features: [
      "Manage up to 250 Tenants",
      "Manage up to 4 seats",
      "Custom Reporting",
      "API Access",
      "Custom AI-Powered Chatbot",
      "Screen Reader Compatibility",
      "Language Customization",
      "Custom Branding",
      "Custom Email Notifications",
    ],
    additionalPricing: "$40 for every 100 additional tenants",
  },
  {
    name: "Enterprise",
    price: "$59.99",
    description: "For large-scale property management",
    features: [
      "Manage up to 1,000 Tenants",
      "Manage up to 12 seats",
      "Custom Reporting",
      "API Access",
      "Custom AI-Powered Chatbot",
      "Screen Reader Compatibility",
      "Language Customization",
      "Custom Branding",
      "Custom Email Notifications",
    ],
    additionalPricing: "$30 for every 150 additional tenants",
  },
];

const PricingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<string>("Basic");

  return (
    <div className="container mx-auto min-h-screen px-4 py-16 md:pb-4">
      <h1 className="text-4xl text-custom-1 font-bold font-nunito text-center mb-2">
        Properly Pricing Plans
      </h1>
      <h4 className="text-lg text-center font-semibold font-nunito leading-[34px] tracking-tight mb-12">
        Choose a plan that suits your property management needs and understand
        why upgrading is beneficial.
      </h4>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col bg-white border-t-4 ${
              plan.name === "Freemium"
                ? "border-t-[#ffa000]"
                : plan.name === "Starter"
                ? "border-t-[#1f2937]"
                : plan.name === "Pro"
                ? "border-t-custom-2"
                : "border-t-custom-1"
            }`}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold font-nunito leading-[34px] tracking-tight">
                {plan.name}
              </CardTitle>
              <CardDescription className="text-lg font-bold font-nunito leading-[30px]">
                {plan.name === "Freemium" ? plan.price : `${plan.price}/month`}
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-2">
              <Button
                className={`w-full font-semibold ${
                  plan.name === "Freemium"
                    ? "text-secondary-foreground"
                    : "text-white hover:text-white"
                } ${
                  plan.name === "Freemium"
                    ? "bg-[#ffa000] hover:bg-[#ffa000]"
                    : plan.name === "Starter"
                    ? "bg-[#1f2937] hover:bg-[#1f2937]"
                    : plan.name === "Pro"
                    ? "bg-custom-2 hover:bg-custom-2"
                    : "bg-custom-1 hover:bg-custom-1"
                }`}
                onClick={() => setSelectedPlan(plan.name)}
                variant={selectedPlan === plan.name ? "default" : "outline"}
              >
                {plan.name === "Freemium"
                  ? "Get Started For Free"
                  : "Start Now"}
              </Button>
              {plan.additionalPricing && (
                <p className="mt-4 text-xs text-center text-gray-600">
                  {plan.additionalPricing}
                </p>
              )}
            </CardFooter>
            <CardContent className="flex-grow">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-custom-2 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium font-nunito leading-[30px]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingPage;
