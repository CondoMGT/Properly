"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { ModeToggle } from "./theme-switcher";

export function ResidentLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 px-2 shadow-sm shadow-foreground container mx-auto border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">My Site</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/about">About</Link>
              <Link href="/products">Products</Link>
              <Link href="/contact">Contact</Link>
            </nav>
          </div>
          <ModeToggle />
          <Button className="md:hidden" variant="outline" size="icon">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container px-2 py-6 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome to My Site</h1>
        <p className="mb-4">
          {`This is the main content area. It will scroll if there's too much
          content, while the navbar sticks to the top and the footer sticks to
          the bottom.`}
        </p>
        {/* Add more content here to test scrolling */}
        {Array(50)
          .fill(0)
          .map((_, i) => (
            <p key={i} className="mb-4">
              {`This is paragraph ${
                i + 1
              }. It's here to demonstrate scrolling.`}
            </p>
          ))}
      </main>

      {/* Sticky Footer */}
      {/* <footer className="sticky bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            © 2023 My Company. All rights reserved.
          </p>
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer> */}
      <Footer className="bg-gray-100 dark:bg-gray-300 mt-16" />
    </div>
  );
}
