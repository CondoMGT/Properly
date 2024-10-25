"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChevronRight, Eye, EyeOff, LogIn } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email({
    message: "Email is required",
  }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  password: z.string().min(8, {
    message: "Password is required",
  }),
});

export const TenantAuth = () => {
  const [cardTitle, setCardTitle] = useState("Create");
  const [showPassword, setShowPassword] = useState(false);

  console.log(cardTitle);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    console.log(values);
  };

  const loginForm = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLoginSubmit = (values: z.infer<typeof LoginSchema>) => {
    console.log(values);
  };
  return (
    <Card className="w-[60%]">
      <CardHeader className="bg-custom-3 mb-4 relative">
        <Link
          href="/"
          className="text-custom-1 text-xl font-bold font-kyiv flex items-center absolute top-1 left-1"
        >
          <Image
            src="/logo.svg"
            alt="Properly"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          Properly
        </Link>
        {/* <div className="flex flex-col md:flex-row gap-2 items-center md:items-start"> */}
        <div className="w-full flex flex-col justify-center items-center">
          <CardTitle className="text-2xl md:text-4xl font-semibold font-nunito">
            {cardTitle} Your Account
          </CardTitle>
          <CardDescription className="text-lg md:text-xl font-semibold font-nunito">
            {cardTitle === "Create"
              ? "Let's get your account set up"
              : "Let's get you into your account"}
          </CardDescription>
        </div>
        {/* </div> */}
      </CardHeader>
      <CardContent className="px-8">
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2 bg-custom-1">
            <TabsTrigger
              value="signup"
              onClick={() => setCardTitle("Create")}
              className="text-secondary font-semibold"
            >
              Sign Up
            </TabsTrigger>
            <TabsTrigger
              value="login"
              onClick={() => setCardTitle("Log Into")}
              className="text-secondary font-semibold"
            >
              Login
            </TabsTrigger>
          </TabsList>
          <div className="relative h-[550px]">
            <TabsContent value="signup" className="absolute inset-0">
              <Card className="w-full border-none shadow-none">
                {/* <ScrollArea className="h-[500px]"> */}
                <CardContent className="space-y-2 mt-4 px-0">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-2"
                    >
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
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
                            <FormLabel>Email Address</FormLabel>
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
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="flex items-center relative">
                                <Input
                                  // disabled={isPending}
                                  {...field}
                                  placeholder="Enter password"
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                />
                                {!showPassword ? (
                                  <Eye
                                    className="w-4 h-4 text-gray-500 absolute right-2 z-50 cursor-pointer"
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                  />
                                ) : (
                                  <EyeOff
                                    className="w-4 h-4 text-gray-500 absolute right-2 z-50 cursor-pointer"
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="w-full bg-custom-1 hover:bg-custom-1"
                        type="submit"
                      >
                        Sign Up
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </Form>
                  <Socials text="signing in" />
                </CardContent>
                {/* </ScrollArea> */}
              </Card>
            </TabsContent>
            <TabsContent value="login" className="absolute inset-0">
              <Card className="w-full border-none shadow-none">
                <CardContent className="space-y-2 mt-4 px-0">
                  <Form {...loginForm}>
                    <form
                      onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                      className="space-y-8"
                    >
                      <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
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
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <div className="flex items-center relative">
                                <Input
                                  // disabled={isPending}
                                  {...field}
                                  placeholder="Enter password"
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                />
                                {!showPassword ? (
                                  <Eye
                                    className="w-4 h-4 text-gray-500 absolute right-2 z-50 cursor-pointer"
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                  />
                                ) : (
                                  <EyeOff
                                    className="w-4 h-4 text-gray-500 absolute right-2 z-50 cursor-pointer"
                                    onClick={() =>
                                      setShowPassword((prev) => !prev)
                                    }
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        className="w-full bg-custom-1 hover:bg-custom-1"
                        type="submit"
                      >
                        Login
                        <LogIn className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </Form>
                  <Socials text="logging in" />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const Socials = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col">
      <Separator className="mt-4" />
      <span className="text-[#555555] text-sm font-normal font-open leading-7 tracking-tight block text-center">
        or Continue with
      </span>
      <div className="flex flex-col gap-2">
        <Button className="w-full bg-custom-1 hover:bg-custom-1" type="submit">
          <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 mr-2" />
          Continue with Google
        </Button>
        <Button className="w-full bg-custom-1 hover:bg-custom-1" type="submit">
          <FontAwesomeIcon icon={faFacebook} className="w-4 h-4 mr-2" />
          Continue with Facebook
        </Button>
      </div>
      <div className="text-[#797777] block text-center text-sm font-semibold mt-2 font-open leading-none tracking-tight">
        By {text}, you agree to the{" "}
        <Link href="/marketing/terms" className="underline">
          Term of Service
        </Link>{" "}
        and{" "}
        <Link href="/marketing/privacy" className="underline">
          Privacy Policy
        </Link>
      </div>
    </div>
  );
};
