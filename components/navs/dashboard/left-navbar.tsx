"use client";

import { Button } from "@/components/ui/button";
import {
  Bell,
  CircleUserRound,
  Grid2x2Plus,
  LogOut,
  MessageSquare,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Settings,
  Users,
  Calendar,
} from "lucide-react";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Image from "next/image";
import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePathname } from "next/navigation";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { pusherClient } from "@/lib/pusher";
import { ReqInfo } from "@/app/(dashboards)/(main)/managers/maintenance/_components/maintenance-request-table";
import { getManagerId } from "@/data/manager";
import { MessageReceived } from "@/lib/types";
import usePresenceStore from "@/hooks/usePresenceStore";
// import { useBeams } from "@/hooks/use-Beams";

const navItems = [
  {
    layer: "top",
    menu: [
      { name: "Dashboard", icon: Grid2x2Plus, href: "/tenants" },
      { name: "Maintenance", icon: Wrench, href: "/tenants/maintenance" },
      { name: "Message", icon: MessageSquare, href: "/tenants/message" },
    ],
  },
  {
    layer: "bottom",
    menu: [
      { name: "Notification", icon: Bell, href: "/tenants/notification" },
      { name: "Settings", icon: Settings, href: "/tenants/settings" },
      { name: "Log Out", icon: LogOut, href: "" },
    ],
  },
];

const managerNavItems = [
  {
    layer: "top",
    menu: [
      { name: "Dashboard", icon: Grid2x2Plus, href: "/managers" },
      { name: "Maintenance", icon: Wrench, href: "/managers/maintenance" },
      { name: "Tenant", icon: Users, href: "/managers/tenant" },
      // { name: "Schedule", icon: Calendar, href: "/managers/schedule" },
      {
        name: "Contractor",
        icon: HiOutlineWrenchScrewdriver,
        href: "/managers/contractor",
      },
    ],
  },
  {
    layer: "bottom",
    menu: [
      { name: "Message", icon: MessageSquare, href: "/managers/message" },
      // { name: "Notification", icon: Bell, href: "/managers/notification" },
      { name: "Settings", icon: Settings, href: "/managers/settings" },
      { name: "Log Out", icon: LogOut, href: "" },
    ],
  },
];

const logError = (error: Error, errorInfo: React.ErrorInfo) => {
  // In a real application, you would send this to your error tracking service
  console.error("Caught an error:", error, errorInfo);
};

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => (
  <div role="alert" className="p-4 bg-red-100 text-red-700">
    <p>Something went wrong:</p>
    <pre className="mt-2 text-sm">{error.message}</pre>
  </div>
);

