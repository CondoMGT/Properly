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
import { useState } from "react";
import { File, FileUp, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_VIDEO_TYPES,
  MaintenanceSchema,
} from "@/schemas";

const MaintenancePage = () => {
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<z.infer<typeof MaintenanceSchema>>({
    resolver: zodResolver(MaintenanceSchema),
    defaultValues: {
      title: "",
      description: "",
      media: [],
    },
  });

  const onSubmit = (values: z.infer<typeof MaintenanceSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
          <DialogContent className="w-[90%] md:w-full rounded-xl">
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
                className="space-y-8 px-4"
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
                          rows={6}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <div className="flex justify-center">
                  <Button
                    className="bg-custom-1 hover:bg-custom-1 hover:font-bold text-secondary font-nunito font-semibold w-1/2"
                    type="submit"
                  >
                    Ask Bri
                  </Button>
                </div>
              </form>
            </Form>
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
