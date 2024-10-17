"use client";

import { useCurrentRole } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type RowGateProp = {
  children: React.ReactNode;
  allowedRole: UserRole[];
  showMessage?: boolean;
  onPage?: boolean;
};

export const RoleGate = ({
  children,
  allowedRole,
  showMessage = true,
}: // onPage = false,
RowGateProp) => {
  const role = useCurrentRole();

  if (!allowedRole.includes(role!)) {
    if (showMessage) {
      return (
        <div className="px-8">
          <Alert variant="destructive" className="mt-4">
            <ShieldAlert className="h-6 w-6" />
            <AlertTitle className="text-xl font-kumbh">
              Access Denied
            </AlertTitle>
            <AlertDescription className="text-xl font-kyiv">
              You do not have permission to view this content!
            </AlertDescription>
          </Alert>
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
};
