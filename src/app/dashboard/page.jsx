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

export default function DashboardPage() {
  const router = useRouter();
  const [farcasterAccount, setFarcasterAccount] = useState(null);
  const [hasEmbeddedWallet, setHasEmbeddedWallet] = useState(false);
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
  console.log(farcasterAccount, "acc");
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
  const [formikSetterFunc, setFormikSetterFunc] = useState(null);

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

  console.log(formikState, "state");

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
    console.log(values, "values");
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

  return (
    <div>
      <main className="h-screen w-full">
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

            <div className="w-full min-h-[90%] lg:min-h-fit flex flex-col lg:flex-row justify-center gap-4 px-6 pb-6">
              <fieldset className="h-full w-full lg:w-1/2 bg-white rounded-lg p-5 border-2">
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
                    console.log(value);
                  }}
                >
                  {(formik) => (
                    <Form className="flex flex-col gap-8 mb-6">
                      <ExternalStateSyncComponent />
                      <Dropzone
                        accept="video/*"
                        onDrop={(acceptedFiles) =>
                          console.log(acceptedFiles[0], "acceptedFiles")
                        }
                      >
                        {({getRootProps, getInputProps}) => (
                          <section className="cursor-pointer">
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />
                              <div className="border-2 border-dotted flex justify-center items-center h-[200px] w-full rounded-lg border-slate-400">
                                Drag and drop your video here
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
                          id={`playbackId`}
                          name={`playbackId`}
                          className="w-full"
                          placeholder="Livepeer Playback ID"
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
                        <Label htmlFor="picture" className="ml-2 mb-2">
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
                          type="text"
                          name="fallbackimage"
                          id="fallbackimage"
                          className="w-full"
                          placeholder="Image"
                        />
                      </div>
                      {/* <Button className="w-full" type="submit">
                        Publish
                      </Button> */}
                    </Form>
                  )}
                </Formik>
              </fieldset>

              <fieldset className="min-h-[480px] w-full lg:w-1/2 flex flex-col gap-3 items-center rounded-lg border-2 p-3">
                <legend className="-ml-1 px-1 text-sm font-medium">
                  Output
                </legend>
                <div className="flex justify-end w-full">
                  <Badge variant="" className="">
                    Output
                  </Badge>
                </div>

                <div className="h-fit w-full rounded-lg p-5 flex flex-col gap-6 border">
                  <div className="w-full h-[300px] rounded-lg flex justify-center items-center">
                    {/* Your Video here */}
                    {!formikState.playbackId ? (
                      <div className="w-full h-[300px] bg-slate-100 rounded-lg flex justify-center items-center">
                        Your Video here
                      </div>
                    ) : (
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={"https://lvpr.tv?v=" + formikState.playbackId}
                        frameborder="0"
                      ></iframe>
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
