"use client";

import { RoleGate } from "@/components/auth-gate/role-gate";
import { Header } from "@/components/header";
import { createSentenceCase } from "@/lib/helper";
import { UserRole } from "@prisma/client";
import { usePathname } from "next/navigation";

const Managerslayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const modifiedPathname = createSentenceCase(pathname.split("/").slice(-1)[0]);

  const headerTitle =
    modifiedPathname === "Managers" ? "Dashboard" : modifiedPathname;

  return (
    <div className="w-full h-screen max-w-[1312px] mx-auto pt-[56px] px-4 flex flex-col gap-8">
      <RoleGate allowedRole={[UserRole.MANAGER]}>
        <Header title={headerTitle} />
        <div className="w-full max-w-4xl mx-auto">{children}</div>
      </RoleGate>
    </div>
  );
};

export default Managerslayout;
