"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CalendarDays,
  CheckCircle,
  Loader,
  TriangleAlert,
  X,
} from "lucide-react";
import { ReqInfo } from "../../../managers/maintenance/_components/maintenance-request-table";
import { Header } from "@/components/header";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useTransition } from "react";
import { pusherClient } from "@/lib/pusher";
import {
  ContractorSlotType,
  getNextAvailableDates,
  handleNotification,
} from "@/lib/helper";
import { z } from "zod";
import { getContractorInfo } from "@/data/request";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { SquareLoader } from "react-spinners";
import { updateTenantRequest } from "@/actions/request";

interface NotificationDrawerProp {
  viewDrawer: boolean;
  request: ReqInfo;
  address?: string;
  setViewDrawer: () => void;
}

const statusColors = {
  Progress: "bg-custom-1",
  Pending: "bg-[#374151]",
  Closed: "bg-custom-2",
  New: "bg-custom-7",
};

const FormSchema = z.object({
  contractorDate: z
    .string({
      required_error: "You need to select a date to schedule your maintenance.",
    })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});

export const NotificationDrawer = ({
  viewDrawer,
  request,
  setViewDrawer,
}: NotificationDrawerProp) => {
  const [drawerRequest, setDrawerRequest] = useState(request);
  const progressValue = drawerRequest.status === "Closed" ? 100 : 50;
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [drawerDialog, setDrawerDialog] = useState(false);
  const [contractorDates, setContractorDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      const selectedDate = new Date(data.contractorDate);
      const updatedResponse = await updateTenantRequest(
        drawerRequest.id,
        selectedDate
      );

      if (updatedResponse.error) {
        toast.error("Appointment Confirmation", {
          description: updatedResponse.error,
        });
      }

      if (updatedResponse.success) {
        setSuccess(true);
        toast.success("Appointment Confirmation", {
          description: updatedResponse.success,
        });
      }
    });
  };

  const handleDialog = () => {
    if (drawerDialog) {
      setDrawerDialog((prev) => !prev);
      setContractorDates([]);
      setSuccess(false);
      setSelectedDate(null);
      form.reset();
    } else {
      setDrawerDialog(true);
    }
  };

  const generateTimeSlots = async () => {
    if (drawerRequest && drawerRequest.contractor) {
      const data = await getContractorInfo(drawerRequest.contractor);

      const finalDates = getNextAvailableDates(data as ContractorSlotType, 4);

      setContractorDates(finalDates);

      setLoading(false);
    }
  };

  useEffect(() => {
    const subscribeToMaintenance = () => {
      pusherClient.subscribe("maintenance");

      pusherClient.bind("update", ({ data }: { data: ReqInfo }) => {
        if (data.id === drawerRequest.id) {
          setDrawerRequest(data);
        }

        handleNotification({
          title: "Updated Maintenance Request",
          body: "You have an update on a maintenance request",
          icon: "/logo.svg",
        });
      });
    };

    subscribeToMaintenance();

    return () => {
      pusherClient.unsubscribe("maintenance");
    };
  }, []);

  return (
    <>
      <Drawer open={viewDrawer} onOpenChange={setViewDrawer} direction="right">
        <DrawerContent className="top-0 mt-0 ml-[20%] rounded-t-none bg-custom-4">
          <DrawerHeader>
            <DrawerClose className="text-right">
              <Button size="icon" variant="ghost">
                <X className="text-custom-1 h-4 w-4" />
              </Button>
            </DrawerClose>

            <DrawerTitle>
              <Header title="Ticket Progress" />
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              This shows updates on a maintenance request.
            </DrawerDescription>
          </DrawerHeader>
          <div className="mx-4">
            <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="flex justify-between items-center font-nunito text-lg">
                  <span>{drawerRequest.issue}</span>
                  <Badge
                    variant={
                      drawerRequest.status === "New" ? "outline" : "default"
                    }
                    className={`${
                      statusColors[drawerRequest.status]
                    } flex justify-center items-center rounded-xl py-1`}
                  >
                    {drawerRequest.status === "Progress"
                      ? "In Progress"
                      : drawerRequest.status}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Ticket #{drawerRequest.id.slice(0, 3).toUpperCase()} - Created
                  on {format(new Date(drawerRequest.createdAt), "yyyy-MM-dd")}
                </CardDescription>
              </CardHeader>

              <CardContent className="my-8 flex flex-col space-y-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">Progress</Label>
                    <Label className="font-semibold">{progressValue}%</Label>
                  </div>
                  <Progress
                    value={progressValue}
                    className="h-6 bg-custom-3 [&>*]:bg-custom-2 [&>*]:rounded-full"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <Label className="font-semibold">Description</Label>
                  <div className="text-sm text-[#555555]">
                    {drawerRequest.issue}
                  </div>
                </div>

                <div className="flex flex-col space-y-2 mt-4">
                  <Label className="font-semibold mb-4">Updates</Label>
                  <div className="text-sm flex gap-2 items-start">
                    <CheckCircle className="w-4 h-4 text-custom-2" />
                    <div className="flex flex-col space-y-0.5">
                      <span>
                        {format(
                          new Date(drawerRequest.createdAt),
                          "yyyy-MM-dd"
                        )}
                      </span>
                      <span className="text-[#555555]">Ticket created</span>
                    </div>
                  </div>

                  {drawerRequest.contractor && (
                    <div className="text-sm flex gap-2 items-start">
                      <CalendarDays className="w-4 h-4 text-custom-8" />
                      {!drawerRequest.maintenanceDate ? (
                        <div className="w-full flex flex-col space-y-0.5">
                          <div className="w-full flex items-center justify-between space-y-0.5">
                            <span>
                              {format(
                                new Date(drawerRequest.createdAt),
                                "yyyy-MM-dd"
                              )}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="bg-custom-7 hover:bg-custom-7 rounded-full h-5"
                              onClick={() => {
                                handleDialog();
                                generateTimeSlots();
                              }}
                            >
                              Pick a date
                            </Button>
                          </div>
                          <span className="text-[#555555]">Ticket created</span>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-0.5">
                          <span>
                            {drawerRequest.scheduledDate
                              ? format(
                                  new Date(drawerRequest.scheduledDate),
                                  "yyyy-MM-dd"
                                )
                              : format(new Date(), "yyyy-MM-dd")}
                          </span>
                          <span className="text-[#555555]">
                            {drawerRequest.category} Specialist Scheduled On
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {drawerRequest.maintenanceDate && (
                    <div className="text-sm flex gap-2 items-start">
                      <TriangleAlert className="w-4 h-4 text-custom-7" />
                      <div className="flex flex-col space-y-0.5">
                        <span>
                          {format(
                            new Date(drawerRequest.maintenanceDate),
                            "yyyy-MM-dd"
                          )}
                        </span>
                        <span className="text-[#555555]">
                          {drawerRequest.category} Work Scheduled
                        </span>
                      </div>
                    </div>
                  )}

                  {drawerRequest.maintenanceDate &&
                    drawerRequest.maintenanceCompletedDate && (
                      <div className="text-sm flex gap-2 items-start">
                        <CheckCircle className="w-4 h-4 text-custom-2" />
                        <div className="flex flex-col space-y-0.5">
                          <span>
                            {format(
                              new Date(drawerRequest.maintenanceCompletedDate),
                              "yyyy-MM-dd"
                            )}
                          </span>
                          <span className="text-[#555555]">Ticket Closed</span>
                        </div>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </div>
        </DrawerContent>
      </Drawer>

      <Dialog open={drawerDialog} onOpenChange={handleDialog}>
        <DialogContent className="bg-custom-3 w-[90%] md:max-w-[525px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-left">
              Maintenance Appointment Options
            </DialogTitle>
            <DialogDescription className="text-left">
              Please select a preferred date and time for your maintenance
              appointment.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2">
            {loading && contractorDates.length === 0 ? (
              <div className="w-full flex items-center justify-center">
                <SquareLoader color="#003366" />
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="contractorDate"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="sr-only">
                          Select Maintenance Date
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(val) => {
                              field.onChange(val);
                              setSelectedDate(val);
                            }}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            {contractorDates.length > 0 &&
                              contractorDates.map((d, i) => (
                                <FormItem
                                  key={i}
                                  className="flex items-center space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <RadioGroupItem value={d.toISOString()} />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {format(d, "MMMM d, yyyy 'at' h:mm a")}
                                  </FormLabel>
                                </FormItem>
                              ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!success && (
                    <div className="w-full flex justify-end">
                      <Button
                        className="w-40 bg-custom-1 hover:bg-custom-1"
                        type="submit"
                        disabled={isPending}
                      >
                        {isPending ? (
                          <>
                            <Loader className="animate-spin w-4 h-4 mr-2" />
                            Confirming
                          </>
                        ) : (
                          <>Confirm Selection</>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            )}
            {success && selectedDate && (
              <div className="space-y-4 mt-8">
                <div className="flex font-semibold items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-custom-2" />
                  Appointment Confirmed
                </div>
                <div className="text-sm">
                  Your maintenance appointment has been confirmed for{" "}
                  {format(new Date(selectedDate), "yyyy-MM-dd h:mm a")}. The
                  property manager has been notified.
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
