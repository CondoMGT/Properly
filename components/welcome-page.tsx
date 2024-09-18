"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserIcon, BuildingIcon } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { appName } from "@/utils/constants";
import { useTheme } from "next-themes";

export function WelcomePage() {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-white">
      <main className="flex-grow">
        <div className="relative h-[50vh]">
          <Image
            src={
              theme === "dark"
                ? "https://www.cpomanagement.ca/wp-content/uploads/2023/06/condo-unit-requests-1024x682.jpg"
                : "https://www.reca.ca/wp-content/uploads/2019/10/condo-low-rise-exterior.jpg"
            }
            alt="Modern Building Management"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-6">
                Welcome to {appName}
              </h1>
              <p className="text-xl md:text-2xl text-center mb-8">
                Your all-in-one solution for condo management and communication
              </p>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="mr-2" />
                  For Tenants / Homeowners
                </CardTitle>
                <CardDescription>
                  Access your tenant / homeowner portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Manage your requests, pay rent, and communicate with property
                  management easily.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/tenants" className="w-full">
                  <Button className="w-full">Enter Tenant Portal</Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BuildingIcon className="mr-2" />
                  For Property Managers
                </CardTitle>
                <CardDescription>
                  Access the management dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Oversee properties, handle tenant requests, and manage condo
                  operations efficiently.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/managers" className="w-full">
                  <Button className="w-full">Enter Management Dashboard</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer className="bg-gray-100 mt-16" />
    </div>
  );
}
