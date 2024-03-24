"use client";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
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
import {Toggle} from "@/components/ui/toggle";
import {Checkbox} from "@/components/ui/checkbox";
import {Formik, Field, Form} from "formik";

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

  // ui states
  const [numberOfbuttons, setNumberOfbuttons] = useState(0);
  console.log(numberOfbuttons, "num");

  return (
    <div>
      {/* <Head>
        <title>Privy Auth Demo</title>
      </Head> */}

      <main className="h-screen w-full">
        {ready && authenticated ? (
          <div className="h-full w-full">
            {/* top bar */}
            {/* <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-semibold">Privy Auth Demo</h1>
              <button
                onClick={logout}
                className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
              >
                Logout
              </button>

              <Button
                onClick={exportWallet}
                disabled={!isAuthenticated || !hasEmbeddedWallet}
              >
                Export my wallet
              </Button>
              <Button
                onClick={() => requestFarcasterSigner()}
                // Prevent requesting a Farcaster signer if a user has not already linked a Farcaster account
                // or if they have already requested a signer
                disabled={!farcasterAccount || farcasterAccount.signerPublicKey}
              >
                Authorize my Farcaster signer
              </Button>
            </div> */}
            {/* body */}
            {/* <div className="mt-12 flex gap-4 flex-wrap">
              {farcasterSubject ? (
                <button
                  onClick={() => {
                    unlinkFarcaster(farcasterSubject);
                  }}
                  className="text-sm border border-violet-600 hover:border-violet-700 py-2 px-4 rounded-md text-violet-600 hover:text-violet-700 disabled:border-gray-500 disabled:text-gray-500 hover:disabled:text-gray-500"
                  disabled={!canRemoveAccount}
                >
                  Unlink Farcaster
                </button>
              ) : (
                <button
                  onClick={() => {
                    linkFarcaster();
                  }}
                  className="text-sm bg-violet-600 hover:bg-violet-700 py-2 px-4 rounded-md text-white"
                >
                  Link Farcaster
                </button>
              )}
            </div> */}

            {/* <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <textarea
              value={JSON.stringify(user, null, 2)}
              className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2"
              rows={20}
              disabled
            /> */}

            <Navbar
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
                requestFarcasterSigner,
                canRemoveAccount,
                hasEmbeddedWallet,
                isAuthenticated,
              }}
            />

            <div className="w-full min-h-[90%] lg:h-[90%] flex flex-col lg:flex-row justify-center">
              <div className="h-full w-full lg:w-1/2 bg-white rounded-lg p-5">
                <Formik
                  initialValues={{
                    video: "",
                    picture: "",
                    noOfButtons: 0,
                    needInputButton: false,
                  }}
                  onSubmit={(value, _) => console.log(value)}
                >
                  {(formik) => (
                    <Form className="flex flex-col gap-10">
                      <div className="border-2 border-dotted flex justify-center items-center h-[200px] w-full rounded-lg border-slate-400">
                        Drag and drop your video here
                      </div>
                      <Select
                        className="w-full"
                        onValueChange={(val) => {
                          setNumberOfbuttons(val);
                        }}
                      >
                        <SelectTrigger className="w-full focus-visible:ring-0">
                          <SelectValue placeholder="Select number of buttons" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="grid w-full max-w-full items-center gap-1.5">
                        <Label htmlFor="picture" className="ml-2 mb-2">
                          Choose Fallback Image
                        </Label>
                        <Input id="picture" type="file" />
                      </div>
                      <div className="flex items-center space-x-2 pl-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Need Input Button
                        </label>
                      </div>
                      <Button className="w-full" type="submit">
                        Publish
                      </Button>
                    </Form>
                  )}
                </Formik>
              </div>

              <div className="h-[600px] lg:h-full w-full lg:w-1/2 bg-white p-4 flex flex-col gap-3">
                <div className="border-2 border-slate-300 h-full w-full rounded-lg p-5">
                  <div className="w-full h-[300px] bg-slate-400 rounded-lg flex justify-center items-center">
                    Your Video here
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
