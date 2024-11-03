"use client";

import SignIn from "@/app/auth/login/page";
import { RoleGate } from "@/components/auth-gate/role-gate";
import { Header } from "@/components/header";
import { createSentenceCase } from "@/lib/helper";
import { UserRole } from "@prisma/client";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Tenantslayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const modifiedPathname = createSentenceCase(pathname.split("/").slice(-1)[0]);

  const headerTitle =
    modifiedPathname === "Tenants"
      ? "Dashboard"
      : modifiedPathname === "Maintenance"
      ? "Maintenance Dashboard"
      : modifiedPathname;

  const session = useSession();

  return (
    <div className="w-full h-screen max-w-[1312px] mx-auto pt-[56px] px-4 flex flex-col gap-8">
      {session.status === "loading" ? (
        <div className="h-full flex justify-center items-center">
          <Loader className="animate-spin w-24 h-24 text-custom-1" />
        </div>
      ) : session.status === "authenticated" ? (
        <RoleGate allowedRole={[UserRole.TENANT]}>
          <Header title={headerTitle} />
          <div className="w-full max-w-4xl mx-auto mb-8">{children}</div>
        </RoleGate>
      ) : (
        <SignIn />
      )}
    </div>
  );
};

export default Tenantslayout;
