"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Archive, Info } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { getTenantsForManager } from "@/data/manager";

import { getTenantMessagesWithManager } from "@/data/tenant";
import { pusherClient } from "@/lib/pusher";
import { AllUser, MessageReceived } from "@/lib/types";
import { RealTimeMessage } from "@/components/messages/realtime-message";
// import { useUserPresence } from "@/contexts/PresenceContext";
import { Input } from "@/components/ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useBeams } from "@/hooks/use-Beams";
import { usePathname } from "next/navigation";
import { handleNotification } from "@/lib/helper";

export const PropertyMessagingSystem = () => {
  const [selectedTenant, setSelectedTenant] = useState<AllUser | null>(null);
  const [allTenant, setAllTenant] = useState<AllUser[]>([]);
  const [messages, setMessages] = useState<Record<string, MessageReceived[]>>(
    {}
  );

  const [updated, setUpdated] = useState<MessageReceived[]>([]);

  const pathname = usePathname();

  if (pathname.includes("message")) {
    Object.keys(messages).forEach((key) => {
      messages[key].forEach((message) => {
        message.status = "DELIVERED"; // Assuming each MessageReceived has a 'status' property
      });
    });
  }

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const debounced = useDebouncedCallback((value: string) => {
    setFilter(value);
  }, 300);

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setIsMobileOpen(window.innerWidth < 1024);
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const user = useCurrentUser();

  useBeams(user?.id);

  // const { isUserOnline, getUserPath, users } = useUserPresence();

  useEffect(() => {
    // Request notification permission
    if (
      !isMobile &&
      ("Notification" in window || navigator.serviceWorker) &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }

    const fetchTenantsMessages = async () => {
      const d = await getTenantMessagesWithManager(
        selectedTenant?.id as string
      );

      setMessages((prev) => {
        const messagesToAdd = Array.isArray(d) ? d : [];
        return {
          ...prev,
          [selectedTenant?.id as string]: messagesToAdd, // Append new message
        };
      });
    };

    if (selectedTenant) {
      fetchTenantsMessages();
    }

    const subscribeToPusher = () => {
      pusherClient.subscribe("chat-app");

      pusherClient.bind("new-message", (data: MessageReceived) => {
        setUpdated((prev) => [...prev, data]);
        setMessages((prev) => {
          const currentMessages = prev[selectedTenant?.id as string] || [];
          return {
            ...prev,
            [selectedTenant?.id as string]: [...currentMessages, data], // Append new message
          };
        });

        // Show a notification for the new message
        handleNotification({
          title: "New Message",
          body: "You have received a new message",
          icon: "/logo.svg",
        });
      });
    };
    subscribeToPusher();

    return () => {
      pusherClient.unsubscribe("chat-app");
    };
  }, [selectedTenant]);

  useEffect(() => {
    const fetchTenants = async () => {
      const res = await getTenantsForManager(user?.id as string);

      if (res) {
        setAllTenant(res.map((r) => r.user) as AllUser[]);
      }
    };

    fetchTenants();
  }, [user]);

  const handleArchiveConversation = (tenantId: string) => {
    // In a real application, this would move the conversation to an archived state
    console.log(`Archiving conversation with tenant ${tenantId}`);
  };

  const filteredTenants = filter
    ? allTenant.filter((t) => t.name.includes(filter))
    : allTenant;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex-1">Property Messaging System</CardTitle>
          <Input
            placeholder="Filter tenants"
            className={`${isMobileOpen ? "w-40" : "w-72"} placeholder:italic`}
            onChange={(e) => debounced(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex h-[600px] relative">
        <div className={`${isMobileOpen ? "w-16" : "w-64"} border-r pr-4`}>
          <h3 className="text-lg font-semibold mb-4">
            {isMobileOpen ? "Tena.." : "Tenants"}
          </h3>
          <ScrollArea className="h-[520px]">
            {filteredTenants.length > 0 &&
              filteredTenants.map((tenant) => {
                const isNotify = updated.some((u) => u.senderId === tenant.id);
                return (
                  <Button
                    key={tenant.id}
                    variant={
                      selectedTenant?.id === tenant.id ? "secondary" : "ghost"
                    }
                    className={`w-full justify-start mb-2 py-4 hover:bg-custom-3 relative${
                      selectedTenant?.id === tenant.id && " bg-custom-3"
                    }`}
                    onClick={() => {
                      setSelectedTenant(tenant);
                      setUpdated((prev) =>
                        prev.filter((p) => p.senderId !== tenant.id)
                      );
                    }}
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={tenant.avatar as string}
                        alt={tenant.name}
                      />
                      <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {!isMobileOpen && (
                      <>
                        <span className="flex-grow text-left">
                          {tenant.name}
                        </span>
                        {isNotify && (
                          <span className="absolute top-2 right-2 w-2 h-2 bg-custom-8 rounded-full" />
                        )}
                      </>
                    )}
                    {isMobileOpen && isNotify && (
                      <span className="absolute top-0 right-2 w-2 h-2 bg-custom-8 rounded-full" />
                    )}
                  </Button>
                );
              })}

            {!messages && filteredTenants.length === 0 && (
              <div className="flex flex-col space-y-4 items-center justify-center border p-4 rounded bg-custom-3">
                <Info className="w-4 h-4 text-custom-8" />
                <span className="text-xs italic">Close but no Ciggar</span>
              </div>
            )}
          </ScrollArea>
        </div>

        {!selectedTenant && (
          <div className="pl-4 flex-1 flex items-center justify-center">
            Select a tenant to start a conversation
          </div>
        )}
        {selectedTenant && (
          <div className="flex-1 pl-4 pr-2 pb-2 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm md:text-lg font-semibold truncate">
                Chat with {selectedTenant?.name}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleArchiveConversation(selectedTenant?.id as string)
                }
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
            <RealTimeMessage
              selectedTenantId={selectedTenant.id}
              receiverId={selectedTenant.id}
              messages={messages}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
