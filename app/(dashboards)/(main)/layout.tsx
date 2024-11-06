import { LeftNavbar } from "@/components/navs/dashboard/left-navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full flex bg-custom-4 overflow-hidden">
      <LeftNavbar />

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
