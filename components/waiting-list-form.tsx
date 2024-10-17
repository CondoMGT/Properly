"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ArrowUpRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WaitingListSchema } from "@/schemas";
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
import { newClient } from "@/actions/new-client";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type WaitingListFormProps = {
  inNav?: boolean;
};

export const WaitingListForm = ({ inNav = false }: WaitingListFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const form = useForm<z.infer<typeof WaitingListSchema>>({
    resolver: zodResolver(WaitingListSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleDialogClose = () => {
    if (isOpen) {
      setIsOpen(false);
      setSubmitError("");
      setSubmitMessage("");
      form.reset();
    } else {
      setIsOpen(true);
    }
  };

  const onSubmit = async (values: z.infer<typeof WaitingListSchema>) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      const response = await newClient(values);

      if (response.error) {
        setSubmitError(response?.error);
        setSubmitMessage("");
      }

      if (response.success) {
        setSubmitMessage(response?.success);
        setSubmitError("");

        form.reset();

        // Close the modal after a delay
        setTimeout(() => {
          setIsOpen(false);
          setSubmitMessage("");
        }, 3000);
      }

      setIsSubmitting(false);
    } catch (error) {
      setSubmitError("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button className="p-6 bg-custom-1 rounded-full justify-center items-center gap-2.5 flex">
          <div className="text-white text-sm md:text-lg font-normal font-kumbh">
            Become a Tester
          </div>
          {!inNav && (
            <div className="flex p-2 bg-custom-2 rounded-[60px] justify-start items-center gap-2.5">
              <div className="w-6 h-6 justify-center items-center flex">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-sm font-extrabold font-kyiv leading-7">
            Be among the first to test Properly
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-tight tracking-tight">
            Enter your email to get your exclusive testing access.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid space-y-4"
          >
            <div className="gap-4">
              <FormField
                control={form.control}
                name="userType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Are you a...?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Tenant" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Resident
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="Manager" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Property Manager
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        {...field}
                        placeholder="jane@example.com"
                        disabled={isSubmitting}
                        className="placeholder:text-[#e0e0e0] placeholder:text-base py-4"
                      />
                    </FormControl>
                    <FormDescription className="text-xs font-bold leading-none tracking-tight text-[#555555]">
                      Property Managers get two months free licensing when the
                      platform successfully launches!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-custom-1 hover:bg-custom-2 font-semibold w-32"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
            {submitMessage && (
              <p className="text-sm text-green-600 text-center bg-custom-3 py-1 rounded-md">
                {submitMessage}
              </p>
            )}

            {submitError && (
              <p className="text-sm text-red-600 text-center bg-custom-3 py-1 rounded-md">
                {submitError}
              </p>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
