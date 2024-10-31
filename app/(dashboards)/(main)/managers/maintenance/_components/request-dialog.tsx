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
import { ReqInfo } from "./maintenance-request-table";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Save } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import AITroubleshootingPreview from "@/components/ai-preview/ai-troubleshooting";
import { useEffect, useState, useTransition } from "react";
import { getPropertyContractors } from "@/data/request";
import { updateRequest } from "@/actions/request";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RequestDialogProp {
  viewDialog: boolean;
  request: ReqInfo;
  address: string;
  canSubmit?: boolean;
  setViewDialog: () => void;
}

const FormSchema = z.object({
  priority: z.enum(["Low", "Medium", "High"], {
    required_error: "Please select an priority.",
  }),
  status: z.enum(["Progress", "Closed", "New", "Pending"], {
    required_error: "Please select an status.",
  }),
  category: z.string({
    required_error: "Please select an category for the issue.",
  }),
  contractor: z.string({
    required_error: "Please assign a contractor.",
  }),
});

type ContractorProp = {
  id: string;
  name: string;
  category: string;
};

export const RequestDialog = ({
  viewDialog,
  request,
  address,
  canSubmit = true,
  setViewDialog,
}: RequestDialogProp) => {
  const router = useRouter();

  const [category, setCategory] = useState<string[]>([]);
  const [contractor, setContractor] = useState<ContractorProp[]>([]);
  const [availableContractors, setAvailableContractors] = useState<
    ContractorProp[]
  >([]);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    request?.category
  );

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      priority: request?.priority || "",
      category: request?.category || "",
      status: request?.status || "",
      contractor: request?.contractor || "",
    },
  });

  useEffect(() => {
    form.reset({
      priority: request?.priority || "",
      category: request?.category || "",
      status: request?.status || "",
      contractor: request?.contractor || "",
    });
  }, [request, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      const req = await updateRequest(request?.id, data);
      try {
        if (req.error) {
          toast.error(req.error || "Something went wrong!");
        }

        if (req.success) {
          toast.success(req.success);
          setTimeout(() => {
            setViewDialog();
          }, 300);
        }
      } catch {
        toast.error("Something went wrong!");
      }
    });

    router.push("/managers/maintenance");
  };

  useEffect(() => {
    if (selectedCategory) {
      const filtered = contractor.filter(
        (c) => c.category === selectedCategory
      );

      setAvailableContractors(filtered);
    } else {
      setAvailableContractors(contractor);
    }
  }, [selectedCategory]);

  useEffect(() => {
    const fetchContractInfo = async () => {
      const data = await getPropertyContractors(request?.propertyId);

      const dataCategory = Array.from(
        new Set(data?.map((d) => d.contractor.specialty))
      );
      const dataContractor = data?.map((d) => {
        return {
          name: d.contractor.name,
          id: d.contractor.id,
          category: d.contractor.specialty,
        };
      });

      setCategory(dataCategory);
      setContractor(dataContractor as ContractorProp[]);
      setAvailableContractors(dataContractor as ContractorProp[]);
    };

    fetchContractInfo();
  }, [request?.propertyId]);

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
                  {request?.id.slice(0, 3).toUpperCase()}
                </span>
              </div>
              <div className="col-span-3 flex flex-col">
                <span className="text-sm font-semibold leading-[34px] tracking-tight">
                  Issue
                </span>
                <span className="text-sm font-normal leading-7 tracking-tight">
                  {request?.issue}
                </span>
              </div>
            </div>
            <div className="col-span-1 grid grid-cols-4 items-center gap-4">
              <div className="col-span-3 flex flex-col">
                <span className="text-sm font-semibold leading-[34px] tracking-tight">
                  Tenant Name
                </span>
                <span className="text-sm font-normal leading-7 tracking-tight">
                  {request?.user?.name}
                </span>
              </div>
              <div className="col-span-3 flex flex-col">
                <span className="text-sm font-semibold leading-[34px] tracking-tight">
                  Property
                </span>
                <span className="text-sm font-normal leading-7 tracking-tight">
                  {address}, Unit {request?.user?.tenant?.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-[34px] tracking-tight">
              Description
            </span>
            <span className="text-sm font-normal leading-7 tracking-tight">
              {request?.description}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-[34px] tracking-tight">
              AI attempt
            </span>
            <div className="">
              <AITroubleshootingPreview
                title="AI Troubleshooting Attempt"
                subtitle="The tenant used AI to attempt to resolve the issue before submitting this ?"
                suggestion={{
                  avatar: "/ellipse.svg",
                  name: "Bri's Summary",
                  message: request?.summary,
                  time: request?.createdAt,
                }}
              />
            </div>
          </div>
        </ScrollArea>

        <span className="text-sm font-semibold leading-[34px] tracking-tight">
          Manage Ticket
        </span>
        <DialogFooter>
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
                        disabled={isPending}
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
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedCategory(value);
                        }}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {category &&
                            category.map((c, index) => (
                              <SelectItem key={index} value={c}>
                                {c}
                              </SelectItem>
                            ))}
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
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="New">New</SelectItem>
                          <SelectItem value="Progress">In Progress</SelectItem>
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
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Contractor</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Contractor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableContractors &&
                              availableContractors.length > 0 &&
                              availableContractors.map((c) => (
                                <SelectItem
                                  key={`contractor-${c.id}`}
                                  value={c.id}
                                >
                                  {c.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              {canSubmit && (
                <>
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
                      className="w-40 bg-custom-1 hover:bg-custom-1"
                      type="submit"
                    >
                      {isPending ? (
                        <>
                          <Loader className="animate-spin w-4 h-4 mr-2" />
                          Updating Ticket
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Update Ticket
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
