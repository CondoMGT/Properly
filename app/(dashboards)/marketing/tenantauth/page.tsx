import { TenantAuth } from "@/components/auth/tenant/auth";
import React from "react";

const TAuthPage = () => {
  return (
    <div className="max-w-[1452px] w-full h-screen mx-auto bg-custom-4 flex justify-center items-center px-4">
      <TenantAuth />
    </div>
  );
};

export default TAuthPage;
