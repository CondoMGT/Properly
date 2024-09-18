import { Footer } from "@/components/footer";
import { ModeToggle } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const ManagersPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-white">
      {/* Sticky Navbar */}
      <header className="sticky top-0 z-50 px-2 shadow-md shadow-blue-100 container mx-auto border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>
      <div className="flex-1 container px-2 py-6 mx-auto">Managers Page</div>
      <Footer className="bg-gray-100 mt-16" />
    </div>
  );
};

export default ManagersPage;
