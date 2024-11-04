"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Eye, EyeOff, Loader } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { RegisterSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { register } from "@/actions/auth/register";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Socials } from "@/components/auth/socials";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SignUp() {
  const searchParams = useSearchParams();

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      cycle:
        (searchParams.get("billing") as "monthly" | "annually") || "monthly",
      plan: (searchParams.get("plan") as string) || "freemium",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    startTransition(async () => {
      const data = await register(values);

      try {
        if (data?.success) {
          form.reset();
          router.push("/auth/login");
        }
      } catch {
        toast.error("Something went wrong! Please try again.");
      }
    });
  };

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center bg-custom-4 md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8 w-full">
        <div className="relative z-20 flex lg:hidden items-center justify-center w-[90%] text-lg font-medium my-8">
          <Link
            href="/"
            className="text-custom-1 text-3xl font-bold font-kyiv flex items-center"
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
        <div className="border-2 rounded-lg p-8 shadow-md m-4">
          <div className="w-full flex flex-col justify-center items-center">
            <div className="text-2xl md:text-3xl text-center font-semibold font-nunito mt-4 md:mt-0">
              Create Your Account
            </div>
            <div className="text-lg md:text-xl text-center font-semibold font-nunito">
              Let&apos; get your account set up
            </div>
          </div>
          <Separator className="my-4 bg-custom-1" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane.doe@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555 555-5555" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Password</FormLabel>
                    <FormControl>
                      <div className="flex items-center relative">
                        <Input
                          disabled={isPending}
                          {...field}
                          placeholder="Enter password"
                          id="password"
                          type={showPassword ? "text" : "password"}
                        />
                        {!showPassword ? (
                          <EyeOff
                            className="w-4 h-4 text-gray-500 absolute right-2 z-50 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                          />
                        ) : (
                          <Eye
                            className="w-4 h-4 text-gray-500 absolute right-2 z-50 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="cycle"
                  render={({ field }) => (
                    <FormItem className="space-y-3 col-span-1">
                      <FormLabel className="font-semibold">
                        Billing Cycle
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          // className="flex flex-col space-y-1"
                          className="grid grid-cols-2 md:grid-cols-1 space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="monthly" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Monthly
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="annually" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Annually
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem className="space-y-3 col-span-2">
                      <FormLabel className="font-semibold">Plan</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          // className="flex flex-col space-y-1"
                          className="grid grid-cols-2 space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="freemium" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Freemium
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="starter" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Starter
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="pro" />
                            </FormControl>
                            <FormLabel className="font-normal">Pro</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="enterprise" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Enterprise
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                className="w-full bg-custom-1 hover:bg-custom-1"
                type="submit"
              >
                {isPending ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Getting Started
                  </>
                ) : (
                  <>
                    Sign Up
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>
          </Form>
          <div className="flex items-center justify-center mt-4">
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:underline"
            >
              Already have an account? Sign In
            </Link>
          </div>
          <Socials text="signing up" />
        </div>
      </div>

      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gray-300 dark:bg-teal-400" />
        <div className="relative z-20 flex items-center justify-center w-[90%] text-lg font-medium">
          <Link
            href="/"
            className="text-custom-1 text-3xl font-bold font-kyiv flex items-center"
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

        <Image
          src="/leo.png"
          alt="Hero"
          fill
          priority
          className="object-cover opacity-40"
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
        />

        <div className="relative z-20 mt-auto text-foreground">
          <blockquote className="space-y-2 font-semibold">
            <p className="text-lg">
              {`"Joining Properly was a game-changer for our community. The ease of communication and management tools have made living here a joy."`}
            </p>
            <footer className="text-sm">Alex Johnson, Resident</footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
