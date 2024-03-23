"use client";

import {Button} from "@/components/ui/button";
import {usePrivy} from "@privy-io/react-auth";
import {useEffect, useState} from "react";
export default function Home() {
  const {login} = usePrivy();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    console.log(process.env.ACCOUNT_KEY);
  }, []);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div
      className="flex justify-center items-center h-screen w-full"
      suppressHydrationWarning
    >
      <Button onClick={login} variant="secondary">
        <img
          src="https://assets-global.website-files.com/6364e65656ab107e465325d2/637aede94d31498505bc9412_DpYIEpePqjDcHIbux04cOKhrRwBhi7F0-dBF_JCdCYY.png"
          alt="farcaster"
          className="w-5 aspect-square"
        />{" "}
        <span className="ml-2">Login with Farcaster</span>
      </Button>
    </div>
  );
}
