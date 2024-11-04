import { TenantManagement } from "@/components/tenant/tenant-management";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const TenantPage = () => {
  return (
    <Card className="mb-4">
      <CardContent className="pb-0">
        <TenantManagement />
      </CardContent>
    </Card>
  );
};

export default TenantPage;
