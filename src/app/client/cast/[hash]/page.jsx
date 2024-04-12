"use client";

import axios from "axios";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import Frame from "@/components/ui/Frame";

export default function SharePage({params}) {
  const pathname = usePathname();
  const [castsData, setCastsData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("/api/getSpecificCasts", {
          hash: params.hash,
        });
        console.log(response.data, "data");
        setCastsData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [pathname]);

  const convertDate = (utcTimestamp) => {
    let date = new Date(utcTimestamp);
    let localDate = date.toLocaleString();
    return localDate;
  };

  const router = useRouter();

  return (
    <div className="h-full flex flex-col space-y-5 w-full mt-4 relative mb-7 col-span-3 ml-4">
      {castsData && castsData.author && (
        <Card>
          {console.log(castsData, "castsData")}
          <CardHeader className="p-0">
            <CardTitle className="text-md px-5 py-5 flex gap-3 items-center">
              <Avatar
                className="cursor-pointer"
                onClick={() => router.push(`/client/${castsData.author.fid}`)}
              >
                <AvatarImage src={castsData.author.pfp_url} className="" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex flex-col">
                <p className="font-bold">
                  {castsData.author.display_name}{" "}
                  <span className="font-normal text-sm">
                    @{castsData.author.username}
                  </span>
                </p>

                <p className="text-xs font-normal">
                  {convertDate(castsData.timestamp)}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 h-fit">
            <p className="mb-3">{castsData.content}</p>
            {castsData.embeds.length > 0 && castsData.embeds[0].url && (
              <>
                {castsData.embeds[0].url &&
                  castsData.embeds[0].url.match(/\.(jpeg|jpg|gif|png)$/) !==
                    null && (
                    <img
                      src={castsData.embeds[0].url}
                      alt="img"
                      className="w-1/2 m-auto"
                    />
                  )}
                <Frame frameUrl={castsData.embeds[0].url} />
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/*

{
    "fid": 242641,
    "hash": "0x64ff256e5dbe1abe8ff03b0a1fabd84f093d23d4",
    "short_hash": "0x64ff256e",
    "thread_hash": "0x4fe146d8b127725b0137fca7fe09a55d077b48f4",
    "parent_hash": "0x4fe146d8b127725b0137fca7fe09a55d077b48f4",
    "parent_url": null,
    "root_parent_url": null,
    "parent_author": {
        "uid": 440197,
        "fid": 440199,
        "custody_address": "0xc01347b9387f3f661dd312f5f5ecd7aa5d5ab5c7",
        "recovery_address": "0x00000000fcb080a4d6c39a9354da9eb9bc104cd7",
        "following_count": 269,
        "follower_count": 125,
        "verifications": [
            "0x1aceea3e132de09031bcc242b00be1e0e6a14251"
        ],
        "bio": "I’m a satisfied nurse and a crypto lover",
        "display_name": "Yemity ",
        "pfp_url": "https://i.imgur.com/sSewyjZ.jpg",
        "username": "yemity"
    },
    "author": {
        "uid": 242641,
        "fid": 242641,
        "custody_address": "0xf8788929136da789fded81e4d65272a364398eee",
        "recovery_address": "0x00000000fcb080a4d6c39a9354da9eb9bc104cd7",
        "following_count": 452,
        "follower_count": 372,
        "verifications": [
            "0xacd2acb55cfbda29d771e0f2a99f4fdf50f67a3c",
            "0xf633a289a0912efed84f3af9fa7c5d26e7396a320d118995b9fdfd31f7e77777"
        ],
        "bio": "Fun to be with",
        "display_name": "MICHAEL 🎩",
        "pfp_url": "https://i.imgur.com/lcpQrih.jpg",
        "username": "bishopmyk"
    },
    "content": "Keep moving\n52 $Degen",
    "timestamp": "2024-04-05T20:11:04Z",
    "embeds": [],
    "mentions": [],
    "mentionPositions": [],
    "reactions": {},
    "replies": {
        "count": 1
    },
    "mentioned_profiles": []
}

*/
