"use client";
import {useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";
import {usePrivy, useExperimentalFarcasterSigner} from "@privy-io/react-auth";
import Head from "next/head";
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
import {Checkbox} from "@/components/ui/checkbox";
import {Formik, Field, Form, FieldArray, useFormikContext} from "formik";
import Dropzone from "react-dropzone";
import {Livepeer} from "livepeer";
import axios from "axios";
import {Badge} from "@/components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Clapperboard, Newspaper, Scan} from "lucide-react";
import {usePathname} from "next/navigation";
import {Switch} from "@/components/ui/switch";
import * as tus from "tus-js-client";
import {Progress} from "@/components/ui/progress";
import {File} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [farcasterAccount, setFarcasterAccount] = useState(null);
  const [hasEmbeddedWallet, setHasEmbeddedWallet] = useState(false);
  const pathname = usePathname();
  const path = pathname.split("/")[1];

  const [toggleMedia, setToggleMedia] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [playbackId, setPlaybackId] = useState("");

  const {
    ready,
    authenticated,
    user,
    logout,
    linkFarcaster,
    unlinkFarcaster,
    exportWallet,
  } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
    if (user) {
      setFarcasterAccount(
        user.linkedAccounts.find((account) => account.type === "farcaster")
      );

      setHasEmbeddedWallet(
        !!user.linkedAccounts.find(
          (account) =>
            account.type === "wallet" && account.walletClient === "privy"
        )
      );
    }
    const castBody = {
      text: "fidal",
      embeds: [
        {
          url: "https://fc-polls.vercel.app/polls/054aee65-c63d-46c1-a1f9-a05b747860f6",
        },
      ],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
      // parentUrl: parentUrl,
    };
    // if (farcasterAccount && farcasterAccount.signerPublicKey)
    //   (async function () {
    //     const {hash} = await submitCast(castBody);
    //     console.log(hash, "hash");
    //   })();
  }, [ready, authenticated, router, user]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  //   farcaster
  const farcasterSubject = user?.farcaster?.fid || null;

  //   console.log(farcasterSubject, user, "farcaster");

  const {requestFarcasterSigner, submitCast} = useExperimentalFarcasterSigner();

  //   const farcasterAccount = user.linkedAccounts.find(
  //     (account) => account.type === "farcaster"
  //   );
  // console.log(farcasterAccount, "acc");
  const isAuthenticated = ready && authenticated;

  // const handleFormikChange = (formikValues) => {
  //   // Update the button properties state based on the formik values
  //   const newButtonProperties = Array.from(
  //     {length: formikValues.noOfButtons},
  //     (_, index) => ({
  //       action: formikValues.buttonProperties[index]?.action || "",
  //       buttonContent:
  //         formikValues.buttonProperties[index]?.buttonContent || "",
  //       target: formikValues.buttonProperties[index]?.target || "",
  //     })
  //   );
  //   setButtonProperties(newButtonProperties);
  //   setNumberOfbuttons(formikValues.noOfButtons);
  // };

  const [formikState, setFormikState] = useState({});
  // const [formikSetterFunc, setFormikSetterFunc] = useState(null);

  const ExternalStateSyncComponent = () => {
    const formik = useFormikContext();
    // const specificFormikFunction = formik.setFieldValue;
    // Effect to sync external state with Formik state
    useEffect(() => {
      setFormikState(formik.values);
      // setFormikSetterFunc((fieldName, value, shouldValidate) =>
      //   specificFormikFunction(fieldName, value, shouldValidate)
      // );
    }, [formik.values]);

    return null; // This component doesn't render anything visible
  };

  // console.log(formikState, "state");

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

        console.log("upload started");
      })
      .catch((error) => {
        console.error("There was a problem with the request:", error);
      });
  };

  console.log(uploadStatus, "uploadStatus");

  return (
    <div>
      <main className="w-full h-full">
        {ready && authenticated ? (
          <div className="h-full w-full">
            <Navbar
              handleExternalSubmit={handleExternalSubmit}
              authObj={{
                ready,
                authenticated,
                user,
                logout,
                linkFarcaster,
                unlinkFarcaster,
                exportWallet,
                farcasterAccount,
                farcasterSubject,
                // requestFarcasterSigner,
                canRemoveAccount,
                hasEmbeddedWallet,
                isAuthenticated,
              }}
            />

            {/* <Button onClick={createAsset}>Create</Button> */}

            <div className="w-full min-h-[90%] lg:min-h-full grid lg:grid-cols-5 grid-cols-1 gap-4 p-5 lg:p-0 lg:pr-5 pb-5 mt-4">
              <div className="hidden lg:block lg:w-full">
                <div
                  className="lg:flex lg:flex-col lg:py-4 hidden rounded-lg bg-white lg:pt-5 border h-[89vh] sticky top-[10vh]"
                  style={{alignSelf: "start"}}
                >
                  {/* profile info */}
                  <div className="z-0 w-[90%] h-[80px] border rounded-lg flex items-center just gap-3 pl-3 ml-3 hover:bg-gray-100 cursor-pointer">
                    <Avatar className="">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <p className="font-bold">Farcaster Id</p>
                      <p className="text-sm font-normal">@farcasterid</p>
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
              <fieldset className="h-fit w-auto bg-white rounded-lg p-5 border-2 lg:col-span-2">
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
                          console.log(acceptedFiles[0], "acceptedFiles");
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
                                  acceptedFiles[0] && (
                                    <div className="flex flex-col w-full justify-center items-center gap-4">
                                      <File />
                                      <p className="text-xs font-semibold text-center">
                                        {acceptedFiles
                                          ? acceptedFiles[0]?.name
                                          : "file.mp4"}
                                      </p>
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
                                {/* bug:  */}
                                {uploadStatus === "error" && (
                                  <div>
                                    <p className="text-red-500 text-xs">
                                      Error Occured
                                    </p>
                                  </div>
                                )}

                                {uploadStatus === "idle" && (
                                  <p>Drag and drop your video here</p>
                                )}
                              </div>
                            </div>
                          </section>
                        )}
                      </Dropzone>
                      <div className="grid w-full max-w-full items-center gap-1.5">
                        <Label htmlFor={`nameOfFrameURL`} className="ml-1 mb-2">
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
                          <SelectItem value="0">0</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                      {formikState.noOfButtons > 0 && (
                        <div className="flex flex-col gap-5">
                          {Array.from(
                            {length: formik.values.noOfButtons},
                            (_, index) => (
                              <div key={index} className="flex flex-col gap-1">
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
                                      <SelectItem value="post">Post</SelectItem>
                                      <SelectItem value="link">Link</SelectItem>
                                      <SelectItem value="mint">Mint</SelectItem>
                                      <SelectItem value="tx">Tx</SelectItem>
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
                        <Field
                          as={Input}
                          type="file"
                          name="fallbackimage"
                          id="fallbackimage"
                          className="w-full"
                          placeholder="Image"
                          // onChange={(event) => {
                          //   formik.setFieldValue(
                          //     "fallbackimage",
                          //     event.target.files[0]
                          //   );
                          // }}
                        />
                      </div>
                      {/* <Button className="w-full" type="submit">
                        Publish
                      </Button> */}
                    </Form>
                  )}
                </Formik>
              </fieldset>

              <fieldset className="min-h-[480px] lg:h-[660px] w-auto flex flex-col gap-3 items-center rounded-lg border-2 p-3 lg:col-span-2">
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
                    {playbackId === "" ? (
                      <div className="w-full h-[300px] bg-slate-100 rounded-lg flex justify-center items-center">
                        Your Video here
                      </div>
                    ) : toggleMedia === true && playbackId !== "" ? (
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://lvpr.tv?v=${playbackId}`}
                        frameborder="0"
                      ></iframe>
                    ) : (
                      <img
                        className="w-full h-full rounded-lg"
                        src={formikState.fallbackimage}
                      />
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
  );
}
