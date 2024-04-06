"use client";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {usePrivy, useExperimentalFarcasterSigner} from "@privy-io/react-auth";
import Navbar from "@/components/ui/Navbar";
import {Button} from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Formik, Field, Form, FieldArray, useFormikContext} from "formik";
import Dropzone from "react-dropzone";
import axios from "axios";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
  Clapperboard,
  Newspaper,
  Scan,
  SquareArrowOutUpRight,
} from "lucide-react";
import {usePathname} from "next/navigation";
import {Switch} from "@/components/ui/switch";
import * as tus from "tus-js-client";
import {Progress} from "@/components/ui/progress";
import {File, CircleCheck} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {ArrowLeftIcon, ReloadIcon} from "@radix-ui/react-icons";
import {useFarcasterContext} from "../context/farcasterContext";

export default function DashboardPage() {
  const router = useRouter();
  const pathname = usePathname();
  const path = pathname.split("/")[1];

  // media states
  const [toggleMedia, setToggleMedia] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [playbackId, setPlaybackId] = useState("");

  const {
    farcasterAccount,
    hasEmbeddedWallet,
    farcasterSubject,
    requestFarcasterSigner,
    submitCast,
    isAuthenticated,
    canRemoveAccount,
    linkFarcaster,
    unlinkFarcaster,
    exportWallet,
    logout,
    ready,
    authenticated,
    user,
  } = useFarcasterContext();

  // formik
  const [formikState, setFormikState] = useState({});
  const ExternalStateSyncComponent = () => {
    const formik = useFormikContext();
    useEffect(() => {
      setFormikState(formik.values);
    }, [formik.values]);

    return null;
  };
  // formik ref
  const formikRef = useRef(null);

  const handleExternalSubmit = () => {
    if (formikRef.current) {
      formikRef.current.handleSubmit();
    }
  };

  const handleInputFieldChange = (e) => {
    const {value} = e.target;
    setFormikState((prevState) => ({
      ...prevState,
      inputFieldUrl: value, // Update inputFieldUrl state with the new value
    }));
  };

  const publishFrame = async (values) => {
    values = {...values, uname: farcasterAccount.username};
    // console.log(values, "values");
    try {
      const response = await axios.post("/api/publishFrames", values);
      console.log("Response:", response.data);
      alert(
        "Frame published successfully! Check it out: https://no-code-frames.vercel.app/examples/" +
          values.nameOfFrameURL +
          "-" +
          farcasterAccount.username
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // livepeer
  const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;
  const createAsset = async (file) => {
    const assetData = {
      name: file.name,
    };

    const url = "https://livepeer.studio/api/asset/request-upload";

    axios
      .post(url, assetData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data, "data"); // Handle the response data here

        let res = response.data;
        let tusEndpoint = res.tusEndpoint;

        const upload = new tus.Upload(file, {
          endpoint: tusEndpoint, // tus endpoint which you get from the API response
          chunkSize: 100 * 1024 * 1024, // 1KB
          onError: (error) => {
            console.log("Failed because: " + error);
            setUploadStatus("error");
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            console.log(bytesUploaded, bytesTotal, percentage + "%");
            setProgress(parseInt(percentage));
            setUploadStatus("uploading");
          },
          onSuccess: () => {
            // checkProgress(res.object?.asset.id);
            console.log("Upload finished: " + upload);
            setUploadStatus("success");
            setPlaybackId(response.data.asset.playbackId);
          },
        });

        upload.start();
        setUploadStatus("upload_started");
        console.log("upload started");
      })
      .catch((error) => {
        console.error("There was a problem with the request:", error);
      });
  };

  // pinata
  const [currentFile, setCurrentFile] = useState(null);
  const [openPublishModal, setOpenPublishModal] = useState(false);

  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const pinFileToIPFS = async (image) => {
    const form = new FormData();
    form.append("file", image);
    form.append(
      "pinataMetadata",
      JSON.stringify({
        name: "test",
      })
    );
    form.append(
      "pinataOptions",
      JSON.stringify({
        cidVersion: 1,
      })
    );

    const options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
      },
      body: form,
    };

    setFileUploadLoading(true);
    try {
      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        options
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const jsonData = await response.json();
      console.log(jsonData, "jsonData");
      setImageUrl(`https://gateway.pinata.cloud/ipfs/${jsonData.IpfsHash}`);
    } catch (error) {
      console.log(error.message);
    } finally {
      setFileUploadLoading(false);
    }
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  const handleStepForm = async () => {
    setLoading(true);
    try {
      await delay(2000);
      setCurrentStep(1);
      setLoading(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  console.log(ready, authenticated, "ready");

  return (
    <>
      <Dialog
        open={openPublishModal}
        onOpenChange={() => {
          setOpenPublishModal(false);
          setCurrentStep(0);
        }}
      >
        {/* <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger> */}
        {currentStep === 0 ? (
          <DialogContent className="h-[500px] duration-200 ease-in-out transition-all">
            <DialogHeader>
              {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
              <DialogDescription className="pt-10">
                this is the inital modal
              </DialogDescription>
              <DialogFooter>
                {loading ? (
                  <Button disabled variant={"outline"} className="w-full">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button
                    variant={"outline"}
                    className="w-full"
                    onClick={handleStepForm}
                  >
                    Continue
                  </Button>
                )}
              </DialogFooter>
            </DialogHeader>
          </DialogContent>
        ) : (
          <DialogContent className="h-[500px] duration-200 ease-in-out transition-all">
            <div
              className="absolute left-5 top-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer"
              onClick={() => setCurrentStep(0)}
            >
              <ArrowLeftIcon />
            </div>
            <DialogHeader>
              {/* <DialogTitle>Are you absolutely sure?</DialogTitle> */}
              <DialogDescription className="pt-10">
                this is the modal content after certain contain from state 2 is
                loaded
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
      <div>
        <main className="w-full h-full">
          {ready && authenticated ? (
            <div className="h-full w-full">
              <Navbar setOpenPublishModal={setOpenPublishModal} />

              {/* <Button onClick={createAsset}>Create</Button> */}

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
                            farcasterAccount?.pfp ||
                            "https://github.com/shadcn.png"
                          }
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <p className="font-bold">
                          {farcasterAccount?.displayName}
                        </p>
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
                    </div>
                  </div>
                </div>
                {/* <div className="w-full min-h-[90%] lg:min-h-fit flex flex-col lg:flex-row justify-center gap-4 px-6 pb-6"> */}
                <fieldset className="h-fit w-auto bg-white rounded-lg p-5 border-2 lg:col-span-2 lg:mb-7">
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Settings
                  </legend>
                  <Formik
                    innerRef={formikRef}
                    initialValues={{
                      video: "",
                      nameOfFrameURL: "",
                      fallbackimage: "",
                      noOfButtons: 0,
                      playbackId: "",
                      buttonProperties: [],
                      // onchange,
                    }}
                    onSubmit={(value, _) => {
                      // publishFrame(value);
                      // console.log(value);
                    }}
                  >
                    {(formik) => (
                      <Form className="flex flex-col gap-8 mb-6">
                        <ExternalStateSyncComponent />
                        <Dropzone
                          accept="video/*"
                          onDrop={(acceptedFiles) => {
                            // console.log(acceptedFiles[0], "acceptedFiles");
                            setCurrentFile(acceptedFiles[0]);
                            createAsset(acceptedFiles[0]);
                          }}
                        >
                          {({getRootProps, getInputProps, acceptedFiles}) => (
                            <section className="cursor-pointer">
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                {console.log(
                                  acceptedFiles[0]?.name,
                                  "acceptedFiles"
                                )}
                                <div className="border-2 border-dotted flex justify-center items-center h-[200px] w-full rounded-lg border-slate-400">
                                  {uploadStatus === "success" &&
                                    (currentFile || acceptedFiles[0]) && (
                                      <div className="flex flex-col w-full justify-center items-center gap-4">
                                        <File />
                                        <p className="text-xs font-semibold text-center">
                                          {acceptedFiles[0]
                                            ? acceptedFiles[0]?.name
                                            : currentFile != null
                                            ? currentFile.name
                                            : "file.mp4"}
                                        </p>
                                        <div className="flex gap-3 items-center font-semibold">
                                          <CircleCheck className="text-green-600" />
                                          <p className="text-sm text-green-600">
                                            Upload Successful
                                          </p>
                                        </div>
                                      </div>
                                    )}
                                  {/* {
                                   : uploadStatus === "uploading" ? (
                                    <div className="flex flex-col gap-2 w-full items-center">
                                      <p>{progress}</p>
                                      <Progress
                                        value={progress}
                                        className="w-[60%] h-1 rounded-2xl"
                                      />
                                      <p>uploading in progress</p>
                                    </div>
                                  ) : (
                                    uploadStatus === "error" && (
                                      <div>
                                        <p className="text-red-500 text-xs">
                                          Error Occured
                                        </p>
                                      </div>
                                    )
                                  )) 
                                  } */}

                                  {uploadStatus === "uploading" && (
                                    <div className="flex flex-col gap-2 w-full items-center justify-center">
                                      <File />
                                      {acceptedFiles &&
                                      acceptedFiles.length > 0 ? (
                                        <p className="text-xs">
                                          {
                                            acceptedFiles[0].name // Accessing the name of the first file in the array
                                          }
                                        </p>
                                      ) : (
                                        <p className="text-xs">file.mp4</p>
                                      )}
                                      <div className="w-full flex gap-3 justify-center items-center">
                                        <Progress
                                          value={progress}
                                          className="w-[60%] h-1 rounded-2xl"
                                        />
                                        <p className="text-xs">{progress} %</p>
                                      </div>
                                    </div>
                                  )}
                                  {uploadStatus === "error" && (
                                    <div>
                                      <p className="text-red-500 text-xs">
                                        Error Occured
                                      </p>
                                    </div>
                                  )}

                                  {/* bug:  */}
                                  {uploadStatus === "idle" && (
                                    <p>Drag and drop your video here</p>
                                  )}
                                  {uploadStatus === "upload_started" && (
                                    <div className="flex flex-col gap-2 w-full items-center">
                                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                      <p className="text-sm">Upload Started</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </section>
                          )}
                        </Dropzone>
                        <div className="grid w-full max-w-full items-center gap-1.5">
                          <Label
                            htmlFor={`nameOfFrameURL`}
                            className="ml-1 mb-2"
                          >
                            Name of Frame URL
                          </Label>
                          <Field
                            as={Input}
                            type="text"
                            id={`nameOfFrameURL`}
                            name={`nameOfFrameURL`}
                            className="w-full"
                            placeholder="Name of Frame URL"
                          />
                        </div>

                        <div className="grid w-full max-w-full items-center gap-1.5">
                          <Label htmlFor={`playbackId`} className="ml-1 mb-2">
                            Livepeer Playback ID
                          </Label>
                          <div className="flex gap-2 items-center">
                            <Field
                              as={Input}
                              type="text"
                              disabled={playbackId !== ""}
                              id={`playbackId`}
                              name={`playbackId`}
                              className="w-full"
                              placeholder={
                                playbackId
                                  ? playbackId.toString()
                                  : "Livepeer Playback ID"
                              }
                            />
                            {playbackId !== "" &&
                              uploadStatus === "success" && (
                                <Link
                                  href={`https://lvpr.tv?v=${playbackId}`}
                                  target="_blank"
                                  className="aspect-square border rounded h-10 grid place-items-center text-gray-500"
                                >
                                  <SquareArrowOutUpRight />
                                </Link>
                              )}
                          </div>
                        </div>

                        <Select
                          className="w-full"
                          onValueChange={(val) => {
                            formik.setFieldValue("noOfButtons", val);
                            // push the button properties to the formik values
                            const newButtonProperties = Array.from(
                              {length: val},
                              (_, index) => ({
                                action: "",
                                buttonContent: "",
                                target: "",
                              })
                            );

                            formik.setFieldValue(
                              "buttonProperties",
                              newButtonProperties
                            );
                          }}
                        >
                          <SelectTrigger className="w-full focus-visible:ring-0">
                            <SelectValue placeholder="Select number of buttons" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                          </SelectContent>
                        </Select>
                        {formikState.noOfButtons > 0 && (
                          <div className="flex flex-col gap-5">
                            {Array.from(
                              {length: formik.values.noOfButtons},
                              (_, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col gap-1"
                                >
                                  <Label
                                    htmlFor={`buttonContent-${index}`}
                                    className="ml-1 mb-1"
                                  >
                                    Button Content {index + 1}
                                  </Label>
                                  <div className="flex gap-3">
                                    {/* for each button render select */}
                                    <Select
                                      onValueChange={(val) => {
                                        formik.setFieldValue(
                                          `buttonProperties[${index}].action`,
                                          val
                                        );
                                      }}
                                    >
                                      <SelectTrigger className="w-[180px] focus-visible:ring-0">
                                        <SelectValue placeholder="Select Action" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="post">
                                          Post
                                        </SelectItem>
                                        <SelectItem value="link">
                                          Link
                                        </SelectItem>
                                        <SelectItem value="post_redirect">
                                          Post Redirect
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>

                                    <Field
                                      as={Input}
                                      type="text"
                                      id={`buttonProperties[${index}].buttonContent`}
                                      name={`buttonProperties[${index}].buttonContent`}
                                      className="w-full"
                                      placeholder="Button Title"
                                    />

                                    <Field
                                      as={Input}
                                      type="text"
                                      id={`buttonProperties[${index}].target`}
                                      name={`buttonProperties[${index}].target`}
                                      className="w-full"
                                      placeholder="Target URL"
                                    />
                                  </div>
                                  {/* You can add more input fields for other button properties */}
                                </div>
                              )
                            )}
                          </div>
                        )}
                        <div className="grid w-full max-w-full items-center gap-1.5">
                          <Label htmlFor="fallbackimage" className="ml-2 mb-2">
                            Fallback Image Link
                          </Label>
                          {/* <Field
                          as={Input}
                          name="fallbackimage"
                          id="fallbackimage"
                          type="file"
                        /> */}
                          <div className="flex gap-2 items-center">
                            <Field
                              as={Input}
                              type="file"
                              name="fallbackimage"
                              id="fallbackimage"
                              className="w-full"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                pinFileToIPFS(file);
                              }}
                            />
                            {imageUrl && fileUploadLoading === false ? (
                              <Link
                                href={imageUrl}
                                target="_blank"
                                className="aspect-square border rounded h-10 grid place-items-center text-gray-500"
                              >
                                <SquareArrowOutUpRight className="h-5 w-5" />
                              </Link>
                            ) : (
                              fileUploadLoading === true && (
                                <div className="aspect-square border rounded h-10 grid place-items-center text-gray-500">
                                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                </div>
                              )
                            )}
                            {imageUrl && fileUploadLoading === false && (
                              <CircleCheck className="text-green-600" />
                            )}
                          </div>
                        </div>
                        {/* <Button className="w-full" type="submit">
                        Publish
                      </Button> */}
                      </Form>
                    )}
                  </Formik>
                </fieldset>

                <fieldset className="h-[600px] lg:h-[660px] w-auto flex flex-col gap-3 items-center rounded-lg border-2 p-3 lg:col-span-2 sticky top-[8vh]">
                  <div className="absolute bottom-2 right-3">
                    <div className="flex gap-2 items-center">
                      <span className="text-xs">Powered By</span>
                      <img
                        src="/livepeer.png"
                        className="h-5 w-5"
                        alt="livepeer"
                      />
                    </div>
                  </div>
                  <legend className="-ml-1 px-1 text-sm font-medium">
                    Output
                  </legend>
                  <div className="flex justify-end w-full">
                    <Badge variant="" className="">
                      Video Frames
                    </Badge>
                  </div>
                  <div className="h-fit w-full rounded-lg p-5 flex flex-col gap-6 border">
                    <div className="flex gap-2 items-center">
                      <Switch
                        // className="w-10 h-5"
                        checked={toggleMedia}
                        onCheckedChange={setToggleMedia}
                      />
                      <span className="text-sm">
                        {toggleMedia ? "Video" : "Image"}
                      </span>
                    </div>
                    <div
                      className="w-full h-[300px] rounded-lg flex justify-center items-center"
                      key={playbackId}
                    >
                      {/* Your Video here */}
                      {console.log(playbackId, "pid")}
                      {playbackId === "" && toggleMedia === true && (
                        <div className="w-full h-[300px] bg-slate-100 rounded-lg flex justify-center items-center">
                          Your Video here
                        </div>
                      )}
                      {toggleMedia === true && playbackId !== "" && (
                        <iframe
                          key={playbackId}
                          className="w-full h-full rounded-lg"
                          src={`https://lvpr.tv?v=${playbackId}`}
                          frameborder="0"
                        ></iframe>
                      )}

                      {toggleMedia === false && imageUrl !== "" && (
                        <img
                          key={imageUrl}
                          src={imageUrl}
                          alt="Preview Image"
                          style={{maxWidth: "100%", maxHeight: "300px"}}
                        />
                      )}

                      {toggleMedia === false && imageUrl === "" && (
                        <div className="w-full h-[300px] bg-slate-100 rounded-lg flex justify-center items-center">
                          Your Image here
                        </div>
                      )}
                    </div>
                    {formikState.noOfButtons > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {Array.from(
                          {length: formikState.noOfButtons},
                          (_, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              className="col-span-1"
                              // variant="outline"
                            >
                              {formikState.buttonProperties[index]
                                .buttonContent === ""
                                ? `Button ${index + 1}`
                                : formikState.buttonProperties[index]
                                    .buttonContent}
                            </Button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </fieldset>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </>
  );
}
