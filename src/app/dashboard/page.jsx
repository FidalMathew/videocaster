"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrivy, useExperimentalFarcasterSigner } from "@privy-io/react-auth";
import Head from "next/head";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [farcasterAccount, setFarcasterAccount] = useState(null);
  const { ready, authenticated, user, logout, linkFarcaster, unlinkFarcaster } =
    usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
    if (user) {
      setFarcasterAccount(
        user.linkedAccounts.find((account) => account.type === "farcaster")
      );
    }
    if (farcasterAccount.signerPublicKey)
      (async function () {
        const { hash } = await submitCast({ text: "Hello world!" });
        console.log(hash, "hash");
      })();
  }, [ready, authenticated, router, user]);

  const numAccounts = user?.linkedAccounts?.length || 0;
  const canRemoveAccount = numAccounts > 1;

  //   farcaster
  const farcasterSubject = user?.farcaster?.fid || null;

  //   console.log(farcasterSubject, user, "farcaster");

  const { requestFarcasterSigner, submitCast } = useExperimentalFarcasterSigner();

  //   const farcasterAccount = user.linkedAccounts.find(
  //     (account) => account.type === "farcaster"
  //   );
  console.log(farcasterAccount, "acc");

  return (
    <>
      <Head>
        <title>Privy Auth Demo</title>
      </Head>

      <main className="flex flex-col min-h-screen px-4 sm:px-20 py-6 sm:py-10 bg-privy-light-blue">
        {ready && authenticated ? (
          <>
            <div className="flex flex-row justify-between">
              <h1 className="text-2xl font-semibold">Privy Auth Demo</h1>
              <button
                onClick={logout}
                className="text-sm bg-violet-200 hover:text-violet-900 py-2 px-4 rounded-md text-violet-700"
              >
                Logout
              </button>

              <Button
                onClick={() => requestFarcasterSigner()}
                // Prevent requesting a Farcaster signer if a user has not already linked a Farcaster account
                // or if they have already requested a signer
                disabled={!farcasterAccount || farcasterAccount.signerPublicKey}
              >
                Authorize my Farcaster signer
              </Button>
            </div>
            <div className="mt-12 flex gap-4 flex-wrap">
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
            </div>

            <p className="mt-6 font-bold uppercase text-sm text-gray-600">
              User object
            </p>
            <textarea
              value={JSON.stringify(user, null, 2)}
              className="max-w-4xl bg-slate-700 text-slate-50 font-mono p-4 text-xs sm:text-sm rounded-md mt-2"
              rows={20}
              disabled
            />
          </>
        ) : null}


        <button
          onClick={() => requestFarcasterSigner()}
          // Prevent requesting a Farcaster signer if a user has not already linked a Farcaster account
          // or if they have already requested a signer
          disabled={!farcasterAccount || farcasterAccount.signerPublicKey}
        >
          Authorize my Farcaster signer
        </button>
      </main>
    </>
  );
}
