"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Navbar from "@/components/ui/Navbar";
import {Clapperboard, Newspaper, Scan, Eye} from "lucide-react";
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
  const [topFrames, setTopFrames] = useState([]);

  const {farcasterAccount} = useFarcasterContext();

  const {ready, authenticated, user} = usePrivy();
  console.log(user, "user");
  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }

    // (async function () {
    //   try {
    //     const response = await axios.get("/api/getTopFrames");
    //     console.log(response, "fucku response");
    //     setTopFrames(response.data);
    //   } catch (error) {
    //     console.log(error.message, "error from karma");
    //   }
    // })();
  }, [router, ready, authenticated]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <Navbar />

      <div className="relative flex bg-muted/40">
        <div
          className="grid lg:grid-cols-5 grid-cols-1 h-full w-full pr-4 items-start"
          // style={{alignSelf: "start"}}
        >
          <div className="lg:flex lg:flex-col lg:py-4 hidden rounded-lg bg-white lg:pt-5 border h-[89vh] sticky top-[10vh] mt-2 ml-2">
            {/* profile info */}
            <div className="z-0 w-[90%] h-[80px] border rounded-lg flex items-center just gap-3 pl-3 ml-3 hover:bg-gray-100 cursor-pointer">
              <Avatar className="h-12 w-12">
                <AvatarImage src={farcasterAccount?.pfp || ".png"} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="font-bold">{farcasterAccount?.displayName}</p>
                <p className="text-xs font-normal">{`@${farcasterAccount?.username}`}</p>
              </div>
            </div>
            <div className="w-full h-full flex flex-col gap-2">
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
                <p className="ml-2 text-md">Feed</p>
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
              <div
                className={`flex items-center px-6 gap-4 mr-4 rounded-lg relative ${
                  path === "viewer" &&
                  "text-purple-900 font-semibold bg-gray-100"
                } py-3 cursor-pointer`}
                onClick={() => router.push("/viewer")}
              >
                {path.split("client/")[1] === "editor" && (
                  <div className="bg-purple-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-1" />
                )}

                <Eye />
                <p className="ml-2 text-md">Viewer</p>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}
