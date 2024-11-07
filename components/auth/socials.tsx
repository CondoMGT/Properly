"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";

import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export const Socials = ({
  text,
  show = true,
}: {
  text: string;
  show?: boolean;
}) => {
  const [pending, setPending] = useState(false);
  const [facebookPending, setFacebookPending] = useState(false);
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "facebook") => {
    if (provider === "google") {
      setPending(true);
    } else {
      setFacebookPending(true);
    }
    signIn(provider, {
      callbackUrl: callbackUrl || "/tenants",
    }).finally(() => {
      if (provider === "google") {
        setPending(false);
      } else {
        setFacebookPending(false);
      }
    });
  };
  return (
    <div className="flex flex-col">
      {show && (
        <>
          <Separator className="mt-8 mb-4 bg-custom-1" />
          <span className="text-[#555555] text-sm font-normal font-open leading-7 tracking-tight block text-center">
            or Continue with
          </span>
          <div className="flex flex-col gap-2">
            <Button
              className="w-full bg-custom-1 hover:bg-custom-1"
              disabled={pending}
              onClick={() => onClick("google")}
            >
              <FcGoogle
                className={`size-5 mr-2 ${pending && "animate-bounce"}`}
              />
              Continue with Google
            </Button>
            <Button
              className="w-full bg-custom-1 hover:bg-custom-1"
              disabled={facebookPending}
              onClick={() => onClick("facebook")}
            >
              <Image
                src="/facebook.svg"
                alt="Facebook"
                width={20}
                height={20}
                className={`w-5 h-5 mr-2 ${
                  facebookPending && "animate-bounce"
                }`}
              />
              Continue with Facebook
            </Button>
          </div>
        </>
      )}
      <div className="text-[#555555] block text-center text-sm font-semibold mt-4 font-nunito leading-none tracking-tight">
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
