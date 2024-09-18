"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Menu } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 px-2 border-b bg-gray-100 dark:bg-gray-300 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <Image
              src="/frame2.png"
              width={96}
              height={50}
              alt="Condo building"
              priority
              className="mx-auto w-24 py-2"
            />
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/about">About</Link>
            <Link href="/products">Products</Link>
            <Link href="/contact">Contact</Link>
          </nav>
        </div>

        <div className="flex gap-2">
          <ModeToggle />
          <Button className="md:hidden" variant="outline" size="icon">
            <span className="sr-only">Toggle menu</span>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};
