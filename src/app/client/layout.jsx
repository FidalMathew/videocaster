"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Navbar from "@/components/ui/Navbar";
import {Clapperboard, Newspaper} from "lucide-react";
import {usePathname} from "next/navigation";
import {useRouter} from "next/navigation";

export default function ClientLayout({children}) {
  const pathname = usePathname();
  console.log(pathname.split("/client"));
  const path = pathname.split("/client")[1].split("/")[1];
  const router = useRouter();
  return (
    <div className="bg-muted/40 relative h-[90vh]">
      <Navbar />
      <div className="grid lg:grid-cols-5 grid-cols-1 h-full w-full">
        <div className="lg:flex lg:flex-col lg:py-4 hidden rounded-lg bg-white lg:pt-5 border h-[80vh]">
          {/* profile info */}
          <div className="w-[90%] h-[80px] border rounded-lg flex items-center just gap-3 pl-3 ml-3">
            <Avatar className="">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <p className="font-bold">Farcaster Id</p>
              <p className="text-sm font-normal">@farcasterid</p>
            </div>
          </div>
          <div className="w-full h-full flex flex-col gap-4">
            <div
              className={`flex items-center rounded-r-lg relative ${
                path === "mycasts" && "text-green-900 font-semibold bg-gray-100"
              } p-4 mt-4 px-6 gap-4 cursor-pointer`}
              onClick={() => router.push("/client/mycasts")}
            >
              {path === "mycasts" && (
                <div className="bg-green-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-2" />
              )}

              <Clapperboard />
              <p className="ml-2 text-md">My Casts</p>
            </div>
            <div
              className={`flex items-center p-4 px-6 gap-4 relative ${
                path === "feed" && "text-green-900 font-semibold bg-gray-100"
              } py-5 cursor-pointer`}
              onClick={() => router.push("/client/feed")}
            >
              {path === "feed" && (
                <div className="bg-green-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-2" />
              )}

              <Newspaper />
              <p className="ml-2 text-md">My Feed</p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
