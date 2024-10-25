import { FormSuccessErrorProp } from "@/lib/types";
import { TriangleAlert } from "lucide-react";

export const FormError = ({
  message,
  forPage = false,
}: FormSuccessErrorProp) => {
  if (!message) return null;
  return (
    <div
      className={`${
        forPage ? "bg-gray-300" : "bg-destructive/15"
      } p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive col-span-4`}
    >
      <p className="flex items-center justify-center w-full">
        <TriangleAlert className="h-4 w-4 mr-2" />
        {message}
      </p>
    </div>
  );
};
