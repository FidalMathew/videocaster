"use client";

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
import {Input} from "@/components/ui/input";
import {ScrollArea} from "@/components/ui/scroll-area";

export default function Feed() {
  return (
    <>
      <div className="flex flex-col gap-5 w-auto lg:col-span-3 pt-0 relative mx-4">
        {/* <Card className="h-[20vh] mb-1 z-10 rounded-lg sticky top-[10vh]">
          <CardHeader className="p-0">
            <CardTitle className="text-md border-b px-3 py-3">
              Post Something
            </CardTitle>
          </CardHeader>
          <CardContent
            className="pt-3 grid grid-cols-2 items-center gap-4"
            style={{
              gridTemplateColumns: "auto 1fr auto",
            }}
          >
            <Avatar className="">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="col-span-2 w-full">
              <Input
                placeholder="What's on your mind?"
                className="rounded-full w-full"
              />
            </div>
            
          </CardContent>
          
        </Card> */}

        {/*  */}
        <div className="h-full flex flex-col space-y-5 w-full">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Card>
              <CardHeader className="p-0">
                <CardTitle className="text-md px-5 py-5 flex gap-3 items-center">
                  <Avatar className="">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      className=""
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <p className="font-bold">Shad</p>
                    <p className="text-sm font-normal">5 minutes ago</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <div className="w-full border-2 h-[100px] rounded-md">
                  {" "}
                  frame here
                </div>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="hidden w-auto col-span-1 lg:flex lg:justify-center h-[70vh] sticky top-[10vh]">
        <div className="border bg-white w-full rounded-lg">
          <div className="border-b p-4">
            <h1 className="font-semibold">Recent Video Frames</h1>
          </div>
        </div>
      </div>
    </>
  );
}
