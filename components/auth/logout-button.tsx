"use client";

import { pusherClient } from "@/lib/pusher";
import { signOut, useSession } from "next-auth/react";

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const logout = async () => {
    if (session?.user?.id) {
      // Remove user from presence channel
      pusherClient.unsubscribe(`presence-channel`);
    }

    await signOut();
  };

  return (
    <span className="w-full cursor-pointer" onClick={logout}>
      {children}
    </span>
  );
};
