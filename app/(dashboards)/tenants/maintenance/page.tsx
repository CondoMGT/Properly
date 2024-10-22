"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Badge } from "@/components/ui/badge";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  CheckCheck,
  File,
  FileUp,
  Paperclip,
  X,
  XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MaintenanceSchema,
} from "@/schemas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PulseLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import { summarizeMessages } from "@/actions/ai/summarizeMessages";

type Message = {
  type: "user" | "bot";
  content: string;
  image?: string;
};

const MaintenancePage = () => {
  const [dragActive, setDragActive] = useState(false);
  const [briBoard, setBriBoard] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showResolution, setShowResolution] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastChildRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
      }
    };

    if (lastChildRef.current) {
      lastChildRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Use a timeout to ensure the scroll occurs after the DOM updates
    const timeoutId = setTimeout(scrollToBottom, 100);

    return () => clearTimeout(timeoutId); // Cleanup timeout
  }, [messages]);

  const handleSend = async (initialInput?: string, initialImage?: string) => {
    const currentInput = initialInput || input;
    const currentImage = initialImage || image;

    if (currentInput.trim() === "" && !currentImage) return;

    const newMessage: Message = { type: "user", content: currentInput };

    if (currentImage) {
      newMessage.image = currentImage;
    }

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `You are Bri, an AI assistant helping tenants solve issues in their apartment. Your primary goal is to assist with maintenance requests and apartment-related problems.

            The tenant's message is: "${currentInput}".
            ${
              currentImage
                ? "The tenant has also provided an image of the issue."
                : ""
            }

            If the tenant's message is related to apartment maintenance or issues, provide a helpful response with possible solutions. Your response should not exceed 200 words.

            If the tenant's message is unrelated to apartment issues (e.g., general chit-chat or off-topic questions), politely acknowledge their message and gently redirect the conversation back to apartment-related topics. For example, you could say something like: "I appreciate your interest! While I enjoy our chat, I'm best equipped to help with apartment-related issues. Is there anything about your apartment I can assist you with today?"

            Introduce yourself as Bri only when the user first interacts with you. For subsequent interactions, do not introduce yourself again.

            Remember to keep your total response under 200 words.`,
          image: currentImage,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Gemini API");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }

      let botMessage: Message = { type: "bot", content: "" };
      setMessages((prev) => [...prev, botMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        botMessage.content += text;
        setMessages((prev) => [...prev.slice(0, -1), { ...botMessage }]);
      }

      setShowResolution(true);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setImage(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => setImage(reader.result as string);

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResolution = (resolved: boolean) => {
    setShowResolution(false);
    if (resolved) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "Great! I'm glad we could resolve your issue. Is there anything else I can help you with?",
        },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "I'm sorry the issue wasn't resolved. Would you like to escalate this to property management?",
        },
      ]);
    }
  };

  const handleEscalation = async (escalate: boolean) => {
    if (escalate) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "I've notified property management about your issue. They will contact you soon. Is there anything else I can help you with?",
        },
      ]);

      await handleSummarize();
    } else {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content:
            "Alright, let me know if there's anything else I can assist you with.",
        },
      ]);
    }
  };

  const handleSummarize = async () => {
    const summary = await summarizeMessages(messages);
    console.log("Conversation summary:", summary);
    // TODO: CREATE Maintenance Ticket
  };

  const form = useForm<z.infer<typeof MaintenanceSchema>>({
    resolver: zodResolver(MaintenanceSchema),
    defaultValues: {
      title: "",
      description: "",
      media: [],
    },
  });

  const onSubmit = (values: z.infer<typeof MaintenanceSchema>) => {
    setBriBoard(true);
    setInput(values.description);

    if (values.media && values.media.length > 0) {
      const file = values.media[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        handleSend(values.description, base64String);
      };

      reader.readAsDataURL(file);
    } else {
      handleSend(values.description);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (
    e: React.DragEvent,
    field: { value: File[]; onChange: (value: File[]) => void }
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      field.onChange([...field.value, ...files]);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center font-nunito text-3xl">
          Maintenance Requests
        </CardTitle>
        <CardDescription>
          Submit and track your maintenance requests.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pr-8">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-custom-1 hover:bg-custom-1 hover:font-bold text-secondary font-nunito font-semibold w-fit">
              New Request
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[90%] md:w-full rounded-xl bg-custom-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold font-nunito">
                New Maintenance Requests
              </DialogTitle>
              <DialogDescription className="text-xs">
                Describe your issue, and Bri will try to help you troubleshoot.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 px-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Issue Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the issue to me..."
                          className="resize-none"
                          rows={4}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!briBoard && (
                  <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media</FormLabel>
                        <FormControl>
                          <div
                            className={cn(
                              "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer",
                              dragActive ? "border-primary" : "border-gray-300",
                              "hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                            onDragEnter={(e) => handleDrag(e)}
                            onDragLeave={(e) => handleDrag(e)}
                            onDragOver={(e) => handleDrag(e)}
                            onDrop={(e) => handleDrop(e, field)}
                          >
                            <input
                              id="dropzone-file"
                              type="file"
                              className="hidden"
                              accept={[
                                ...ACCEPTED_IMAGE_TYPES,
                                ...ACCEPTED_VIDEO_TYPES,
                              ].join(",")}
                              multiple
                              onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                field.onChange([...field.value, ...files]);
                              }}
                            />
                            <label
                              htmlFor="dropzone-file"
                              className="flex flex-col items-center justify-center w-full h-full"
                            >
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="flex items-center justify-center mb-3 bg-custom-3 p-2 rounded-full">
                                  <FileUp className="w-8 h-8 text-custom-1" />
                                </div>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold text-custom-1">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Images (PNG, JPG, WebP) or Videos (MP4, WebM,
                                  OGG)
                                </p>
                              </div>
                            </label>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload images or videos. Max file size: 25MB.
                        </FormDescription>
                        <FormMessage />
                        {field.value.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {field.value.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-2"
                              >
                                <File className="w-4 h-4" />
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() => {
                                    const newFiles = [...field.value];
                                    newFiles.splice(index, 1);
                                    field.onChange(newFiles);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                )}
                {/* Camera input for mobile devices */}
                {/* <FormField
          control={form.control}
          name="media"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center justify-center">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    id="cameraInput"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        field.onChange([...field.value, file])
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => document.getElementById("cameraInput")?.click()}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Take a picture</span>
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Take a picture (on supported mobile devices).
              </FormDescription>
            </FormItem>
          )}
        /> */}

                {!briBoard && (
                  <div className="flex justify-center">
                    <Button
                      className="bg-custom-1 hover:bg-custom-1 hover:font-bold text-secondary font-nunito font-semibold w-1/2"
                      type="submit"
                    >
                      Ask Bri
                    </Button>
                  </div>
                )}
              </form>
            </Form>

            {briBoard && (
              <Card className="w-full max-w-md mx-auto border-none shadow-none bg-custom-4">
                <CardContent>
                  <ScrollArea className="h-[400px] px-2" ref={scrollAreaRef}>
                    {messages.slice(1).map((message, index) => (
                      <div
                        key={index}
                        className={`flex flex-col ${
                          message.type === "user"
                            ? "justify-end"
                            : "justify-start"
                        } mb-4`}
                      >
                        <div
                          className={`flex items-start ${
                            message.type === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={
                                message.type === "user" ? "" : "/ellipse.svg"
                              }
                              alt={message.type === "user" ? "User" : "Bree"}
                            />
                            <AvatarFallback>
                              {message.type === "user" ? "U" : "B"}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`mx-2 p-2 rounded-lg text-sm leading-7 tracking-tight ${
                              message.type === "user"
                                ? "bg-custom-1 text-primary-foreground"
                                : "bg-white"
                            }`}
                          >
                            {message.type === "user" ? (
                              <p>{message.content}</p>
                            ) : (
                              <ReactMarkdown>{message.content}</ReactMarkdown>
                            )}
                            {message.image && (
                              <div className="mt-2 max-w-[200px] self-end">
                                <Image
                                  src={message.image}
                                  alt="Uploaded image"
                                  width={200}
                                  height={200}
                                  className="rounded-lg object-cover"
                                />
                              </div>
                            )}
                            {/* </div> */}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start mb-4">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/ellipse.svg" alt="Bree" />
                            <AvatarFallback>B</AvatarFallback>
                          </Avatar>
                          <div className="bg-white p-2 rounded-lg">
                            <PulseLoader color="#008080" size={10} />
                          </div>
                        </div>
                      </div>
                    )}

                    {input.trim() && (
                      <div className="flex justify-end mb-4">
                        <div className="flex items-center flex-row-reverse space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="" alt="User" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="bg-custom-1 p-2 rounded-lg">
                            <PulseLoader color="white" size={10} />
                          </div>
                        </div>
                      </div>
                    )}
                    {showResolution && (
                      <div className="flex justify-center space-x-2 mb-4">
                        <Button
                          onClick={() => handleResolution(true)}
                          className="bg-custom-2 hover:bg-custom-2"
                        >
                          <CheckCheck className="w-4 h-4 mr-2" />
                          Issue Resolved
                        </Button>
                        <Button
                          onClick={() => handleResolution(false)}
                          className="bg-custom-8 hover:bg-custom-8"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Not Resolved
                        </Button>
                      </div>
                    )}
                    {messages[messages.length - 1]?.content.includes(
                      "escalate this to property management?"
                    ) && (
                      <div className="flex justify-center space-x-2 mb-4">
                        <Button
                          onClick={() => handleEscalation(true)}
                          className="bg-custom-2 hover:bg-custom-2"
                        >
                          Yes, Escalate
                        </Button>
                        <Button
                          onClick={() => handleEscalation(false)}
                          className="bg-custom-0 hover:bg-custom-0"
                        >
                          No, Thanks
                        </Button>
                      </div>
                    )}
                    <div ref={lastChildRef} />
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-2">
                  {image && (
                    <div className="w-full flex items-center justify-between bg-secondary p-2 rounded-lg mb-2">
                      <span className="text-sm">Image attached</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleRemoveImage}
                      >
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">Remove image</span>
                      </Button>
                    </div>
                  )}

                  <div className="relative w-full -pb-4">
                    <Input
                      type="text"
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      className="pr-24 pl-12 py-6" // Add padding for icons
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 hover:bg-transparent"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="sr-only">Upload file</span>
                    </Button>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleImageUpload}
                      ref={fileInputRef}
                      className="hidden"
                      capture="environment"
                    />
                    <Button
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-custom-1 hover:bg-custom-1"
                      onClick={() => handleSend()}
                      disabled={isLoading || !input.trim()}
                    >
                      <ArrowUp className="h-4 w-4" />
                      <span className="sr-only">Send message</span>
                    </Button>
                  </div>
                  <div className="text-slate-500 text-xs w-full text-center font-normal leading-normal tracking-tight">
                    Bri can make mistakes. Check our Terms & Conditions.
                  </div>
                </CardFooter>
              </Card>
            )}
          </DialogContent>
        </Dialog>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-custom-3 rounded-lg">
            <div className="space-y-2">
              <h4 className="font-semibold">Kitchen Sink Leak</h4>
              <p className="text-sm text-muted-foreground">
                Submitted: 04/28/2023
              </p>
            </div>
            <Badge className="border border-black">In Progress</Badge>
          </div>
          <div className="flex justify-between items-center p-4 bg-custom-3 rounded-lg">
            <div className="space-y-2">
              <h4 className="font-semibold">Bedroom Window Stuck</h4>
              <p className="text-sm text-muted-foreground">
                Submitted: 04/15/2023
              </p>
            </div>
            <Badge variant="outline" className="border border-black">
              Completed
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenancePage;
