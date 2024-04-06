"use client";

import {useEffect, useRef, useState} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {Pencil} from "lucide-react";
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
import {Textarea} from "@/components/ui/textarea";
import {Field, Form, Formik} from "formik";
import {useFarcasterContext} from "@/app/context/farcasterContext";

export default function Feed() {
  const [modalOpen, setModalOpen] = useState(false);

  const formikRef = useRef(null);

  const handleSubmit = () => {
    // Call submitForm() method on the Formik instance
    if (formikRef.current) {
      formikRef.current.handleSubmit();
      // console.log(formikRef.current);
    }
  };

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
              initialValues={{castText: ""}}
              onSubmit={(actions, values) => console.log(actions)}
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
                  {/* <Button
                    size="sm"
                    className="bg-purple-700 hover:bg-purple-800"
                    type="submit"
                  >
                    Casts
                  </Button> */}
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
                    <p className="font-bold">
                      Shad <span className="font-normal text-sm">@shad</span>
                    </p>
                    <p className="text-xs font-normal">5 minutes ago</p>
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
