"use client";

import { useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { login } from "@/actions/auth/login";
import { useSession } from "next-auth/react";
import { ProperlyLogo } from "@/components/logo/logo";

export default function SignIn() {
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get("callbackUrl");

  const session = useSession();

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(async () => {
      // const data = await login(values, callbackUrl);
      const data = await login(values);

      try {
        if (data?.error) {
          toast.error(data?.error || "Something went wrong!");
        }

        if (data?.success) {
          form.reset();

          session.update();
        }
      } catch {
        toast.error("Something went wrong!");
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
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
            <ProperlyLogo />
            <h1 className="text-2xl font-semibold tracking-tight">
              Sign in to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to sign in to your account
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4">
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
                          <Input
                            type="password"
                            disabled={isPending}
                            {...field}
                            placeholder="Enter password"
                            id="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button disabled={isPending} type="submit">
                  {isPending && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              </div>
            </form>
          </Form>
          <div className="flex items-center justify-between">
            <Link
              href="/auth/reset-password"
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
