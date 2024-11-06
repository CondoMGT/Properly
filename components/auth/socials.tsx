"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export const Socials = ({
  text,
  show = true,
}: {
  text: string;
  show?: boolean;
}) => {
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google" | "facebook") => {
    signIn(provider, {
      callbackUrl: callbackUrl || "/tenants",
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
              onClick={() => onClick("google")}
            >
              <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            <Button
              className="w-full bg-custom-1 hover:bg-custom-1"
              onClick={() => onClick("facebook")}
            >
              <FontAwesomeIcon icon={faFacebook} className="w-4 h-4 mr-2" />
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
