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
import {Video} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function Navbar({authObj, handleExternalSubmit}) {
  return (
    <div className="flex w-full p-5 justify-between h-[10%]">
      <div className="text-2xl font-bold font-LeagueSpartan">
        <p>VideoCaster.</p>
      </div>

      <div className="flex gap-4">
        <div>
          <Button onClick={() => handleExternalSubmit()}>
            <Video className="mr-2 h-4 w-4" /> Publish
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-4">
            {authObj.farcasterSubject ? (
              <DropdownMenuLabel
                onClick={() => {
                  authObj.unlinkFarcaster(authObj.farcasterSubject);
                }}
                className="text-sm rounded-md cursor-pointer disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                disabled={!authObj.canRemoveAccount}
              >
                Unlink Farcaster
              </DropdownMenuLabel>
            ) : (
              <DropdownMenuLabel
                onClick={() => {
                  authObj.linkFarcaster();
                }}
                className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
              >
                Link Farcaster
              </DropdownMenuLabel>
            )}

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
