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
  FileText,
  Home,
  DollarSign,
  Hammer,
  Check,
  CheckCheck,
  Eye,
  Image,
  LinkIcon,
  X,
  FileSpreadsheet,
  FileCode,
  ImageIcon,
  Download,
  Loader2,
} from "lucide-react";

import { useCurrentUser } from "@/hooks/use-current-user";
import { getTenantMessagesWithManager } from "@/data/tenant";
import { MessageStatus } from "@prisma/client";
import { toast } from "sonner";
import { sendMessage } from "@/actions/message";
import { getManagerId } from "@/data/manager";

import { pusherClient } from "@/lib/pusher";
import {
  Attachment,
  CloudAttachment,
  MessageAttachment,
  MessageGroup,
  MessageReceived,
} from "@/lib/types";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";

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
  const [newMessage, setNewMessage] = useState("");
  const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false);
  const [managerId, setManagerId] = useState<string | null>(null);
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

  const [members, setMembers] = useState<{
    [id: string]: { name: string; email: string };
  }>({});

  const [isPending, startTransition] = useTransition();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
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
  }, [messages]);

  const user = useCurrentUser();

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

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      senderId: user?.id as string,
      receiverId: managerId as string,
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

  // const handleStarMessage = (messageId: number) => {
  //   const updatedMessages = messages.map((msg) =>
  //     msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
  //   );
  //   setMessages(updatedMessages);
  // };

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
        className={`flex flex-col space-y-2 p-4 border rounded-lg ${
          sender === user?.id ? "text-primary-foreground" : ""
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
                  <ScrollArea
                    className="h-[300px] mb-4 px-4"
                    ref={scrollAreaRef}
                  >
                    {filteredMessages.map((message) => (
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
                        <div
                          className={`text-xs text-muted-foreground mt-1 flex items-center gap-1${
                            message.senderId === user?.id ? " justify-end" : ""
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
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
                    ))}

                    {groupMessagesByDate(filteredMessages || []).map(
                      (group, groupIndex) => (
                        <div key={groupIndex} className="mb-4">
                          <div className="text-center text-sm text-muted-foreground mb-2">
                            {group.date}
                          </div>
                          {group.messages.map((message, messageIndex) => (
                            <div
                              key={`${user?.id}-${messageIndex}`}
                              className={`mb-4 ${
                                message.senderId === user?.id
                                  ? "text-right"
                                  : "text-left"
                              }`}
                            >
                              <div
                                className={`inline-block p-2 rounded-lg ${
                                  message.senderId === user?.id
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
                                    message.senderId === user?.id
                                      ? "text-primary-foreground"
                                      : "text-muted-foreground"
                                  } mt-1 flex items-center gap-1 justify-end
                            `}
                                >
                                  {new Date(
                                    message.timestamp
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
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
                      disabled={isPending}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
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
                            Attach files here
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
                    <Button disabled={isPending} onClick={handleSendMessage}>
                      {isPending ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <>
                          <SendHorizontal className="h-4 w-4 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="maintenance">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Maintenance Requests
                  </CardTitle>
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
};
