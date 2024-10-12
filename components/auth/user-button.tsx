"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CircleUserRound, LogOut, Wrench } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "@/components/auth/logout-button";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

type UserButtonProp = {
  setMenuOpen?: Dispatch<SetStateAction<boolean>>;
};

const UserButton = ({ setMenuOpen }: UserButtonProp) => {
  const router = useRouter();

  const user = useCurrentUser();

  // Close the menu if it is open
  const handleClick = () => {
    if (setMenuOpen) setMenuOpen(false);
  };

  return (
    <DropdownMenu onOpenChange={handleClick}>
      <DropdownMenuTrigger className="border-px outline-none">
        <Avatar className="relative">
          <AvatarImage src={user?.image || ""} alt="avatar" />
          <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
            <CircleUserRound className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-blue-400 border-px" align="end">
        <DropdownMenuItem className="font-semibold flex gap-2">
          <Avatar className="relative">
            <AvatarImage src={user?.image || ""} alt="avatar" />
            <AvatarFallback className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
              <CircleUserRound className="text-white" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 items-start">
            <span className="text-gray-700">{user?.name}</span>
            <span className="text-gray-500 text-xs truncate">
              {user?.email}
            </span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="font-semibold cursor-pointer"
          onClick={() => router.push("/settings")}
        >
          <Wrench className="w-4 h-4 mr-2" /> Manage Account
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem className="font-semibold cursor-pointer hover:text-white hover:bg-destructive">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
