"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Navbar from "@/components/ui/Navbar";
import {Clapperboard, Newspaper, Scan} from "lucide-react";
import {usePathname} from "next/navigation";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {usePrivy} from "@privy-io/react-auth";
import {useFarcasterContext} from "../context/farcasterContext";

export default function ClientLayout({children}) {
  const pathname = usePathname();
  console.log(pathname.split("/client"));
  const path = pathname.split("/client")[1].split("/")[1];
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const {farcasterAccount} = useFarcasterContext();

  const {ready, authenticated, user} = usePrivy();
  console.log(user, "user");
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [router, ready, authenticated]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <Navbar />
      <div className="relative flex bg-muted/40 pt-3">
        <div
          className="grid lg:grid-cols-5 grid-cols-1 h-full w-full pr-4 items-start"
          // style={{alignSelf: "start"}}
        >
          <div className="lg:flex lg:flex-col lg:py-4 hidden rounded-lg bg-white lg:pt-5 border h-[89vh] sticky top-[10vh]">
            {/* profile info */}
            <div className="z-0 w-[90%] h-[80px] border rounded-lg flex items-center just gap-3 pl-3 ml-3 hover:bg-gray-100 cursor-pointer">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={farcasterAccount?.pfp || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="font-bold">{farcasterAccount?.displayName}</p>
                <p className="text-xs font-normal">{`@${farcasterAccount?.username}`}</p>
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
                className={`mt-5 flex items-center p-4 px-6 gap-4 mr-4 rounded-lg relative ${
                  path === "mycasts" &&
                  "text-purple-900 font-semibold bg-gray-100"
                } py-3 cursor-pointer`}
                onClick={() => router.push("/client/mycasts")}
              >
                {path === "mycasts" && (
                  <div className="bg-purple-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-1" />
                )}

                <Clapperboard />
                <p className="ml-2 text-md">My Casts</p>
              </div>

              <div
                className={`flex items-center p-4 px-6 gap-4 mr-4 rounded-lg relative ${
                  path === "feed" && "text-purple-900 font-semibold bg-gray-100"
                } py-3 cursor-pointer`}
                onClick={() => router.push("/client/feed")}
              >
                {path === "feed" && (
                  <div className="bg-purple-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-1" />
                )}

                <Newspaper />
                <p className="ml-2 text-md">My Feed</p>
              </div>
              <div
                className={`flex items-center px-6 gap-4 mr-4 rounded-lg relative ${
                  path.split("client/")[1] === "editor" &&
                  "text-purple-900 font-semibold bg-gray-100"
                } py-3 cursor-pointer`}
                onClick={() => router.push("/editor")}
              >
                {path.split("client/")[1] === "editor" && (
                  <div className="bg-purple-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-1" />
                )}

                <Scan />
                <p className="ml-2 text-md">Frames Editor</p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
