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
export default function Viewer() {
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

  const convertDate = async (utcTimestamp) => {
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

  const [getFrameUrl, setGetFrameUrl] = useState("");
  return (
    <>
      <div className="min-h-screen w-full px-4">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          {/* <DialogTrigger>Open</DialogTrigger> */}
          <DialogContent>
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

        <div className="justify-center flex p-4 flex-col items-center">
          <div className="h-[100px] w-full flex justify-between">
            <h1 className="text-2xl font-bold">Video caster</h1>
            <Button onClick={() => setDialogOpen((prev) => !prev)}>
              Create Cast
            </Button>
          </div>
          <div className="w-1/2">
            <Formik
              initialValues={{castUrl: ""}}
              onSubmit={(values) => {
                // console.log(values);

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
              <div className="h-[600px]">
                <Frame frameUrl={getFrameUrl} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-4">
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
                    <div className="rounded-lg p-6 h-full w-full">
                      <Frame frameUrl={item?.embeds[0]?.url} />
                      {/* <Frame frameUrl={"https://far-from-frames.vercel.app"} /> */}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
