import { LeftNavbar } from "@/components/navs/dashboard/left-navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex bg-custom-4">
      <LeftNavbar />

      <main className="flex-1 h-screen">{children}</main>
    </div>
  );
};

export default DashboardLayout;
