<<<<<<< Updated upstream
"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Viewer() {

  const [casts, setCasts] = useState([]);

=======
"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
// import { fetchCasts } from "@/utils/fetchfeed";
import axios from "axios";
import {useEffect} from "react";

export default function Viewer() {
>>>>>>> Stashed changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/casts", {
          params: {
            fid: "394606",
          },
        });

        console.log(response.data.message.data.casts);
        setCasts(response.data.message.data.casts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const convertDate = async (utcTimestamp) => {
    let date = new Date(utcTimestamp);
    let localDate = date.toLocaleString();
    return localDate;
  }
  return (
    <div className="min-h-screen w-full bg-red-400 justify-center flex p-4">
      <div className="flex flex-col gap-4">
        {casts.map((item, idx) => (
          <div
            className="bg-white h-[400px] w-[700px] rounded-lg p-10"
            key={idx}
          >
            <div className="h-[10%] flex mb-10 ju   stify-start gap-3 items-center">
              <div className="h-10 w-10">
                <Avatar>
                  <AvatarImage src={item.author.pfp_url} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col items-start">
                <h1 className="text-lg">{item.author.username}</h1>
                <p className="text-sm text-black">{convertDate(item.timestamp)}</p>
              </div>
            </div>
            <div className="pb-4">
              {/* <video
                src="/test_video.mp4"
                controls
                className="object-cover w-full h-full rounded-lg"
              /> */}
              <div className="bg-pink-200 w-full h-full">{item.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
