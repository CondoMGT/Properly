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
import { Label } from "@/components/ui/label";
import { ArrowUpRight } from "lucide-react";

type WaitingListFormProps = {
  inNav?: boolean;
};

export const WaitingListForm = ({ inNav = false }: WaitingListFormProps) => {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Here you would typically send the email to your backend
    console.log("Email submitted:", email);

    setIsSubmitting(false);
    setSubmitMessage("Thank you for joining our waiting list!");
    setEmail("");

    // Close the modal after a delay
    setTimeout(() => {
      setIsOpen(false);
      setSubmitMessage("");
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="p-6 bg-[#003366] rounded-full justify-center items-center gap-2.5 flex">
          <div className="text-white text-sm md:text-lg font-normal font-kumbh">
            Join the waiting list
          </div>
          {!inNav && (
            <div className="flex p-2 bg-[#008080] rounded-[60px] justify-start items-center gap-2.5">
              <div className="w-6 h-6 justify-center items-center flex">
                <ArrowUpRight className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Our Waiting List</DialogTitle>
          <DialogDescription>
            Enter your email to be notified when we launch.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
          {submitMessage && (
            <p className="text-sm text-green-600 text-center">
              {submitMessage}
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
