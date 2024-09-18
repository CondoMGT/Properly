"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";
import { appName } from "@/utils/constants";

export default function SignUp() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/auth/sign-in"
        className="absolute right-4 top-4 md:right-8 md:top-8 hover:underline text-sm text-muted-foreground"
      >
        Already have an account? Sign In
      </Link>
      <div className="lg:p-8 w-full">
        <div className="mx-auto flex flex-col justify-center space-y-6 w-[350px] px-4 sm:px-0">
          <div className="flex flex-col space-y-2 text-center">
            <Image
              src="/frame2.png"
              width={200}
              height={100}
              alt="Condo building"
              priority
              className="mx-auto w-40 md:w-48 lg:w-56 lg:hidden"
            />
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Create a password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary underline hover:text-primary/90"
                  >
                    terms and conditions
                  </Link>
                </label>
              </div>
              <Button disabled={isLoading}>
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </div>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>

          <Link
            href="/auth/sign-in"
            className="text-muted-foreground text-center text-sm hover:underline hidden lg:block"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gray-300 dark:bg-teal-400" />
        <div className="relative z-20 flex items-center justify-center w-[90%] text-lg font-medium">
          <Image
            src="/frame2.png"
            width={400}
            height={100}
            alt="Condo building"
            priority
            className="mx-auto w-40 md:w-48 lg:w-56"
          />
        </div>

        <div className="relative z-20 mt-auto text-foreground">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {
                "Joining {appName} was a game-changer for our community. The ease of communication and management tools have made living here a joy."
              }
            </p>
            <footer className="text-sm">Alex Johnson, Resident</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
