"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { pusherClient } from "@/lib/pusher";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

type User = {
  id: string;
  path: string;
  role: string;
};

type UserPresenceContextType = {
  users: User[];
  isUserOnline: (userId: string) => boolean;
  getUserPath: (userId: string) => string | undefined;
  isUserOnPath: (userId: string, path: string) => boolean;
  updateUserPath: (userId: string, newPath: string) => void;
};

const UserPresenceContext = createContext<UserPresenceContextType | undefined>(
  undefined
);

export const PresenceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const pathname = usePathname();

  const updateUserPath = useCallback(
    (userId: string, newPath: string) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, path: newPath } : user
        )
      );
    },
    [pathname]
  );

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = pusherClient.subscribe(`presence-channel`);

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      const users = Object.keys(members.members).map((id) => ({
        id,
        path: members.members[id].path,
        role: members.members[id].role,
      }));
      setUsers(users);
    });

    channel.bind("pusher:member_added", (member: any) => {
      setUsers((prevUsers) => {
        // Check if the user already exists
        const userExists = prevUsers.some((user) => user.id === member.id);

        // If the user doesn't exist, add them to the array
        if (!userExists) {
          return [
            ...prevUsers,
            {
              id: member.id,
              path: member.info.path,
              role: member.info.role,
            },
          ];
        }

        // If the user already exists, return the previous array unchanged
        return prevUsers;
      });
    });

    channel.bind("pusher:member_removed", (member: any) => {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== member.id)
      );
    });

    channel.bind(
      "client-path-change",
      ({ userId, path }: { userId: string; path: string }) => {
        updateUserPath(userId, path);
        console.log("Path change received:", { userId, path });
      }
    );

    return () => {
      pusherClient.unsubscribe(`presence-channel`);
    };
  }, [session?.user?.id, updateUserPath]);

  useEffect(() => {
    if (pathname && session?.user?.id) {
      updateUserPath(session.user.id, pathname);
      const channel = pusherClient.channel("presence-channel");
      if (channel) {
        channel.trigger("client-path-change", {
          userId: session.user.id,
          path: pathname,
        });
      }
      updateUserPath(session.user.id, pathname);
    }
  }, [pathname, session?.user?.id, updateUserPath]);

  const isUserOnline = useCallback(
    (userId: string) => users.some((user) => user.id === userId),
    [users]
  );

  const getUserPath = useCallback(
    (userId: string) => users.find((user) => user.id === userId)?.path,
    [users]
  );

  const isUserOnPath = useCallback(
    (userId: string, path: string) => {
      const user = users.find((user) => user.id === userId);
      return user?.path === path;
    },
    [users]
  );

  return (
    <UserPresenceContext.Provider
      value={{ users, isUserOnline, getUserPath, isUserOnPath, updateUserPath }}
    >
      {children}
    </UserPresenceContext.Provider>
  );
};

export const useUserPresence = () => {
  const context = useContext(UserPresenceContext);
  if (context === undefined) {
    throw new Error("useUserPresence must be used within a PresenceProvider");
  }
  return context;
};
