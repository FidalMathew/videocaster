"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Navbar from "@/components/ui/Navbar";
import {Clapperboard, Newspaper} from "lucide-react";
import {usePathname} from "next/navigation";
import {useRouter} from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {useEffect, useState} from "react";

export default function ClientLayout({children}) {
  const pathname = usePathname();
  console.log(pathname.split("/client"));
  const path = pathname.split("/client")[1].split("/")[1];
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Navbar />
      <div className="relative flex bg-muted/40 pt-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="sm"
                className="rounded-full h-12 w-12 fixed bottom-5 right-5"
                onClick={() => setModalOpen(true)}
              >
                <Pencil className="h-7 w-7" />
                {/* <span className="ml-2 text-sm">Create Cast</span> */}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="mr-10">
              <p>Create Cast</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div
          className="grid lg:grid-cols-5 grid-cols-1 h-full w-full pr-4 items-start"
          // style={{alignSelf: "start"}}
        >
          <div
            className="lg:flex lg:flex-col lg:py-4 hidden rounded-lg bg-white lg:pt-5 border h-[89vh] sticky top-[10vh]"
            style={{alignSelf: "start"}}
          >
            {/* profile info */}
            <div className="z-0 w-[90%] h-[80px] border rounded-lg flex items-center just gap-3 pl-3 ml-3">
              <Avatar className="">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="font-bold">Farcaster Id</p>
                <p className="text-sm font-normal">@farcasterid</p>
              </div>
            </div>
            <div className="w-full h-full flex flex-col gap-2">
              {/* <div
                className={`flex items-center rounded-r-lg relative ${
                  path === "mycasts" &&
                  "text-green-900 font-semibold bg-gray-100"
                } py-3 mt-4 px-6 gap-4 cursor-pointer`}
                onClick={() => router.push("/client/mycasts")}
              >
                {path === "mycasts" && (
                  <div className="bg-green-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-2" />
                )}

                <Clapperboard />
                <p className="ml-2 text-md">My Casts</p>
              </div> */}

              <div
                className={`mt-5 flex items-center p-4 px-6 gap-4 mx-4 rounded-lg relative ${
                  path === "mycasts" &&
                  "text-green-900 font-semibold bg-gray-100"
                } py-3 cursor-pointer`}
                onClick={() => router.push("/client/mycasts")}
              >
                {path === "mycasts" && (
                  <div className="bg-green-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-1" />
                )}

                <Clapperboard />
                <p className="ml-2 text-md">My Casts</p>
              </div>
              <div
                className={`flex items-center p-4 px-6 gap-4 mx-4 rounded-lg relative ${
                  path === "feed" && "text-green-900 font-semibold bg-gray-100"
                } py-3 cursor-pointer`}
                onClick={() => router.push("/client/feed")}
              >
                {path === "feed" && (
                  <div className="bg-green-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-1" />
                )}

                <Newspaper />
                <p className="ml-2 text-md">My Feed</p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
