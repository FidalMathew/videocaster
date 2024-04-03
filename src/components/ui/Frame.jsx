"use client";
import React, {useEffect, useState} from "react";
import {scrapeMetaData} from "@/utils/scrape";
import axios from "axios";
import {Button} from "./button";
import {SquareArrowOutUpRight} from "lucide-react";
function Frame({frameUrl}) {
  const [responseFrames, setResponseFrames] = useState(null);
  const [mainURL, setMainURL] = useState("");
  // useEffect(() => {
  //   const getData = async () => {
  //     const url = frameUrl;
  //     let res = await scrapeMetaData(url);
  //     console.log(res.metaTags, "ress");
  //     setRes(res);
  //   };
  //   getData();
  // }, []);

  useEffect(() => {
    (async function () {
      const res = await axios.post("/api/scrape", {
        framesUrl: frameUrl,
      });
      console.log(res, "data.video");
      setResponseFrames(res.data);

      // console.log(data, "res");
    })();

    const urlString = frameUrl;
    const url = new URL(urlString);
    const mainUrl = `${url.protocol}//${url.host}`;

    setMainURL(mainUrl);
  }, [frameUrl]);

  // console.log(frameUrl, "res");

  return (
    <div className="h-full w-full flex flex-col gap-5">
      <iframe
        className="h-[70%] w-full rounded-lg"
        src={
          responseFrames?.video ||
          responseFrames?.image ||
          responseFrames?.fallbackImage ||
          `https://lvpr.tv?v=01faw9p23up7bwwe`
        }
        // src={responseFrames.video}
        // src={
        //   "https://ipfs.decentralized-content.com/ipfs/bafybeifs7vasy5zbmnpixt7tb6efi35kcrmpoz53d3vg5pwjz52q7fl6pq/cook.png"
        // }
        allowfullscreen
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        frameborder="0"
      />
      <p>{mainURL}</p>

      <div className="grid grid-cols-2 gap-4 h-[30%] w-full">
        {responseFrames &&
          responseFrames.buttonProperties &&
          responseFrames.buttonProperties.map((buttonItem, index) => (
            <Button
              key={index}
              className="col-span-1"
              // variant="outline"
            >
              {(buttonItem.action === "link" ||
                buttonItem.action === "post_redirect") && (
                <SquareArrowOutUpRight className="h-3 w-3" />
              )}
              <span
                className={
                  (buttonItem.action === "link" ||
                    buttonItem.action === "post_redirect") &&
                  "ml-2"
                }
              >
                {buttonItem && buttonItem.buttonContent}
              </span>
            </Button>
          ))}
      </div>
    </div>
  );
}

export default Frame;
