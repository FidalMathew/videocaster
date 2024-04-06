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
import {usePathname, useRouter} from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {Clapperboard, Newspaper, PanelLeft} from "lucide-react";
import Link from "next/link";

export default function Navbar({authObj, setOpenPublishModal}) {
  const router = useRouter();
  const pathname = usePathname();
  // console.log(pathname.split("/")[1] === "feed", "pathname");

  return (
    <>
      <div className="flex w-full p-5 justify-between h-[8vh] items-center bg-transparent border-b bg-white sticky top-0 z-[100]">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden block">
            <Button variant="outline">
              <PanelLeft className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="z-[10000]" side={"left"}>
            <nav className="grid gap-6 text-lg font-medium">
              <div className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                <Clapperboard className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">Acme Inc</span>
              </div>
              <Link
                href="/client/mycasts"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Newspaper className="h-5 w-5" />
                My Casts
              </Link>
              <Link
                href="/client/feed"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Newspaper className="h-5 w-5" />
                Feed
              </Link>
              <Link
                href="/editor"
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Clapperboard className="h-5 w-5" />
                Editor
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="text-xl font-bold font-LeagueSpartan">
          <p>VideoCaster.</p>
        </div>
        {/* <div className="absolute bottom-5 right-5"></div> */}
        <div className="flex items-center space-x-6">
          {authObj && (
            <div className="flex gap-4 items-center">
              <div>
                <Button
                  size="sm"
                  onClick={() => setOpenPublishModal((prev) => !prev)}
                >
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
                <DropdownMenuContent className="mr-4 z-[1000]">
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
          )}
        </div>
      </div>
    </>
  );
}
