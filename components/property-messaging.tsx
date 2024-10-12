"use client";

import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { SendHorizontal, Paperclip, Star, Archive } from "lucide-react";
import { getUserById } from "@/data/user";
import { useSession } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";

// Mock data for tenants
const tenants = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=32&width=32",
    unread: 2,
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=32&width=32",
    unread: 0,
  },
  {
    id: "3",
    name: "Carol Williams",
    avatar: "/placeholder.svg?height=32&width=32",
    unread: 1,
  },
];

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  isStarred: boolean;
}

export default function PropertyMessagingSystem() {
  const [selectedTenant, setSelectedTenant] = useState(tenants[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [newMessage, setNewMessage] = useState("");
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [managerId, setManagerId] = useState(
    "4e07b848-25d8-4757-94f1-8a2f41529a6d"
  );
  const user = useCurrentUser();
  // console.log(user);
  const currentUserId = "4e07b848-25d8-4757-94f1-8a2f41529a6d"; // This should be set dynamically based on the logged-in user

  const handleSendMessage = () => {
    const messageData = {
      senderId: currentUserId,
      receiverId: selectedTenant.id,
      content: newMessage,
    };

    setNewMessage("");
  };

  const handleStarMessage = (messageId: string) => {
    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      updatedMessages[selectedTenant.id] = updatedMessages[
        selectedTenant.id
      ].map((msg) =>
        msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
      );
      return updatedMessages;
    });
  };

  useEffect(() => {
    const tt = async () => {
      const res = await getUserById(managerId);

      console.log("MANAGER INFO", res);
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
            {tenants.map((tenant) => (
              <Button
                key={tenant.id}
                variant={
                  selectedTenant.id === tenant.id ? "secondary" : "ghost"
                }
                className="w-full justify-start mb-2 relative"
                onClick={() => setSelectedTenant(tenant)}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={tenant.avatar} alt={tenant.name} />
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
        <div className="w-2/3 pl-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              Chat with {selectedTenant.name}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArchiveConversation(selectedTenant.id)}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
          <ScrollArea className="flex-grow mb-4">
            {messages[selectedTenant.id]?.map((message) => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.senderId === currentUserId
                    ? "text-right"
                    : "text-left"
                }`}
              >
                <div className="flex items-center justify-end mb-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={() => handleStarMessage(message.id)}
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
                    message.senderId === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  {message.content}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {message.timestamp} • {message.status}
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="flex items-center">
            <Input
              placeholder="Type your message..."
              value={newMessage}
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
                      I confirm this file doesn't contain sensitive information
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
        </div>
      </CardContent>
    </Card>
  );
}
