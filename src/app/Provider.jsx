"use client";

import {PrivyProvider} from "@privy-io/react-auth";
import {useRouter} from "next/navigation";
import {ThemeProvider as NextThemesProvider} from "next-themes";
export default function Providers({children, ...props}) {
  const router = useRouter();

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
      onSuccess={() => router.push("/dashboard")}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: "light",
          accentColor: "#676FFF",
        },
        // Create embedded wallets for users who don't have a wallet
        // embeddedWallets: {
        //   createOnLogin: "users-without-wallets",
        // },
      }}
    >
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </PrivyProvider>
  );
}