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
import { MessageStatus } from "@prisma/client";
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

interface MessageSentType {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  isStarred?: boolean;
}

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
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
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
          <TabsContent value="maintenance">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Maintenance Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="mb-4">
                  <Hammer className="mr-2 h-4 w-4" />
                  New Maintenance Request
                </Button>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                    <div>
                      <h4 className="font-semibold">Kitchen Sink Leak</h4>
                      <p className="text-sm text-muted-foreground">
                        Submitted: 04/28/2023
                      </p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-secondary rounded-lg">
                    <div>
                      <h4 className="font-semibold">Bedroom Window Stuck</h4>
                      <p className="text-sm text-muted-foreground">
                        Submitted: 04/15/2023
                      </p>
                    </div>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
