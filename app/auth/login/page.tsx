"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

export default function SignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gray-300 dark:bg-teal-400" />
        <div className="relative z-20 flex items-center justify-center w-[90%] text-lg font-medium">
          <Link
            href="/"
            className="text-custom-1 text-3xl font-medium font-kyiv flex items-center"
          >
            <Image
              src="/logo.svg"
              alt="Properly"
              width={56}
              height={56}
              className="w-14 h-14"
            />
            Properly
          </Link>
        </div>

        <div className="w-full opacity-20">
          <Image
            src="/leohoho.png"
            alt="Hero"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
          />
        </div>

        <div className="relative z-20 mt-auto text-foreground">
          <blockquote className="space-y-2">
            <p className="text-lg font-semibold">
              {`"Properly has revolutionized how we manage our properties. It's intuitive, efficient, and has greatly improved our communication with tenants."`}
            </p>
            <footer className="text-sm">Sofia Davis, Property Manager</footer>
          </blockquote>
        </div>
      </div>

      <div className="lg:p-8 w-full">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] px-4 sm:px-0">
          <div className="flex flex-col space-y-2 text-center">
            <Link
              href="/"
              className="text-custom-1 text-2xl font-medium font-kyiv flex items-center justify-center"
            >
              <Image
                src="/logo.svg"
                alt="Properly"
                width={28}
                height={28}
                className="w-7 h-7"
              />
              Properly
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign in to your account
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-2">
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
                  placeholder="Password"
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  disabled={isLoading}
                />
              </div>
              <Button disabled={isLoading}>
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </div>
          </form>
          <div className="flex items-center justify-between">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
            <Link
              href="/auth/register"
              className="text-sm text-primary hover:underline"
            >
              Create an account
            </Link>
          </div>

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
        </div>
      </div>
    </div>
  );
}
