import { TenantManagement } from "@/components/tenant/tenant-management";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

const TenantPage = () => {
  return (
    <Card>
      <CardContent>
        <TenantManagement />
      </CardContent>
    </Card>
  );
};

export default TenantPage;
