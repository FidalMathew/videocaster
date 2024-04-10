"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Pencil, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useExperimentalFarcasterSigner } from "@privy-io/react-auth";
import axios from "axios";
import Frame from "@/components/ui/Frame";
import { Field, Form, Formik } from "formik";
import { useFarcasterContext } from "@/app/context/farcasterContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Feed() {
  const [casts, setCasts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const formikRef = useRef(null);
  const { submitCast, likeCast } = useExperimentalFarcasterSigner();
  const { farcasterAccount } = useFarcasterContext();
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/casts");
        console.log(
          response,
          response.data.message.data.casts.slice(0, 40),
          "data"
        );
        // console.log(response.data.message.data.casts);
        setCasts(response.data.message.data.casts.slice(0, 40));
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

  const addCastToFarcaster = async (values) => {
    try {
      const castBody = {
        text: values.castText,
        embeds: values.embedUrl ? [
          {
            url: values.embedUrl,
          },
        ] : [],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
        // parentUrl: parentUrl,
      };

      console.log(castBody, "castBody");
      const { hash } = await submitCast(castBody);
      console.log(hash, "hash");
    } catch (err) {
      console.log(err);
      // const formikRef = useRef(null);
    }
  };
  const handleSubmit = () => {
    // Call submitForm() method on the Formik instance
    if (formikRef.current) {
      formikRef.current.handleSubmit();
      // console.log(formikRef.current);
    }
  };

  const handleCastContent = (text) => {
    console.log(text);
    const words = text.split(/\s+/);

    console.log(words, "Cast content");
    let cast = {
      castText: text,
    };

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word.startsWith("http://") || word.startsWith("https://")) {
        cast["embedUrl"] = word;
      }
    }

    console.log(cast);

    addCastToFarcaster(cast);
  };

  const [topFrames, setTopFrames] = useState([]);

  useEffect(() => {
    (async function () {
      // const response = await fetch(
      //   "https://graph.cast.k3l.io/frames/personalized/rankings/fids?agg=sumsquare&weights=L1C10R5&k=2&limit=100",
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       accept: "application/json",
      //     },
      //     body: JSON.stringify([farcasterAccount?.fid]), // Pass array of fid here
      //   }
      // );
      try {
        const response = await axios.get("/api/getTopFrames");

        setTopFrames(response.data);
      } catch (error) {
        console.log(error.message, "error from karma");
      }
    })();
  }, []);

  console.log(farcasterAccount, "account please");

  const likeCastAction = async (castId) => {
    const { hash: likeMessageHash } = await likeCast({
      castHash: castId,
      castAuthorFid: farcasterAccount.fid,
    });

    console.log(likeMessageHash, "like message hash");
  };

  console.log(casts[0], "first cast");

  const router = useRouter();

  return (
    <>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-0 top-[28vh]">
          <DialogHeader className={""}>
            <DialogTitle className="px-4 py-4"></DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <Formik
              innerRef={formikRef}
              initialValues={{ castText: "" }}
              onSubmit={(actions, values) => {
                console.log(actions, "value ");
                handleCastContent(actions.castText);
              }}
            >
              {(formik) => (
                <Form>
                  <div className="px-5 pt-1 w-full h-full">
                    <div className="h-full w-full flex gap-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <Field
                        as={Textarea}
                        className="border-none outline-none focus-visible:ring-0 focus:placeholder-slate-700 text-md placeholder-slate-300 resize-none"
                        placeholder="Start typing your text here"
                        name="castText"
                        id="castText"
                        rows={4}
                      />
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogDescription>

          <DialogFooter className={"py-2 pr-2 border-t"}>
            <Button
              size="sm"
              className="bg-purple-700 hover:bg-purple-800"
              onClick={handleSubmit}
            >
              Casts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
        <div className="fixed bottom-5 right-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="sm"
                  className="rounded-full h-12 w-12"
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
        </div>

        {console.log(casts, "casts")}
        <div className="h-full flex flex-col space-y-5 w-full mt-4">
          {casts.map((item, idx) => (
            <Card
              key={idx}
              className="cursor-pointer"
              onClick={() => router.push(`/client/cast/${item.hash}`)}
            >
              {console.log(item, "casts from component")}
              <CardHeader className="p-0">
                <CardTitle className="text-md px-5 pt-5 pb-2 flex gap-3 items-center">
                  <Avatar className="">
                    <AvatarImage src={item.author.pfp_url} className="" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col">
                    <Link
                      href={`/client/${item.fid}`}
                    // className="cursor-pointer"
                    >
                      <p className="font-bold">
                        {item.author.display_name}{" "}
                        <span className="font-normal text-sm">
                          @{item.author.username}
                        </span>
                      </p>
                    </Link>
                    <p className="text-xs font-normal">
                      {convertDate(item.timestamp)}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 h-fit">
                <p className="mb-5">{item.content}</p>
                {/* <div className="w-full border-2 h-[100px] rounded-md"> */}
                {/* {item.embeds.length > 0 && item.embeds[0].url && (
                  <>
                    <Frame frameUrl={item.embeds[0].url} />
                  </>
                )} */}
                {item.embeds.length > 0 && item.embeds[0].url && (
                  <>
                    {item.embeds[0].url &&
                      item.embeds[0].url.match(/\.(jpeg|jpg|gif|png)$/) !==
                      null && (
                        <img
                          src={item.embeds[0].url}
                          alt="img"
                          className="w-1/2 m-auto"
                        />
                      )}
                    <Frame frameUrl={item.embeds[0].url} />
                  </>
                )}
                {/* </div> */}
              </CardContent>
              {/* <CardFooter className="flex w-full gap-3">
                <div>
                  <Heart
                    onClick={() => likeCastAction(item.hash)}
                    className="cursor-pointer"
                  />
                </div>
              </CardFooter> */}
            </Card>
          ))}

          {!casts && (
            <div className="w-full h-full flex justify-center items-center">
              <p className="text-lg">No Casts Found</p>
            </div>
          )}
        </div>
      </div>
      <div className="hidden w-auto col-span-1 lg:flex lg:justify-center h-[70vh] sticky top-[10vh]">
        <div className="border bg-white w-full rounded-lg">
          <div className="border-b p-4">
            <h1 className="font-semibold">Top Follows</h1>
          </div>
          {topFrames.length > 0 &&
            topFrames.map((item, idx) => (
              <>
                {/* <p>id: {item.fid}</p>
                <p>name: {item.fname}</p>
                <p>username: {item.username}</p>
                <img
                  src={item.pfp_url}
                  alt={`img_${index}`}
                  className="aspect-square h-10 rounded-full"
                /> */}

                <Card key={idx} className="border-none shadow-none">
                  <CardHeader className="p-0">
                    <CardTitle className="text-md px-5 pt-5 pb-2 flex gap-3 items-center">
                      <Avatar className="">
                        <AvatarImage src={item.pfp_url} className="" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <Link
                          href={`/client/${item.fid}`}
                        // className="cursor-pointer"
                        >
                          <p className="font-bold">{item.display_name} </p>
                        </Link>
                        <p className="font-normal text-sm">@{item.username}</p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className=""></CardContent>
                  {/* <CardFooter>
                <p>Card Footer</p>
              </CardFooter> */}
                  {idx !== topFrames.length - 1 && <hr />}
                </Card>
              </>
            ))}
        </div>
      </div>
    </>
  );
}
