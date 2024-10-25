"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Request } from "./maintenance-request-table";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AITroubleshootingPreview from "@/components/ai-preview/ai-troubleshooting";

interface RequestDialogProp {
  viewDialog: boolean;
  request: Request;
  setViewDialog: () => void;
}

const FormSchema = z.object({
  priority: z.enum(["Low", "Medium", "High"], {
    required_error: "Please select an priority.",
  }),
  status: z.enum(["In Progress", "Pending", "Closed", "New"], {
    required_error: "Please select an status.",
  }),
  category: z.string({
    required_error: "Please select an category for the issue.",
  }),
  contractor: z.string({
    required_error: "Please assign a contractor.",
  }),
});

export const RequestDialog = ({
  viewDialog,
  request,
  setViewDialog,
}: RequestDialogProp) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      priority: request.priority || "",
      category: "",
      status: request.status || "",
      contractor: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <Dialog open={viewDialog} onOpenChange={setViewDialog}>
      <DialogContent className="w-[90%] md:max-w-[525px] h-fit rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-left">
            New Maintenance Request
          </DialogTitle>
          <DialogDescription className="text-left">
            View, manage and assign a contractor to this issue.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-1 grid grid-cols-4 items-center gap-4">
              <div className="col-span-3 flex flex-col">
                <span className="text-sm font-semibold leading-[34px] tracking-tight">
                  Request ID
                </span>
                <span className="text-sm font-normal leading-7 tracking-tight">
                  {request.id}
                </span>
              </div>
              <div className="col-span-3 flex flex-col">
                <span className="text-sm font-semibold leading-[34px] tracking-tight">
                  Issue
                </span>
                <span className="text-sm font-normal leading-7 tracking-tight">
                  {request.issue}
                </span>
              </div>
            </div>
            <div className="col-span-1 grid grid-cols-4 items-center gap-4">
              <div className="col-span-3 flex flex-col">
                <span className="text-sm font-semibold leading-[34px] tracking-tight">
                  Tenant Name
                </span>
                <span className="text-sm font-normal leading-7 tracking-tight">
                  Sarah S.
                </span>
              </div>
              <div className="col-span-3 flex flex-col">
                <span className="text-sm font-semibold leading-[34px] tracking-tight">
                  Property
                </span>
                <span className="text-sm font-normal leading-7 tracking-tight">
                  {request.property}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-[34px] tracking-tight">
              Description
            </span>
            <span className="text-sm font-normal leading-7 tracking-tight">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-[34px] tracking-tight">
              AI attempt
            </span>
            <div className="">
              <AITroubleshootingPreview
                title="AI Troubleshooting Attempt"
                subtitle="The tenant used AI to attempt to resolve the issue before submitting this request."
                suggestion={{
                  avatar: "/ellipse.svg",
                  name: "Bri's Summary",
                  message:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis eius sit possimus laboriosam id tempora corporis labore, cupiditate quae facere fugiat delectus non earum, dignissimos a. Velit tempora possimus sunt.",
                  time: "11:25",
                }}
              />
            </div>
          </div>
        </ScrollArea>

        <span className="text-sm font-semibold leading-[34px] tracking-tight">
          Manage Ticket
        </span>
        <DialogFooter>
          {/* <ScrollArea className="h-[300px]"> */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="m@example.com">
                            m@example.com
                          </SelectItem>
                          <SelectItem value="m@google.com">
                            m@google.com
                          </SelectItem>
                          <SelectItem value="m@support.com">
                            m@support.com
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contractor</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Contractor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="m@example.com">
                            m@example.com
                          </SelectItem>
                          <SelectItem value="m@google.com">
                            m@google.com
                          </SelectItem>
                          <SelectItem value="m@support.com">
                            m@support.com
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />

              <div className="flex items-center justify-between">
                <Button
                  className="bg-transparent hover:bg-transparent text-primary border border-custom-2"
                  type="button"
                  onClick={setViewDialog}
                >
                  Cancel
                </Button>
                <Button
                  className="w-36 bg-custom-1 hover:bg-custom-1"
                  type="submit"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Ticket
                </Button>
              </div>
            </form>
          </Form>
          {/* </ScrollArea> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
