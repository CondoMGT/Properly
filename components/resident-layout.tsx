"use client";

import { Footer } from "@/components/footer";
import { Header } from "@/components/nav";

export function ResidentLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Navbar */}
      <Header />

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
