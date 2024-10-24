"use client";

import { pusherClient } from "@/lib/pusher";
import { signOut, useSession } from "next-auth/react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";

const beamsClient = new PusherPushNotifications.Client({
  instanceId: process.env.NEXT_PUBLIC_BEAMS_INSTANCE_ID!,
});

export const LogoutButton = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const logout = async () => {
    if (session?.user?.id) {
      // Remove user from presence channel
      pusherClient.unsubscribe(`presence-channel`);
    }
    await beamsClient.stop().catch(console.error);
    await signOut();
  };

  return (
    <span className="w-full cursor-pointer" onClick={logout}>
      {children}
    </span>
  );
};
