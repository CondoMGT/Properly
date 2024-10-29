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
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendMessage } from "@/actions/message";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Attachment,
  CloudAttachment,
  MessageAttachment,
  MessageGroup,
  MessageReceived,
} from "@/lib/types";
import { MessageStatus } from "@prisma/client";
import {
  ArrowUp,
  Check,
  CheckCheck,
  Download,
  Eye,
  FileCode,
  FileSpreadsheet,
  FileText,
  ImageIcon,
  ImageUpIcon,
  LinkIcon,
  Loader2,
  Paperclip,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import Image from "next/image";

interface RealTimeMessageProp {
  messages: MessageReceived[] | Record<string, MessageReceived[]>;
  receiverId: string;
  selectedTenantId?: string;
}

export const RealTimeMessage = ({
  messages,
  receiverId,
  selectedTenantId,
}: RealTimeMessageProp) => {
  const user = useCurrentUser();

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const [isPending, startTransition] = useTransition();

  // Scroll Messages to bottom
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

  // HANDLE ATTACHMENTS
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

  // SEND MESSAGE
  const handleSendMessage = () => {
    const messageData = {
      senderId: user?.id as string,
      receiverId: receiverId,
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

  // RENDERING ATTACHMENT
  const renderAttachment = (
    attachment: Attachment,
    allowRemove: boolean = false
  ) => {
    return (
      <div className="flex items-center space-x-2 rounded text-primary-foreground">
        {attachment.type === "file" && <FileText className="h-4 w-4" />}
        {attachment.type === "image" && <ImageUpIcon className="h-4 w-4" />}
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
        className={`flex flex-col space-y-2 p-4 rounded-lg ${
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
            <Image
              src={attachment.url}
              alt={attachment.name}
              width={208}
              height={240}
              className="w-52 h-60 rounded cursor-pointer"
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
                className={`bg-custom-0`}
              >
                <Eye className="h-4 w-4 mr-2" />
                View PDF
              </Button>
              <Button
                onClick={() => window.open(attachment.url, "_blank")}
                className={`bg-custom-2`}
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

  // REFINE MESSAGES BASED ON INTERFACE
  const refinedMessages: MessageReceived[] = selectedTenantId
    ? typeof messages === "object" && !Array.isArray(messages)
      ? messages[selectedTenantId] || []
      : []
    : Array.isArray(messages)
    ? messages
    : [];

  return (
    <>
      <ScrollArea className="flex-grow mb-4 px-4 h-[400px]" ref={scrollAreaRef}>
        {groupMessagesByDate(refinedMessages).map((group, groupIndex) => (
          <div key={groupIndex} className="mb-4">
            <div className="text-center text-sm text-muted-foreground mb-2">
              {group.date}
            </div>
            {group.messages.map((message, messageIndex) => (
              <div
                key={
                  selectedTenantId
                    ? `${selectedTenantId}-${messageIndex}`
                    : `${user?.id}-${messageIndex}`
                }
                className={`mb-4 ${
                  message.senderId === user?.id ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.senderId === user?.id
                      ? "bg-custom-1 text-primary-foreground"
                      : "bg-custom-3"
                  }`}
                >
                  {/* <div className="flex items-center justify-end mb-1">
                    <Button variant="ghost" size="sm" className="h-3 w-3 p-0">
                      <Star
                        className={`h-4 w-4 ${
                          message.isStarred
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    </Button>
                  </div> */}
                  <div>{message.content}</div>
                  {message.attachments &&
                    message.attachments.attachments &&
                    message.attachments.attachments.length > 0 &&
                    message.attachments.attachments.map((attachment, index) => {
                      const extractedAttachment = JSON.parse(attachment);
                      return (
                        <div key={index} className="mt-2">
                          {renderMsgAttachment(
                            extractedAttachment,
                            message.senderId
                          )}
                        </div>
                      );
                    })}
                  <div
                    className={`text-xs text-[8px] ${
                      message.senderId === user?.id
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    } mt-1 flex items-center gap-1 justify-end
                            `}
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
              </div>
            ))}
          </div>
        ))}
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
      <div className="relative w-full">
        <Input
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="pr-24 pl-12 py-6"
        />
        <Dialog
          open={attachmentDialogOpen}
          onOpenChange={setAttachmentDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              disabled={isPending}
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
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
                  I confirm this file doesn&apos;t contain sensitive information
                </Label>
              </div>
            </div>
            <Button onClick={() => setAttachmentDialogOpen(false)}>
              Attach
            </Button>
          </DialogContent>
        </Dialog>
        <Button
          onClick={handleSendMessage}
          disabled={isPending}
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-custom-1 hover:bg-custom-1"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4" />
          ) : (
            <>
              <ArrowUp className="h-4 w-4" />
              <span className="sr-only">Send Message</span>
            </>
          )}
        </Button>
      </div>

      {/* VIEW AND DOWNLOAD ATTACHED IMAGES */}
      {selectedAttachImage && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{selectedAttachImage.name}</DialogTitle>
              <DialogDescription className="sr-only">
                View and Download Attached Image
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <Image
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

      {/* VIEW AND DOWNLOAD ATTACHED PDF FILES */}
      {selectedAttachPdf && (
        <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{selectedAttachPdf?.name}</DialogTitle>
              <DialogDescription className="sr-only">
                View and Download PDF File
              </DialogDescription>
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
