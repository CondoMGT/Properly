import { RoleGate } from "@/components/auth-gate/role-gate";
import TenantDashboard from "@/components/tenant-dashboard";
import { UserRole } from "@prisma/client";

const TenantPage = () => {
  return (
    <div className="w-full h-screen max-w-[1312px] mx-auto pt-[23px]">
      <RoleGate allowedRole={[UserRole.TENANT]}>
        <TenantDashboard />
      </RoleGate>
    </div>
  );
};

export default TenantPage;
