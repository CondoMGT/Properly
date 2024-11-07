"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, DollarSign } from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { getTenantMessagesWithManager } from "@/data/tenant";
import { getManagerId } from "@/data/manager";

import { pusherClient } from "@/lib/pusher";
import { MessageReceived } from "@/lib/types";

import { RealTimeMessage } from "@/components/messages/realtime-message";
import { useBeams } from "@/hooks/use-Beams";
import { usePathname } from "next/navigation";
import { handleNotification } from "@/lib/helper";
import { format } from "date-fns";

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
  const user = useCurrentUser();
  useBeams(user?.id);

  const pathname = usePathname();

  const [messages, setMessages] = useState<MessageReceived[]>([]);

  const [managerId, setManagerId] = useState<string | null>(null);

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  useEffect(() => {
    // Request notification permission
    if (
      !isMobile &&
      ("Notification" in window || navigator.serviceWorker) &&
      Notification.permission !== "granted"
    ) {
      Notification.requestPermission();
    }

    const subscribeToPusher = () => {
      pusherClient.subscribe("chat-app");

      pusherClient.bind("new-message", (data: MessageReceived) => {
        setMessages((prev) => [...prev, data]);

        // Show a notification for the new message
        handleNotification({
          title: "New Message",
          body: "You have received a new message",
          icon: "/logo.svg",
        });
      });
    };

    subscribeToPusher();

    const fetchMessages = async () => {
      const d = await getTenantMessagesWithManager(user?.id as string);
      setMessages(d as MessageReceived[]);
    };

    fetchMessages();

    return () => {
      pusherClient.unsubscribe("chat-app");
    };
  }, []);

  // Filter Messages to remove duplicate
  const filteredMessages = (messages || []).filter(
    (m, index, self) => self.indexOf(m) === index
  );

  if (pathname.includes("message")) {
    // Change all message statuses to "READ"
    filteredMessages.forEach((m) => {
      m.status = "DELIVERED"; // Assuming each message has a 'status' property
    });
  }

  useEffect(() => {
    const fetchManagerId = async () => {
      const id = await getManagerId(user?.id as string);

      setManagerId(id as string);
    };

    if (user?.id) {
      fetchManagerId();
    }
  }, [user]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader></CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <div className=" flex justify-between">
            <TabsList className="mb-4 bg-custom-1 text-secondary">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={user?.image as string}
                alt={user?.name as string}
              />
              <AvatarFallback>{user?.name?.charAt(0) as string}</AvatarFallback>
            </Avatar>
          </div>
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
                      <span>
                        Next rent due:{" "}
                        {format(
                          new Date().setMonth(new Date().getMonth() + 1),
                          "PPP"
                        ) || tenant.rentDue}
                      </span>
                    </div>
                    <span className="font-bold">${tenant.rentAmount}</span>
                  </div>
                  <Button className="mt-4 bg-custom-1 hover:bg-custom-1 font-semibold">
                    Pay Rent
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Communicate with your Property Manager
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