export const LeftNavbar = () => {
  const updatePath = usePresenceStore((state) => state.updatePath);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  const [newRequest, setNewRequest] = useState(false);
  const [tenantUpdate, setTenantUpdate] = useState(false);
  const [managerUpdate, setManagerUpdate] = useState(false);
  const [newMessage, setNewMessage] = useState(false);

  const [sheetError, setSheetError] = useState<Error | null>(null);

  const membersId = usePresenceStore((state) => state.membersId);
  console.log("Presence Store", membersId);

  useEffect(() => {
    if (sheetError) {
      logError(sheetError, { componentStack: "MobileNav" } as React.ErrorInfo);
    }
  }, [sheetError]);

  const session = useSession();
  const pathName = usePathname();

  useEffect(() => {
    // You can add any additional logic here if needed
    session.update();
  }, []);

  const handleResize = useCallback(() => {
    setIsLargeScreen(window.innerWidth >= 1024);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [handleResize]);

  // REAL-TIME MAINTENANCE UPDATE
  useEffect(() => {
    pusherClient.subscribe("maintenance");

    pusherClient.bind(
      "update",
      async ({ data, action }: { data: ReqInfo; action: string }) => {
        const managerId = await getManagerId(data.userId);
        if (
          session.data?.user.role === "MANAGER" &&
          session.data.user.id === managerId
        ) {
          if (action === "New Request") {
            setNewRequest(true);
          }

          if (action === "Tenant Update") {
            setTenantUpdate(true);
          }
        }

        if (
          session.data?.user.role === "TENANT" &&
          session.data.user.id === data.userId
        ) {
          if (action === "Manager Update") {
            setManagerUpdate(true);
          }
        }
      }
    );

    return () => {
      pusherClient.unsubscribe("maintenance");
    };
  }, [session.data?.user]);

  // REAL-TIME MESSAGE UPDATE
  useEffect(() => {
    pusherClient.subscribe("chat-app");

    pusherClient.bind("new-message", (data: MessageReceived) => {
      if (
        session.data?.user.role === "MANAGER" &&
        session.data.user.id === data.receiverId
      ) {
        setNewMessage(true);
      }

      if (
        session.data?.user.role === "TENANT" &&
        session.data.user.id === data.receiverId
      ) {
        setNewMessage(true);
      }
    });

    return () => {
      pusherClient.unsubscribe("chat-app");
    };
  }, [session.data?.user]);

  const clearNotifications = useCallback(() => {
    if (session?.data?.user?.role === "MANAGER") {
      if (pathName === "/managers/maintenance") {
        setNewRequest(false);
        setTenantUpdate(false);
      }
      if (pathName === "/managers/message") {
        setNewMessage(false);
      }
    } else if (session?.data?.user?.role === "TENANT") {
      if (pathName === "/tenants/message") {
        setNewMessage(false);
      }
      if (pathName === "/tenants/notification") {
        setManagerUpdate(false);
      }
    }
  }, [pathName, session?.data?.user?.role]);

  useEffect(() => {
    clearNotifications();
  }, [clearNotifications]);

  const NavContent = () => (
    <ScrollArea className="h-full py-6">
      <div className="flex flex-col h-full justify-between">
        {session.data?.user &&
          (session.data?.user.role === "MANAGER"
            ? managerNavItems
            : navItems
          ).map((item, index) => (
            <div
              key={`${item.layer}-${index}`}
              className="flex flex-col space-y-2 px-2"
            >
              {item.menu.map((itemMenu) => {
                const hasNotification =
                  (itemMenu.name === "Maintenance" &&
                    newRequest &&
                    session?.data?.user?.role === "MANAGER") ||
                  (itemMenu.name === "Maintenance" &&
                    tenantUpdate &&
                    session?.data?.user?.role === "MANAGER") ||
                  (itemMenu.name === "Message" && newMessage) ||
                  (itemMenu.name === "Notification" &&
                    managerUpdate &&
                    session?.data?.user?.role === "TENANT");

                const button = (
                  <Button
                    variant="ghost"
                    className={`w-full justify-start py-6 ${
                      isCollapsed ? "px-2" : "px-4"
                    } hover:bg-custom-1 hover:text-secondary ${
                      pathName === itemMenu.href && "bg-custom-1 text-secondary"
                    } relative`}
                  >
                    <itemMenu.icon
                      className={`h-5 w-5 ${
                        isLargeScreen && isCollapsed ? "mr-0" : "mr-2"
                      }`}
                    />
                    {!isLargeScreen || !isCollapsed ? (
                      <span>{itemMenu.name}</span>
                    ) : null}
                    {hasNotification && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-custom-8 rounded-full" />
                    )}
                  </Button>
                );

                if (itemMenu.name === "Log Out") {
                  return (
                    <LogoutButton key={itemMenu.name}>
                      <div>{button}</div>
                    </LogoutButton>
                  );
                }

                return (
                  <Link
                    key={itemMenu.name}
                    href={itemMenu.href}
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      if (itemMenu.name === "Maintenance") {
                        setNewRequest(false);
                        setTenantUpdate(false);
                      }

                      if (itemMenu.name === "Message") {
                        setNewMessage(false);
                      }

                      if (itemMenu.name === "Notification") {
                        setManagerUpdate(false);
                      }

                      if (session.data.user.id) {
                        updatePath(session.data.user.id, itemMenu.href);
                      }
                    }}
                  >
                    {button}
                  </Link>
                );
              })}
            </div>
          ))}
      </div>
    </ScrollArea>
  );

  const UserInfo = () => (
    <div className="font-semibold flex gap-2 px-4 w-full">
      <Avatar className="relative flex-shrink-0">
        <AvatarImage
          src={session?.data?.user?.image || ""}
          alt="avatar"
          className="object-cover rounded-full"
        />
        <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
          <CircleUserRound className="text-white" />
        </AvatarFallback>
      </Avatar>
      {(!isLargeScreen || !isCollapsed) && (
        <div className="flex flex-col gap-1 items-start overflow-hidden">
          <span className="text-gray-700 text-sm truncate w-full">
            {session?.data?.user?.name}
          </span>
          <span className="text-gray-500 text-xs truncate w-full">
            {session?.data?.user?.email}
          </span>
        </div>
      )}
    </div>
  );

  const UserInfoLoading = () => (
    <div className="flex items-center space-x-4 px-4">
      <Skeleton className="w-12 h-12 rounded-full bg-custom-2" />
      <div className="space-y-2">
        <Skeleton className="w-24 h-4 bg-custom-2" />
        <Skeleton className="w-32 h-4 bg-custom-2" />
      </div>
    </div>
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
      {isLargeScreen ? (
        <div
          className={`relative hidden h-screen flex-col border-r bg-custom-3 py-10 lg:flex ${
            isCollapsed ? "w-16" : "w-64"
          } transition-all duration-300`}
        >
          <div className="flex items-center px-4 mb-8">
            <Link
              href="/"
              className="text-custom-1 text-3xl font-semibold font-kyiv flex items-center"
            >
              <Image
                src="/logo.svg"
                alt="Properly"
                width={36}
                height={36}
                className="w-9 h-9"
              />
              {!isCollapsed && "Properly"}
            </Link>
          </div>
          {session.status === "authenticated" && <NavContent />}
          {session.status === "loading" && <LeftNavbar.Skeleton />}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-4 top-2 z-10 rounded-full bg-custom-1 hover:bg-custom-2 text-white shadow-md"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
            <span className="sr-only">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
          {session.status === "authenticated" && (
            <>
              <UserInfo />
            </>
          )}
          {session.status === "loading" && <UserInfoLoading />}
        </div>
      ) : (
        <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
          <Sheet
            open={isMobileNavOpen}
            onOpenChange={(open) => {
              try {
                setIsMobileNavOpen(open);
              } catch (error) {
                setSheetError(
                  error instanceof Error
                    ? error
                    : new Error("Unknown error occurred")
                );
              }
            }}
          >
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed left-4 top-4 z-40 bg-custom-1 hover:bg-custom-2 text-white lg:hidden"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-56 p-0 pt-10 pb-32 bg-custom-3"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">Nav Bar</SheetTitle>
                <SheetDescription className="sr-only">
                  Mobile Navigation Bar
                </SheetDescription>
              </SheetHeader>
              <div
                className="flex items-center px-4"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Link
                  href="/"
                  className="text-custom-1 text-3xl font-semibold font-kyiv flex items-center"
                >
                  <Image
                    src="/logo.svg"
                    alt="Properly"
                    width={36}
                    height={36}
                    className="w-9 h-9"
                  />
                  Properly
                </Link>
              </div>
              <NavContent />
              {session.status === "authenticated" && <UserInfo />}
              {session.status === "loading" && <UserInfoLoading />}
            </SheetContent>
          </Sheet>
        </ErrorBoundary>
      )}
    </ErrorBoundary>
  );
};

LeftNavbar.Skeleton = function NavItemsSkeleton() {
  return (
    <div className="flex flex-col h-full justify-between pb-6">
      <div className="flex flex-col space-y-2 px-2">
        <Skeleton className="h-10 w-full rounded-xl bg-custom-2" />
        <Skeleton className="h-10 w-full rounded-xl bg-custom-2" />
        <Skeleton className="h-10 w-full rounded-xl bg-custom-2" />
      </div>
      <div className="flex flex-col space-y-2 px-2">
        <Skeleton className="h-10 w-full rounded-xl bg-custom-2" />
        <Skeleton className="h-10 w-full rounded-xl bg-custom-2" />
        <Skeleton className="h-10 w-full rounded-xl bg-custom-2" />
      </div>
    </div>
  );
};
