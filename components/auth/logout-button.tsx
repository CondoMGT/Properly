"use client";

import { pusherClient } from "@/lib/pusher";
import { signOut, useSession } from "next-auth/react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useEffect, useState } from "react";

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const [beamsClient, setBeamsClient] =
    useState<PusherPushNotifications.Client | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const client = new PusherPushNotifications.Client({
        instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
      });

      setBeamsClient(client);
    }
  }, []);

  const logout = async () => {
    if (session?.user?.id) {
      // Remove user from presence channel
      pusherClient.unsubscribe(`presence-channel`);
    }

    if (beamsClient) {
      await beamsClient.stop().catch(console.error);
    }
    await signOut();
  };

  return (
    <span className="w-full cursor-pointer" onClick={logout}>
      {children}
    </span>
  );
};
