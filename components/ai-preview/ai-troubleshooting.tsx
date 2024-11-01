"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CheckCheck, ImageIcon } from "lucide-react";
import { format } from "date-fns";

interface AITroubleshootingProps {
  title: string;
  subtitle: string;
  suggestion: {
    avatar: string;
    name: string;
    message: string;
    time: Date;
  };
}

export default function AITroubleshootingPreview({
  title,
  subtitle,
  suggestion,
}: AITroubleshootingProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card
        className="cursor-pointer h-[150px]"
        onClick={() => setIsOpen(true)}
      >
        <CardHeader className="opacity-50">
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center -mt-6">
          <ImageIcon className="h-8 w-8 text-custom-2 mb-2" />
          <p className="text-xs font-semibold">Click to preview</p>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[90%] md:max-w-[525px] rounded-lg">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {subtitle}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col items-start space-y-2">
              <div className="flex space-x-4 items-center">
                <Avatar>
                  <AvatarImage src={suggestion.avatar} alt={suggestion.name} />
                  <AvatarFallback>{suggestion.name[0]}</AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold leading-none">
                  {suggestion.name}:
                </p>
              </div>
              <div className="space-y-1 border p-2 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  {suggestion.message}
                </p>
                <div className="flex items-center justify-end text-custom-2 space-x-1">
                  <p className="text-xs">
                    {format(new Date(suggestion.time), "MMM dd, yyyy, HH:mm")}
                  </p>
                  <CheckCheck className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
