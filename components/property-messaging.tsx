"use client";

import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Archive } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { getTenantsForManager } from "@/data/manager";

import { getTenantMessagesWithManager } from "@/data/tenant";
import { pusherClient } from "@/lib/pusher";
import { AllUser, MessageReceived, UserLoggedInEvent } from "@/lib/types";
import { RealTimeMessage } from "@/components/messages/realtime-message";

export const PropertyMessagingSystem = () => {
  const [selectedTenant, setSelectedTenant] = useState<AllUser | null>(null);
  const [allTenant, setAllTenant] = useState<AllUser[]>([]);
  const [messages, setMessages] = useState<Record<string, MessageReceived[]>>(
    {}
  );

  const [onlineUsers, setOnlineUsers] = useState([]);

  const user = useCurrentUser();

  // Presence
  useEffect(() => {
    if (!user) return;

    const channel = pusherClient.subscribe(`presence-channel-${user?.id}`);

    channel.bind("user-logged-in", (data: UserLoggedInEvent) => {
      console.log("Online users", data.userId);
    });

    // console.log("channel", channel);

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`presence-channel-${user?.id}`);
    };
  }, [user]);

  useEffect(() => {
    const tt = async () => {
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
      tt();
    }

    pusherClient.subscribe("chat-app");

    pusherClient.bind("new-message", (data: MessageReceived) => {
      setMessages((prev) => {
        const currentMessages = prev[selectedTenant?.id as string] || [];
        return {
          ...prev,
          [selectedTenant?.id as string]: [...currentMessages, data], // Append new message
        };
      });
    });

    return () => {
      pusherClient.unsubscribe("chat-app");
    };
  }, [selectedTenant]);

  useEffect(() => {
    const tt = async () => {
      const res = await getTenantsForManager(user?.id as string);

      if (res) {
        setAllTenant(res.map((r) => r.user));
      }
    };

    tt();
  }, [user]);

  const handleArchiveConversation = (tenantId: string) => {
    // In a real application, this would move the conversation to an archived state
    console.log(`Archiving conversation with tenant ${tenantId}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Property Messaging System</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[600px]">
        <div className="w-1/3 border-r pr-4">
          <h3 className="text-lg font-semibold mb-4">Tenants</h3>
          <ScrollArea className="h-[520px]">
            {allTenant.map((tenant) => (
              <Button
                key={tenant.id}
                variant={
                  selectedTenant?.id === tenant.id ? "secondary" : "ghost"
                }
                className="w-full justify-start mb-2 relative"
                onClick={() => setSelectedTenant(tenant)}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage
                    src={tenant.avatar as string}
                    alt={tenant.name}
                  />
                  <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="flex-grow text-left">{tenant.name}</span>
                {tenant.unread > 0 && (
                  <Badge variant="destructive" className="absolute right-2">
                    {tenant.unread}
                  </Badge>
                )}
              </Button>
            ))}
          </ScrollArea>
        </div>
        {!selectedTenant && (
          <div className="w-2/3 pl-4 flex items-center justify-center">
            Select a tenant to start a conversation
          </div>
        )}
        {selectedTenant && (
          <div className="w-2/3 pl-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
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
