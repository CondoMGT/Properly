"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Plan = {
  name: string;
  price: string;
  description: string;
  features: string[];
  additionalPricing?: string;
};

type FeatureComparison = {
  feature: string;
  Basic: string | boolean;
  Deluxe: string | boolean;
  Premium: string | boolean;
};

const plans: Plan[] = [
  {
    name: "Basic",
    price: "$100",
    description: "For small property owners",
    features: [
      "Manage 5-10 properties",
      "Up to 100 tenants",
      "Basic reporting",
      "Tenant portal",
    ],
    additionalPricing: "$50 for every 50 additional tenants",
  },
  {
    name: "Deluxe",
    price: "$80",
    description: "For growing property portfolios",
    features: [
      "Manage 11-20 properties",
      "Up to 500 tenants",
      "Advanced reporting",
      "Maintenance requests",
      "Online payments",
    ],
    additionalPricing: "$40 for every 100 additional tenants",
  },
  {
    name: "Premium",
    price: "$60",
    description: "For large-scale property management",
    features: [
      "Manage 21+ properties",
      "Up to 1,000 tenants",
      "Custom reporting",
      "API access",
      "Dedicated support",
    ],
    additionalPricing: "$30 for every 150 additional tenants",
  },
];

const featureComparison: FeatureComparison[] = [
  {
    feature: "Number of properties",
    Basic: "5-10",
    Deluxe: "11-20",
    Premium: "21+",
  },
  {
    feature: "Number of tenants",
    Basic: "Up to 100",
    Deluxe: "Up to 500",
    Premium: "Up to 1,000",
  },
  {
    feature: "Property Manager portal",
    Basic: true,
    Deluxe: true,
    Premium: true,
  },
  { feature: "Tenant portal", Basic: true, Deluxe: true, Premium: true },
  {
    feature: "Maintenance requests",
    Basic: true,
    Deluxe: true,
    Premium: true,
  },
  { feature: "Online payments", Basic: false, Deluxe: true, Premium: true },
  {
    feature: "Reporting",
    Basic: "Basic",
    Deluxe: "Advanced",
    Premium: "Custom",
  },
  { feature: "API access", Basic: false, Deluxe: false, Premium: true },
  { feature: "Dedicated support", Basic: false, Deluxe: false, Premium: true },
  {
    feature: "Additional tenant pricing",
    Basic: "$50 per 50",
    Deluxe: "$40 per 100",
    Premium: "$30 per 150",
  },
];

const additionalServices = [
  {
    name: "Integration Services",
    description: "Optimize your system with seamless integrations",
    price: "$1,000 per customer",
  },
  {
    name: "White-labelling Solutions",
    description: "Strengthen your brand with customized white-labelling",
    price: "$3,000 per customer",
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("Basic");

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12">Pricing Plans</h1>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col border-t-4 border-r-4 ${
              selectedPlan === plan.name
                ? "ring-2 ring-custom-2 border-t-0 border-r-0"
                : ""
            }${
              plan.name === "Deluxe"
                ? " border-t-custom-3 border-r-custom-3"
                : " border-t-custom-2 border-r-custom-2"
            }`}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold">
                {plan.price}
                <span className="text-sm font-normal">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-custom-2 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {plan.additionalPricing && (
                <p className="mt-4 text-sm text-gray-600">
                  {plan.additionalPricing}
                </p>
              )}
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                className={`w-full${
                  selectedPlan === plan.name
                    ? " bg-custom-1 hover:bg-custom-1"
                    : " bg-transparent"
                }${
                  plan.name === "Deluxe"
                    ? " bg-custom-3 text-black"
                    : plan.name === "Premium"
                    ? " bg-custom-2"
                    : ""
                }`}
                onClick={() => setSelectedPlan(plan.name)}
                variant={selectedPlan === plan.name ? "default" : "outline"}
              >
                {selectedPlan === plan.name ? "Selected" : "Select Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <h2 className="text-3xl font-bold text-center mb-8">
        Feature Comparison
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature</TableHead>
            <TableHead>Basic</TableHead>
            <TableHead>Deluxe</TableHead>
            <TableHead>Premium</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {featureComparison.map((row) => (
            <TableRow key={row.feature}>
              <TableCell>{row.feature}</TableCell>
              <TableCell>
                {typeof row.Basic === "boolean" ? (
                  row.Basic ? (
                    <Check className="text-custom-2" />
                  ) : (
                    <X className="text-red-500" />
                  )
                ) : (
                  row.Basic
                )}
              </TableCell>
              <TableCell>
                {typeof row.Deluxe === "boolean" ? (
                  row.Deluxe ? (
                    <Check className="text-custom-2" />
                  ) : (
                    <X className="text-red-500" />
                  )
                ) : (
                  row.Deluxe
                )}
              </TableCell>
              <TableCell>
                {typeof row.Premium === "boolean" ? (
                  row.Premium ? (
                    <Check className="text-custom-2" />
                  ) : (
                    <X className="text-red-500" />
                  )
                ) : (
                  row.Premium
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Additional Services */}
      <h2 className="text-3xl font-bold text-center mt-16 mb-8">
        Professional Add-On Services
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {additionalServices.map((service) => (
          <Card key={service.name} className="flex flex-col">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-2xl font-bold">{service.price}</p>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                variant="outline"
                className="w-full hover:text-white hover:bg-custom-1"
              >
                Learn More
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
