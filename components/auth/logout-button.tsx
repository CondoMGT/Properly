"use client";

import { pusherClient } from "@/lib/pusher";
import { signOut, useSession } from "next-auth/react";
import { useCallback } from "react";

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const logout = useCallback(async () => {
    if (session?.user?.id) {
      // Remove user from presence channel
      pusherClient.unsubscribe(`presence-channel`);
    }
    await signOut();
  }, [session]);

  return (
    <span className="w-full cursor-pointer" onClick={logout}>
      {children}
    </span>
  );
};
