"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchCasts } from "@/utils/fetchfeed";
import axios from 'axios';
import { useEffect } from 'react';

export default function Viewer() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/casts', {
          params: {
            fid: '394606'
          }
        });

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();


  }, []);

  return (
    <div className="min-h-screen w-full bg-red-400 justify-center flex p-4">
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            className="bg-white h-[400px] w-[700px] rounded-lg p-10"
            key={item}
          >
            <div className="h-[10%] flex mb-10 ju   stify-start gap-3 items-center">
              <div className="h-10 w-10">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex flex-col items-start">
                <h1 className="text-lg">Shad</h1>
                <p className="text-sm text-black">2 hours ago</p>
              </div>
            </div>
            <div className="pb-4">
              {/* <video
                src="/test_video.mp4"
                controls
                className="object-cover w-full h-full rounded-lg"
              /> */}
              <div className="bg-pink-200 w-full h-full">text</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
