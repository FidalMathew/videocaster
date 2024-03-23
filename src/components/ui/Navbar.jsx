"use client";

import {Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function Navbar({authObj}) {
  return (
    <div className="flex w-full p-5 justify-between">
      <div>
        <p>Video Caster</p>
      </div>

      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            <DropdownMenuLabel
              onClick={() => authObj.requestFarcasterSigner()}
              className="cursor-pointer"
              disabled
            >
              hello
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel
              onClick={authObj.logout}
              className="cursor-pointer text-red-400"
            >
              Logout
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
