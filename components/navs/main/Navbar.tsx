import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

export const MainNav = () => {
  const [openSheet, setOpenSheet] = useState(false);
  return (
    <div className="w-full h-24 bg-custom-3 px-4 md:px-8 py-10 flex items-center justify-between">
      <div className="flex justify-start items-center w-2/3">
        <Link
          href="/"
          className="text-custom-1 text-2xl font-bold font-kyiv flex items-center"
        >
          <Image
            src="/logo.svg"
            alt="Properly"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          Properly
        </Link>
      </div>

      <div className="hidden md:flex items-center justify-between w-1/3">
        <Link
          href="/marketing/#about-properly"
          className="text-[22px] font-semibold font-nunito leading-[34px] hover:border-b-2 hover:border-b-gray-600 hover:text-gray-600 hover:pb-1"
        >
          About
        </Link>
        <Link
          href="/"
          className="text-[22px] font-semibold font-nunito leading-[34px] hover:border-b-2 hover:border-b-gray-600 hover:text-gray-600 hover:pb-1"
        >
          Property
        </Link>
        <Link
          href="/marketing/contact-us"
          className="text-[22px] font-semibold font-nunito leading-[34px] hover:border-b-2 hover:border-b-gray-600 hover:text-gray-600 hover:pb-1"
        >
          Contact
        </Link>
      </div>

      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTrigger asChild>
          <Menu className="w-8 h-8 text-custom-1 md:hidden" />
        </SheetTrigger>
        <SheetContent className="bg-custom-3">
          <SheetHeader>
            <SheetTitle className="sr-only">Mobile Nav</SheetTitle>
            <SheetDescription className="sr-only">
              Mobile Navigation
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col items-center justify-evenly h-64">
            <Link
              href="/marketing/#about-properly"
              onClick={() => setOpenSheet(false)}
              className="text-[22px] font-semibold font-nunito leading-[34px] hover:border-b-2 hover:border-b-gray-600 hover:text-gray-600 hover:pb-1"
            >
              About
            </Link>
            <Link
              href="/"
              onClick={() => setOpenSheet(false)}
              className="text-[22px] font-semibold font-nunito leading-[34px] hover:border-b-2 hover:border-b-gray-600 hover:text-gray-600 hover:pb-1"
            >
              Property
            </Link>
            <Link
              href="/marketing/contact-us"
              onClick={() => setOpenSheet(false)}
              className="text-[22px] font-semibold font-nunito leading-[34px] hover:border-b-2 hover:border-b-gray-600 hover:text-gray-600 hover:pb-1"
            >
              Contact
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
