import { LeftNavbar } from "@/components/navs/dashboard/left-navbar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-full flex bg-custom-4 min-h-screen overflow-auto">
      <LeftNavbar />

      <main className="flex-1 h-screen overflow-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
