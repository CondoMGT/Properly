"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { format, isThisWeek, isYesterday, isToday } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  SendHorizontal,
  Paperclip,
  Star,
  Archive,
  Check,
  CheckCheck,
  Eye,
  FileText,
  LinkIcon,
  X,
  Image,
  FileCode,
  ImageIcon,
  FileSpreadsheet,
  Loader2,
  Download,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { getTenantsForManager } from "@/data/manager";
import { Message, MessageStatus } from "@prisma/client";
import { toast } from "sonner";
import { sendMessage } from "@/actions/message";
import { getTenantMessagesWithManager } from "@/data/tenant";
import { pusherClient } from "@/lib/pusher";
import {
  AllUser,
  Attachment,
  CloudAttachment,
  MessageAttachment,
  MessageGroup,
  MessageReceived,
  UserLoggedInEvent,
} from "@/lib/types";

export default function PropertyMessagingSystem() {
  const [selectedTenant, setSelectedTenant] = useState<AllUser | null>(null);
  const [allTenant, setAllTenant] = useState<AllUser[]>([]);
  const [messages, setMessages] = useState<Record<string, MessageReceived[]>>(
    {}
  );
  const [newMessage, setNewMessage] = useState("");
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [tempAttachments, setTempAttachments] = useState<Attachment[]>([]);
  const [cloudAttachments, setCloudAttachments] = useState<CloudAttachment[]>(
    []
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);

  const [selectedAttachImage, setSelectedAttachImage] =
    useState<MessageAttachment | null>(null);

  const [selectedAttachPdf, setSelectedAttachPdf] =
    useState<MessageAttachment | null>(null);

  const [managerId, setManagerId] = useState(
    "4e07b848-25d8-4757-94f1-8a2f41529a6d"
  );
  const [onlineUsers, setOnlineUsers] = useState([]);

  const user = useCurrentUser();

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

  const [isPending, startTransition] = useTransition();
  // console.log(user);
  const currentUserId = "4e07b848-25d8-4757-94f1-8a2f41529a6d"; // This should be set dynamically based on the logged-in user

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current && bottomRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, tempAttachments]);

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

  const handleSendMessage = () => {
    const messageData = {
      senderId: user?.id as string,
      receiverId: selectedTenant?.id as string,
      content: newMessage,
      status: "SENT" as MessageStatus,
      timestamp: new Date(),
      attachments:
        cloudAttachments.length > 0 ? [...cloudAttachments] : undefined,
    };

    startTransition(async () => {
      const data = await sendMessage(messageData);

      try {
        if (data?.error) {
          toast.error(data?.error || "Something went wrong!");
        }

        if (data?.success) {
          setNewMessage("");
          setTempAttachments([]);
          setCloudAttachments([]);
        }
      } catch {
        toast.error("Something went wrong!");
      }
    });
  };

  // console.log("ATTCH", tempAttachments);

  const handleAttachFile = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);

      const imageId = Date.now().toString();

      setCloudAttachments((prev) => [
        ...prev,
        {
          id: imageId,
          type: file.type,
          name: file.name,
          buffer,
        },
      ]);

      const newAttachment: Attachment = {
        id: imageId,
        type: file.type.startsWith("image/") ? "image" : "file",
        url: URL.createObjectURL(file),
        name: file.name,
      };
      setTempAttachments((prev) => [...prev, newAttachment]);
    }
    setAttachmentDialogOpen(false);
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setTempAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== attachmentId)
    );

    setCloudAttachments((prev) =>
      prev.filter((attachment) => attachment.id !== attachmentId)
    );
  };

  // const handleStarMessage = (messageId: string) => {
  //   setMessages((prevMessages) => {
  //     const updatedMessages = { ...prevMessages };
  //     updatedMessages[selectedTenant.id] = updatedMessages[
  //       selectedTenant.id
  //     ].map((msg) =>
  //       msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
  //     );
  //     return updatedMessages;
  //   });
  // };

  useEffect(() => {
    const tt = async () => {
      const res = await getTenantsForManager(currentUserId);

      if (res) {
        setAllTenant(res.map((r) => r.user));
      }
    };

    tt();
  }, [managerId]);

  const handleArchiveConversation = (tenantId: string) => {
    // In a real application, this would move the conversation to an archived state
    console.log(`Archiving conversation with tenant ${tenantId}`);
  };

  const renderAttachment = (
    attachment: Attachment,
    allowRemove: boolean = false
  ) => {
    return (
      <div className="flex items-center space-x-2 rounded text-primary-foreground">
        {attachment.type === "file" && <FileText className="h-4 w-4" />}
        {attachment.type === "image" && <Image className="h-4 w-4" />}
        {attachment.type === "link" && <LinkIcon className="h-4 w-4" />}
        <span className="flex-grow">{attachment.name}</span>
        {allowRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => handleRemoveAttachment(attachment.id)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remove attachment</span>
          </Button>
        )}
      </div>
    );
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    if (type.includes("spreadsheet") || type === "text/csv")
      return <FileSpreadsheet className="h-4 w-4" />;
    if (type.includes("document")) return <FileText className="h-4 w-4" />;
    return <FileCode className="h-4 w-4" />;
  };

  const renderMsgAttachment = (
    attachment: MessageAttachment,
    sender: string
  ) => {
    return (
      <div
        className={`flex flex-col space-y-2 p-4 border rounded-lg${
          sender === user?.id ? " text-primary-foreground" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {getFileIcon(attachment.type)}
            <span className="font-medium">{attachment.name}</span>
          </div>
        </div>
        <div className="mt-2">
          {attachment.type.startsWith("image/") && (
            <img
              src={attachment.url}
              alt={attachment.name}
              className="w-56 h-auto rounded cursor-pointer"
              onClick={() => {
                setSelectedAttachImage(attachment);
                setIsDialogOpen(true);
              }}
            />
          )}
          {attachment.type === "application/pdf" && (
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => {
                  setSelectedAttachPdf(attachment);
                  setIsPdfDialogOpen(true);
                }}
                className={sender === user?.id ? "border border-white" : ""}
              >
                <Eye className="h-4 w-4 mr-2" />
                View PDF
              </Button>
              <Button
                onClick={() => window.open(attachment.url, "_blank")}
                className={sender === user?.id ? "border border-white" : ""}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          )}
          {(attachment.type === "text/csv" ||
            attachment.type.includes("spreadsheet")) && (
            <div className="p-4 rounded">
              <p>Preview not available for spreadsheet files.</p>
              <a
                href={attachment.url}
                download
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Download {attachment.name}
              </a>
            </div>
          )}
          {attachment.type.includes("document") && (
            <div className="p-4 rounded">
              <p>Preview not available for document files.</p>
              <a
                href={attachment.url}
                download
                className="text-blue-500 hover:underline mt-2 inline-block"
              >
                Download {attachment.name}
              </a>
            </div>
          )}
          {!attachment.type.startsWith("image/") &&
            attachment.type !== "application/pdf" &&
            !attachment.type.includes("spreadsheet") &&
            !attachment.type.includes("document") &&
            attachment.type !== "text/csv" && (
              <a
                href={attachment.url}
                download
                className="text-blue-500 hover:underline"
              >
                Download {attachment.name}
              </a>
            )}
        </div>
      </div>
    );
  };

  const groupMessagesByDate = (msgs: MessageReceived[]): MessageGroup[] => {
    const groups: MessageGroup[] = [];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    msgs.forEach((msg) => {
      const date = new Date(msg.timestamp);
      let dateString = "";
      if (isToday(date)) {
        dateString = "Today";
      } else if (isYesterday(date)) {
        dateString = "Yesterday";
      } else if (isThisWeek(date)) {
        dateString = format(date, "EEEE");
      } else if (date < sixMonthsAgo) {
        dateString = format(date, "MMM d, yyyy");
      } else {
        dateString = format(date, "EEE, MMM d");
      }

      const lastGroup = groups[groups.length - 1];
      if (lastGroup && lastGroup.date === dateString) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ date: dateString, messages: [msg] });
      }
    });
    return groups;
  };

  return (
    <>
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
              <ScrollArea
                className="flex-grow mb-4 px-4 h-[500px]"
                ref={scrollAreaRef}
              >
                {groupMessagesByDate(messages[selectedTenant?.id] || []).map(
                  (group, groupIndex) => (
                    <div key={groupIndex} className="mb-4">
                      <div className="text-center text-sm text-muted-foreground mb-2">
                        {group.date}
                      </div>
                      {group.messages.map((message, messageIndex) => (
                        <div
                          key={`${selectedTenant.id}-${messageIndex}`}
                          className={`mb-4 ${
                            message.senderId === currentUserId
                              ? "text-right"
                              : "text-left"
                          }`}
                        >
                          <div
                            className={`inline-block p-2 rounded-lg ${
                              message.senderId === currentUserId
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }`}
                          >
                            <div className="flex items-center justify-end mb-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-3 w-3 p-0"
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
                            <div>{message.content}</div>
                            {message.attachments &&
                              message.attachments.attachments &&
                              message.attachments.attachments.length > 0 &&
                              message.attachments.attachments.map(
                                (attachment, index) => {
                                  const extractedAttachment =
                                    JSON.parse(attachment);
                                  return (
                                    <div key={index} className="mt-2">
                                      {renderMsgAttachment(
                                        extractedAttachment,
                                        message.senderId
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            <div
                              className={`text-xs text-[10px] ${
                                message.senderId === currentUserId
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              } mt-1 flex items-center gap-1 justify-end
                            `}
                            >
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}{" "}
                              •{" "}
                              {message.status === "SENT" ? (
                                <Check className="w-3 h-3" />
                              ) : message.status === "DELIVERED" ? (
                                <CheckCheck className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
                {tempAttachments.length > 0 && (
                  <div className="mb-4">
                    <div className="text-center text-sm text-muted-foreground mb-2">
                      New Message
                    </div>
                    <div className="text-right">
                      <div className="inline-block p-2 rounded-lg bg-primary text-secondary-foreground">
                        {tempAttachments.map((attachment, index) => (
                          <div key={index} className="mt-2">
                            {renderAttachment(attachment, true)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
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
                    <Button
                      disabled={isPending}
                      variant="outline"
                      size="icon"
                      className="mr-2"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Attach File</DialogTitle>
                      <DialogDescription className="sr-only">
                        Attach a file at a time
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="file" className="text-right">
                          File
                        </Label>
                        <Input
                          id="file"
                          type="file"
                          className="col-span-3"
                          ref={fileInputRef}
                          onChange={handleAttachFile}
                        />
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
                <Button onClick={handleSendMessage} disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-4 w-4" />
                  ) : (
                    <>
                      <SendHorizontal className="h-4 w-4 mr-2" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedAttachImage && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{selectedAttachImage.name}</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <img
                src={selectedAttachImage.url}
                alt={selectedAttachImage.name}
                className="w-full h-auto"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = selectedAttachImage.url;
                  link.download = selectedAttachImage.name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download image</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {selectedAttachPdf && (
        <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedAttachPdf?.name}</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-[80vh]">
              <iframe
                src={selectedAttachPdf?.url}
                title={selectedAttachPdf?.name}
                className="w-full h-full border-0 rounded"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => window.open(selectedAttachPdf?.url, "_blank")}
              >
                <Download className="h-4 w-4" />
                <span className="sr-only">Download PDF</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
