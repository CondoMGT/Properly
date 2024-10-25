import { MainNav } from "@/components/navs/main/Navbar";
import { Button } from "@/components/ui/button";
import { ChevronRight, LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="max-w-[1452px] w-full mx-auto">
      <MainNav />

      <div className="flex">
        <div className="w-full md:w-1/2 h-full flex flex-col px-4 md:px-8 pt-8">
          <div className="text-6xl font-semibold font-nunito leading-[72px]">
            Welcome to Luxury Living
          </div>
          <div className="text-[28px] font-semibold font-nunito leading-[34px] pt-14">
            We help you manage your properties with ease and provide an
            exceptional living experience for your tenants.{" "}
          </div>
          <div className="px-8 flex items-center justify-between pt-12">
            <Button
              className="bg-custom-1 hover:bg-custom-1 text-lg p-6"
              asChild
            >
              <Link href="/auth/register">
                Sign Up
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>

            <Button
              className="bg-custom-11 hover:bg-custom-11 text-lg p-6"
              asChild
            >
              <Link href="/auth/login">
                Log In
                <LogIn className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="w-1/2 h-[536px] relative hidden md:block">
          <Image src="/main.png" alt="Main" fill className="object-cover" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
