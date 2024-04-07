"use client";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import Frame from "@/components/ui/Frame";
import {useExperimentalFarcasterSigner} from "@privy-io/react-auth";
import axios from "axios";
import {useEffect, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Textarea} from "@/components/ui/textarea";
import {Formik, Form, Field} from "formik";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Video, Clapperboard, Newspaper, Eye, Scan} from "lucide-react";
import {useFarcasterContext} from "../context/farcasterContext";
import {usePathname, useRouter} from "next/navigation";
import Navbar from "@/components/ui/Navbar";

function Test() {
  const [casts, setCasts] = useState([]);
  const {submitCast} = useExperimentalFarcasterSigner();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/casts", {
          params: {
            fid: "394606",
          },
        });

        // console.log(response.data.message.data.casts);
        setCasts(response.data.message.data.casts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const convertDate = (utcTimestamp) => {
    let date = new Date(utcTimestamp);
    let localDate = date.toLocaleString();
    return localDate;
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const addCastToFarcaster = async (values) => {
    try {
      const castBody = {
        text: values.castText,
        embeds: [
          {
            url: values.embedUrl,
          },
        ],
        embedsDeprecated: [],
        mentions: [],
        mentionsPositions: [],
        // parentUrl: parentUrl,
      };
      const {hash} = await submitCast(castBody);
      console.log(hash, "hash");
    } catch (err) {
      console.log(err);
    }
  };

  const {farcasterAccount} = useFarcasterContext();
  const pathname = usePathname();
  const path = pathname.split("/")[1];

  const [getFrameUrl, setGetFrameUrl] = useState("");
  const router = useRouter();
  return (
    <>
      <div className="min-h-screen w-full px-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {/* <DialogTrigger>Open</DialogTrigger> */}
          <DialogContent className="fixed left-1/2 z-50 grid w-full -translate-x-1/2 gap-4 rounded-b-lg border bg-background p-6 shadow-lg top-1/2 max-w-lg -translate-y-1/2 rounded-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:duration-400 data-[state=open]:duration-400 data-[state=closed]:slide-out-to-top-1/2 data-[state=open]:slide-in-from-top-1/2">
            <DialogHeader>
              <DialogTitle>Send Casts</DialogTitle>
              <DialogDescription className="h-fit">
                <Formik
                  initialValues={{castText: "", embedUrl: ""}}
                  onSubmit={(values) => {
                    // console.log(values);
                    addCastToFarcaster(values).then((err) => {
                      setDialogOpen(false);
                    });
                  }}
                >
                  {(formik) => (
                    <Form>
                      <div className="w-full p-4 flex flex-col space-y-3">
                        <Field
                          as={Input}
                          type="text"
                          name="castText"
                          placeholder="Cast Text"
                        />
                        <Field
                          as={Input}
                          type="text"
                          name="embedUrl"
                          placeholder="Embed URL"
                        />

                        <Button type="submit" style={{marginTop: "20px"}}>
                          Submit
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Navbar />
        <div className="w-full min-h-[90%] lg:min-h-full grid lg:grid-cols-5 grid-cols-1 gap-4 p-5 lg:p-0 lg:pr-5 pb-5 mt-4">
          <div className="hidden lg:block lg:w-full">
            <div
              className="lg:flex lg:flex-col lg:py-4 hidden rounded-lg bg-white lg:pt-5 border h-[89vh] sticky top-[8vh]"
              style={{alignSelf: "start"}}
            >
              {/* profile info */}
              <div className="z-0 w-[90%] h-[80px] border rounded-lg flex items-center just gap-3 pl-3 ml-3 hover:bg-gray-100 cursor-pointer">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={
                      farcasterAccount?.pfp || "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <p className="font-bold">{farcasterAccount?.displayName}</p>
                  <p className="text-sm font-normal">{`@${farcasterAccount?.username}`}</p>
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
                  className={`mt-5 flex items-center p-4 px-6 gap-4 mr-4 rounded-lg relative py-3 cursor-pointer`}
                  onClick={() => router.push("/client/mycasts")}
                >
                  <Clapperboard />
                  <p className="ml-2 text-md">My Casts</p>
                </div>
                <div
                  className={`flex items-center p-4 px-6 gap-4 mr-4 rounded-lg relative py-3 cursor-pointer`}
                  onClick={() => router.push("/client/feed")}
                >
                  <Newspaper />
                  <p className="ml-2 text-md">My Feed</p>
                </div>
                <div
                  className={`flex items-center px-6 gap-4 mr-4 rounded-lg relative ${
                    path === "editor" &&
                    "text-purple-900 font-semibold bg-gray-100"
                  } py-3 cursor-pointer`}
                  onClick={() => router.push("/editor")}
                >
                  {path === "editor" && (
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
                  {path === "viewer" && (
                    <div className="bg-purple-600 w-[5px] rounded-r-lg h-[80%] absolute left-0 top-1" />
                  )}

                  <Eye />
                  <p className="ml-2 text-md">Viewer</p>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="w-full min-h-[90%] lg:min-h-fit flex flex-col lg:flex-row justify-center gap-4 px-6 pb-6"> */}

          <div className="col-span-4">
            {/* <div className="flex flex-col gap-4">
              {casts.map((item, idx) => (
                <div
                  className="bg-white border-2 border-slate-500 h-[700px] w-[700px] rounded-lg p-10 flex flex-col"
                  key={idx}
                >
                  <div className=" flex items-center justify-start gap-3">
                    <div className="h-10 w-10">
                      <Avatar>
                        <AvatarImage src={item.author.pfp_url} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex flex-col items-start">
                      <h1 className="text-lg">{item.author.username}</h1>
                      <p className="text-sm text-black">
                        {convertDate(item.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="py-5">{item.content}</div>

                  <div className="pb-4 h-full w-full">
                    {item && item.embeds[0] && (
                      <div className="rounded-lg p-6 h-full w-full"> */}
            {/* <Frame frameUrl={item?.embeds[0]?.url} /> */}
            {/* <Frame frameUrl={"https://far-from-frames.vercel.app"} /> */}
            {/* </div>
                    )}
                  </div>
                </div>
              ))} */}

            <div className="w-full pb-10">
              <Formik
                initialValues={{castUrl: ""}}
                onSubmit={(values) => {
                  console.log(values);

                  setGetFrameUrl(values.castUrl);
                }}
              >
                {(formik) => (
                  <Form>
                    <div className="w-full p-4 flex space-x-5">
                      <Field
                        as={Input}
                        type="text"
                        name="castUrl"
                        placeholder="Cast URL"
                      />

                      <Button type="submit">Check</Button>
                    </div>
                  </Form>
                )}
              </Formik>

              {getFrameUrl !== "" && (
                <div className="w-1/2 m-auto">
                  <Frame frameUrl={getFrameUrl} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  );
}

export default Test;
