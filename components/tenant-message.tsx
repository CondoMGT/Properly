"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Home, DollarSign, Hammer } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { getTenantMessagesWithManager } from "@/data/tenant";
import { getManagerId } from "@/data/manager";

import { pusherClient } from "@/lib/pusher";
import { MessageReceived } from "@/lib/types";

import { RealTimeMessage } from "@/components/messages/realtime-message";

// Mock data for the tenant
const tenant = {
  id: 1,
  name: "Alice Johnson",
  avatar: "/placeholder.svg?height=32&width=32",
  propertyAddress: "123 Main St, Anytown, USA",
  rentDue: "05/01/2023",
  rentAmount: 1200,
};

export const TenantMessage = () => {
  const [messages, setMessages] = useState<MessageReceived[]>([]);

  const [managerId, setManagerId] = useState<string | null>(null);

  const [members, setMembers] = useState<{
    [id: string]: { name: string; email: string };
  }>({});

  const user = useCurrentUser();

  // Presence
  useEffect(() => {
    if (!user) return;

    const channel = pusherClient.subscribe(`presence-channel-${managerId}`);

    channel.bind("pusher:subscription_succeeded", (members: any) => {
      setMembers(members.members);
    });

    channel.bind("user-logged-in", (data: any) => {
      console.log("Online users", data);
    });

    // console.log("channel", channel);

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe(`presence-channel-${managerId}`);
    };
  }, [user, managerId]);

  // console.log("members", members);

  useEffect(() => {
    const tt = async () => {
      const d = await getTenantMessagesWithManager(user?.id as string);

      setMessages(d as MessageReceived[]);
    };

    tt();

    pusherClient.subscribe("chat-app");

    pusherClient.bind("new-message", (data: MessageReceived) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      pusherClient.unsubscribe("chat-app");
    };
  }, []);

  // Filter Messages to remove duplicate
  const filteredMessages = messages.filter(
    (m, index, self) => self.indexOf(m) === index
  );

  useEffect(() => {
    const tt = async () => {
      const id = await getManagerId(user?.id as string);

      setManagerId(id as string);
    };

    if (user?.id) {
      tt();
    }
  }, [user]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Tenant Dashboard</span>
          <Avatar className="h-8 w-8">
            <AvatarImage src={tenant.avatar} alt={tenant.name} />
            <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Home className="mr-2" />
                    <span>{tenant.propertyAddress}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rent Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="mr-2" />
                      <span>Next rent due: {tenant.rentDue}</span>
                    </div>
                    <span className="font-bold">${tenant.rentAmount}</span>
                  </div>
                  <Button className="mt-4">Pay Rent</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Messages with Property Manager
                </CardTitle>
              </CardHeader>

              <CardContent>
                <RealTimeMessage
                  receiverId={managerId as string}
                  messages={filteredMessages || []}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
