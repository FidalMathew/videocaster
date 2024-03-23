"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePrivy, useExperimentalFarcasterSigner } from "@privy-io/react-auth";
import Head from "next/head";
<<<<<<< HEAD
import Navbar from "@/components/ui/Navbar";
=======
import { Button } from "@/components/ui/button";
>>>>>>> 67a9fed603406a57e5e71b2c1744349995540d36

export default function DashboardPage() {
  const router = useRouter();
  const [farcasterAccount, setFarcasterAccount] = useState(null);
<<<<<<< HEAD
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
=======
  const { ready, authenticated, user, logout, linkFarcaster, unlinkFarcaster } =
    usePrivy();
>>>>>>> 67a9fed603406a57e5e71b2c1744349995540d36

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
    if (farcasterAccount && farcasterAccount.signerPublicKey)
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
  const isAuthenticated = ready && authenticated;

  return (
    <>
      <Head>
        <title>Privy Auth Demo</title>
      </Head>

      <main className="flex flex-col min-h-screen">
        {ready && authenticated ? (
          <>
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
