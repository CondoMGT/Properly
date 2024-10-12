"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader } from "lucide-react";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUp() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
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
    <div className="bg-background flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/auth/login"
        className="absolute right-4 top-4 md:right-8 md:top-8 hover:underline text-sm text-muted-foreground"
      >
        Already have an account? Sign In
      </Link>
      <div className="lg:p-8 w-full">
        <div className="mx-auto flex flex-col justify-center space-y-6 w-[350px] px-4 sm:px-0">
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
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to create your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            {...field}
                            placeholder="John Doe"
                            id="name"
                            autoCorrect="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            disabled={isPending}
                            {...field}
                            placeholder="name@example.com"
                            id="email"
                            autoCorrect="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
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
                              <Eye
                                className="w-4 h-4 text-gray-500 absolute right-2 z-50 cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                              />
                            ) : (
                              <EyeOff
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
                </div>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="term"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            I agree to the{" "}
                            <Link
                              href="/terms"
                              className="text-primary underline hover:text-primary/90"
                            >
                              terms and conditions
                            </Link>
                          </FormLabel>
                        </div>
                        {/* <FormMessage /> */}
                      </FormItem>
                    )}
                  />
                </div>
                <Button disabled={isPending} type="submit">
                  {isPending && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
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
            href="/auth/login"
            className="text-muted-foreground text-center text-sm hover:underline hidden lg:block"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>

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
            src="/leo.png"
            alt="Hero"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (min-width: 769px) 50vw"
          />
        </div>

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
