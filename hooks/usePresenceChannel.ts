import { useCallback, useEffect, useRef } from "react";
import usePresenceStore from "./usePresenceStore";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";

export const usePresenceChannel = () => {
  const initialize = usePresenceStore((state) => state.initialize);
  const add = usePresenceStore((state) => state.add);
  const remove = usePresenceStore((state) => state.remove);

  const channelRef = useRef<Channel | null>(null);
  const initializedRef = useRef(false);

  const handleSetMembers = useCallback(
    (members: any) => {
      const filtered = Object.entries(members.members).map(([key, value]) => ({
        memberId: key,
        path: (value as any).path,
      }));
      initialize(filtered);
    },
    [initialize]
  );

  const handleAddMember = useCallback(
    (member: Record<string, any>) => {
      add(member.id);
    },
    [add]
  );

  const handleRemoveMember = useCallback(
    (member: Record<string, any>) => {
      remove(member.id);
    },
    [remove]
  );

  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) return;

    initializedRef.current = true;
    channelRef.current = pusherClient.subscribe("presence-properly");

    channelRef.current.bind(
      "pusher:subscription_succeeded",
      (members: Members) => {
        handleSetMembers(members);
      }
    );
    channelRef.current.bind("pusher:member_added", (member: any) => {
      console.log("Adding", member);

      handleAddMember;
    });
    channelRef.current.bind("pusher:member_removed", handleRemoveMember);

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind(
          "pusher:subscription_succeeded",
          handleSetMembers
        );
        channelRef.current.unbind("pusher:member_added", handleAddMember);
        channelRef.current.unbind("pusher:member_removed", handleRemoveMember);
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [handleSetMembers, handleAddMember, handleRemoveMember]);
};
