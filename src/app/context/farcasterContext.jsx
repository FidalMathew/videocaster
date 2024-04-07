"use client";
import {useExperimentalFarcasterSigner} from "@privy-io/react-auth";
import {usePrivy} from "@privy-io/react-auth";
import {useRouter} from "next/navigation";
import {createContext, useContext, useEffect, useState} from "react";

export const farcasterContext = createContext();

const FarcasterContextProvider = ({children}) => {
  const [farcasterAccount, setFarcasterAccount] = useState(null);
  const [hasEmbeddedWallet, setHasEmbeddedWallet] = useState(false);
  const router = useRouter();

  const {
    ready,
    authenticated,
    user,
    logout,
    linkFarcaster,
    unlinkFarcaster,
    exportWallet,
  } = usePrivy();

  console.log(
    farcasterAccount,
    hasEmbeddedWallet,
    ready,
    authenticated,
    user,
    logout,
    linkFarcaster,
    unlinkFarcaster,
    exportWallet,
    "all val"
  );

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
  const {requestFarcasterSigner, submitCast} = useExperimentalFarcasterSigner();
  const isAuthenticated = ready && authenticated;

  return (
    <farcasterContext.Provider
      value={{
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
      }}
    >
      {children}
    </farcasterContext.Provider>
  );
};

export default FarcasterContextProvider;

export const useFarcasterContext = () => {
  return useContext(farcasterContext);
};
