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
import {Clapperboard, Newspaper, PanelLeft, Eye} from "lucide-react";
import Link from "next/link";
import {useFarcasterContext} from "@/app/context/farcasterContext";

export default function Navbar({setOpenPublishModal}) {
  const router = useRouter();
  const pathname = usePathname();
  // console.log(pathname.split("/")[1] === "feed", "pathname");

  const {
    farcasterAccount,
    ready,
    authenticated,
    farcasterSubject,
    linkFarcaster,
    unlinkFarcaster,
    canRemoveAccount,
    logout,
    exportWallet,
  } = useFarcasterContext();

  return (
    <>
      <div className="flex w-full p-5 justify-between h-[8vh] items-center bg-transparent border-b bg-white sticky top-0 z-[100] backdrop-filter backdrop-blur-sm">
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

              <div className="z-0 w-[90%] h-[80px] border rounded-lg flex items-center text-sm gap-3 pl-3 hover:bg-gray-100 cursor-pointer">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={farcasterAccount?.pfp || ".png"} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <p className="font-bold">{farcasterAccount?.displayName}</p>
                  <p className="text-xs font-normal">{`@${farcasterAccount?.username}`}</p>
                </div>
              </div>
              <Link
                href={`/client/${farcasterAccount?.fid}`}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <Newspaper className="h-5 w-5" />
                My Casts
              </Link>

              {/* 
              
              <div
                className={`mt-5 flex items-center p-4 px-6 gap-4 mr-4 rounded-lg relative ${
                  path === farcasterAccount?.fid.toString() &&
                  "text-purple-900 font-semibold bg-gray-100"
                } py-3 cursor-pointer`}
                onClick={() => router.push(`/client/${farcasterAccount?.fid}`)}
              >
                {path === farcasterAccount?.fid.toString() && (
                  <div className="bg-purple-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-1" />
                )}

                <Clapperboard />
                <p className="ml-2 text-md">My Casts</p>
              </div>
              
              */}

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
              <Link
                href="/editor"
                className="flex items-center gap-4 px-2 text-muted-foreground hover:text-foreground"
              >
                <Eye />
                Viewer
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="text-xl font-bold font-LeagueSpartan">
          <p>VideoCaster.</p>
        </div>
        {/* <div className="absolute bottom-5 right-5"></div> */}
        <div className="flex items-center space-x-6">
          {ready && authenticated && (
            <div className="flex gap-4 items-center">
              {pathname.split("/")[1] === "editor" && (
                <div>
                  <Button
                    size="sm"
                    onClick={() => setOpenPublishModal((prev) => !prev)}
                  >
                    <Video className="mr-2 h-4 w-4" /> Publish
                  </Button>
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage src={farcasterAccount?.pfp} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-4 z-[1000]">
                  {/* {farcasterSubject ? (
                    <DropdownMenuLabel
                      onClick={() => {
                        unlinkFarcaster(farcasterSubject);
                      }}
                      className="text-sm rounded-md cursor-pointer disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                      disabled={!canRemoveAccount}
                    >
                      Unlink Farcaster
                    </DropdownMenuLabel>
                  ) : (
                    <DropdownMenuLabel
                      onClick={() => {
                        linkFarcaster();
                      }}
                      className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                    >
                      Link Farcaster
                    </DropdownMenuLabel>
                  )} */}

                  <DropdownMenuLabel
                    onClick={() => {
                      exportWallet();
                    }}
                    className="text-sm rounded-md cursor-pointer disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  >
                    Export Wallet
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuLabel
                    onClick={logout}
                    className="cursor-pointer text-red-400"
                  >
                    Logout
                  </DropdownMenuLabel>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
        {/* <Button onClick={exportWallet}>Export Wallet</Button> */}
      </div>
    </>
  );
}
