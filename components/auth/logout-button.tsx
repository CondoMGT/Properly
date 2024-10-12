"use client";

import { signOut } from "next-auth/react";

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const logout = () => {
    signOut();
  };

  return (
    <span className="w-full cursor-pointer" onClick={logout}>
      {children}
    </span>
  );
};
