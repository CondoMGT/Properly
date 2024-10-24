"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useUpdateUserPath } from "@/hooks/use-update-user-path";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const updateUserPath = useUpdateUserPath();

  useEffect(() => {
    updateUserPath(pathname);
  }, [pathname, updateUserPath]);

  return <>{children}</>;
};
