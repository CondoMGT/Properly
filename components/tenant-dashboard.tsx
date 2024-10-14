"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SendHorizontal,
  User,
  Paperclip,
  Search,
  Bell,
  Star,
  FileText,
  Home,
  DollarSign,
  Hammer,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getTenantMessagesWithManager } from "@/data/tenant";
import { Message, MessageStatus } from "@prisma/client";
import { toast } from "sonner";
import { sendMessage } from "@/actions/message";
import { getManagerId } from "@/data/manager";
import { randomUUID } from "crypto";

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

const initialMessages = [
  {
    id: 1,
    sender: "tenant",
    content:
      "Hi, the sink in the kitchen is leaking. Can you send someone to fix it?",
    timestamp: "10:30 AM",
    status: "read",
    isStarred: false,
  },
  {
    id: 2,
    sender: "manager",
    content:
      "Hello Alice, I'm sorry to hear that. I'll send a plumber tomorrow morning. Is that okay?",
    timestamp: "11:15 AM",
    status: "delivered",
    isStarred: true,
  },
];

export default function TenantDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [managerId, setManagerId] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const user = useCurrentUser();

  useEffect(() => {
    const tt = async () => {
      const id = await getManagerId(user?.id as string);

      setManagerId(id as string);
    };

    if (user?.id) {
      tt();
    }
  }, [user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData: MessageSentType = {
      senderId: user?.id as string,
      receiverId: managerId as string,
      content: newMessage,
      status: "SENT",
      timestamp: new Date(),
    };

    const updatedMessages = [
      ...messages,
      {
        ...messageData,
        id: (messages.length + 1).toString(),
        isStarred: false,
        readBySender: true,
        readByReceiver: false,
      },
    ];

    startTransition(async () => {
      const data = await sendMessage(messageData);

      try {
        if (data?.error) {
          toast.error(data?.error || "Something went wrong!");
        }

        if (data?.success) {
          // form.reset();
          // session.update();
          setMessages(updatedMessages);
          setNewMessage("");
        }
      } catch {
        toast.error("Something went wrong!");
      }
    });
  };

  console.log(messages);

  // const handleStarMessage = (messageId: number) => {
  //   const updatedMessages = messages.map((msg) =>
  //     msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
  //   );
  //   setMessages(updatedMessages);
  // };

  useEffect(() => {
    const tt = async () => {
      const d = await getTenantMessagesWithManager(user?.id as string);

      console.log("FROM DATABASE", d);
      setMessages(d as Message[]);
    };

    tt();
  }, []);

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
                <ScrollArea className="h-[300px] mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 ${
                        message.senderId === user?.id
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      <div className="flex items-center justify-end mb-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0"
                          // onClick={() => handleStarMessage(message.id)}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              message.isStarred
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </Button>
                      </div>
                      <div
                        className={`inline-block p-2 rounded-lg ${
                          message.senderId === user?.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        {message.content}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • {message.status.toLowerCase()}
                      </div>
                    </div>
                  ))}

                  <div ref={bottomRef} />
                </ScrollArea>
                <div className="flex items-center">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    disabled={isPending}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-grow mr-2"
                  />
                  <Dialog
                    open={attachmentDialogOpen}
                    onOpenChange={setAttachmentDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="mr-2">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Attach File</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="file" className="text-right">
                            File
                          </Label>
                          <Input id="file" type="file" className="col-span-3" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" />
                          <Label htmlFor="terms">
                            I confirm this file doesn't contain sensitive
                            information
                          </Label>
                        </div>
                      </div>
                      <Button onClick={() => setAttachmentDialogOpen(false)}>
                        Attach
                      </Button>
                    </DialogContent>
                  </Dialog>
                  <Button onClick={handleSendMessage}>
                    <SendHorizontal className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
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
}
