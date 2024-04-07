"use client";
import React, {useEffect, useState} from "react";
import {scrapeMetaData} from "@/utils/scrape";
import axios from "axios";
import {Button} from "./button";
import {SquareArrowOutUpRight} from "lucide-react";
function Frame({frameUrl}) {
  const [responseFrames, setResponseFrames] = useState(null);
  const [mainURL, setMainURL] = useState("");

  console.log("framee ", frameUrl);

  const postFrame = async (post_url) => {
    console.log("post frame", post_url);

    try {
      const res = await axios.post("/api/postFrame", {
        framesUrl: post_url,
      });
      console.log(res.data, "res");
      setResponseFrames(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const postRedirectFrame = (redirect_url) => {
    console.log("post redirect frame");
    try {
      const res = axios.post("/api/scrape", {
        framesUrl: post_url,
      });
      console.log(res.data, "res");

      // using something redirect to the url
    } catch (error) {
      console.log(error);
    }
  };

  const linkFrame = (link_url) => {
    console.log("link frame");
    try {
      // warning before leaving the page
      window.open(link_url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    (async function () {
      const res = await axios.post("/api/scrape", {
        framesUrl: frameUrl,
      });
      console.log(res.data, "data.video");
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
    <div className="h-fit w-full flex flex-col gap-5">
      <iframe
        className="aspect-video w-full rounded-lg my-5"
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
        // frameborder="0"
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
              onClick={() => {
                console.log("buttonItem", buttonItem);
                if (buttonItem.action === "link") {
                  linkFrame(buttonItem.url);
                } else if (buttonItem.action === "post") {
                  postFrame(responseFrames.metaTags["fc:frame:post_url"]);
                } else if (buttonItem.action === "post_redirect") {
                  postRedirectFrame(buttonItem.url);
                } else {
                  postFrame(responseFrames.metaTags["fc:frame:post_url"]);
                }
              }}
            >
              {(buttonItem.action === "link" ||
                buttonItem.action === "post_redirect") && (
                <SquareArrowOutUpRight className="h-3 w-3" />
              )}
              <span
              // className={
              //   (buttonItem.action === "link" ||
              //     buttonItem.action === "post_redirect") &&
              //   "ml-2"
              // }
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
