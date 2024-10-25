"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  code: z
    .string()
    .length(6, { message: "Verification Code must be 6 characters longs." }),
});

const VerificationPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <div className="w-full h-52 bg-custom-3 px-4 md:px-8 flex flex-col md:flex-row items-center">
        <div className="flex justify-start w-1/3 pt-4">
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

        <div className="flex flex-col items-center md:pt-10">
          <span className="text-6xl font-semibold font-nunito leading-[72px]">
            Welcome
          </span>
          <span className="text-[28px] font-semibold font-nunito leading-[34px]">
            Let&apos;s get your account verified
          </span>
        </div>
      </div>

      <div className="flex flex-col px-4 md:px-8 pt-4 space-y-8">
        <span className="text-4xl font-semibold font-nunito leading-[56px]">
          Verify Your Email
        </span>
        <span className="text-[18px] font-semibold font-nunito leading-[34px]">
          We&apos;ve sent a verification code to your email. Please enter it
          below.
        </span>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <div className=""> */}
            <Button
              variant="link"
              className="text-sm text-primary font-nunito hover:underline -ml-4"
            >
              Resend Verification Code
            </Button>
            {/* </div> */}

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-custom-1 hover:bg-custom-1 px-8"
              >
                Verify Email
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerificationPage;
