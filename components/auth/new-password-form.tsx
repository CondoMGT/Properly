"use client";

import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";

import {
  Form,
  FormLabel,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form/form-error";
import { FormSuccess } from "@/components/form/form-success";

import { useTransition, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { newPassword } from "@/actions/auth/new-password";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Link from "next/link";
import { ProperlyLogo } from "@/components/logo/logo";

export const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const data = await newPassword(values, token);
      setError(data?.error);
      setSuccess(data?.success);

      form.reset();
    });
  };

  return (
    <Card className="w-[350px] shadow-md">
      <CardHeader>
        <ProperlyLogo />
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                          placeholder="Enter new password..."
                          type={showPassword ? "text" : "password"}
                        />
                        {!showPassword ? (
                          <Eye
                            className="w-4 h-4 text-gray-500 absolute right-2 z-50"
                            onClick={() => setShowPassword((prev) => !prev)}
                          />
                        ) : (
                          <EyeOff
                            className="w-4 h-4 text-gray-500 absolute right-2 z-50"
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

            <FormError message={error} />
            <FormSuccess message={success} />

            <Button disabled={isPending} type="submit" className="w-full">
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href="/auth/login">Back to login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
