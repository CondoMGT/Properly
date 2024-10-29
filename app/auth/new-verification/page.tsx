"use client";

import { newVerification } from "@/actions/auth/new-verification";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(() => {
    const token = searchParams.get("token");

    const verifyEmail = async () => {
      if (!token) {
        // setError("error");
        toast.error("Missing token");
        return;
      }

      try {
        const data = await newVerification(token);

        if (data.error) {
          setError(data.error);
        }

        setSuccess(data.success);
      } catch {
        setError("Something went wrong!");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="bg-custom-4 h-screen">
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
            We&apos;re verifying your account
          </span>
        </div>
      </div>

      <div className="flex flex-col px-4 md:px-8 pt-4 space-y-8">
        <span className="text-2xl text-center font-semibold font-nunito leading-[56px]">
          Email Verification
        </span>
        <div className="flex flex-col items-center space-y-4">
          {!success && !error && (
            <>
              <Loader2 className="h-16 w-16 text-custom-1 animate-spin" />
              <span className="text-[18px] font-semibold font-nunito">
                Verifying your email...
              </span>
            </>
          )}
          {!error && success && (
            <>
              <CheckCircle className="h-16 w-16 text-green-500" />
              <span className="text-[18px] font-semibold font-nunito">
                Your email has been successfully verified!
              </span>
              <Button
                asChild
                className="bg-custom-1 hover:bg-custom-1 px-8 mt-4"
              >
                <Link href="/auth/login">Go to Login</Link>
              </Button>
            </>
          )}
          {!success && !error && (
            <>
              <XCircle className="h-16 w-16 text-red-500" />
              <span className="text-[18px] font-semibold font-nunito">
                There was an error verifying your email.
              </span>
              <span className="text-[16px] font-nunito">
                Please try again or contact support if the problem persists.
              </span>
              <Button asChild variant="outline" className="px-8 mt-4">
                <Link href="/auth/loginh">Back to Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
