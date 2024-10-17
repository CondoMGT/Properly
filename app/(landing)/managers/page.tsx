import { RoleGate } from "@/components/auth-gate/role-gate";
import PropertyMessagingSystem from "@/components/property-messaging";
import { UserRole } from "@prisma/client";

const ManagerPage = () => {
  return (
    <div className="w-full h-screen max-w-[1312px] mx-auto pt-[23px] mb-8">
      <RoleGate allowedRole={[UserRole.MANAGER]}>
        <PropertyMessagingSystem />
      </RoleGate>
    </div>
  );
};

export default ManagerPage;
