import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { useUserPresence } from "@/contexts/PresenceContext";

export const useUpdateUserPath = () => {
  const { data: session } = useSession();
  const { updateUserPath } = useUserPresence();

  const broadcastPathChange = useCallback(
    (newPath: string) => {
      if (session?.user?.id) {
        const channel = pusherClient.channel("presence-channel");
        if (channel) {
          channel.trigger("client-path-change", {
            userId: session.user.id,
            path: newPath,
          });
        }
        updateUserPath(session.user.id, newPath);
      }
    },
    [session?.user?.id, updateUserPath]
  );

  return broadcastPathChange;
};
