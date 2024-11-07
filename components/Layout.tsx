"use client";

import { usePresenceChannel } from "@/hooks/usePresenceChannel";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  usePresenceChannel();

  return <>{children}</>;
};
