"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {usePrivy} from "@privy-io/react-auth";

export default function Home() {
  const {login, ready, authenticated} = usePrivy();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/client/feed");
    }
  }, [router, ready, authenticated]);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen h-screen">
      <div className="hidden bg-muted lg:block">
        {/* <Image
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
        <div className="w-full h-full flex justify-center px-10 flex-col gap-4 items-center bg-hero-pattern text-white relative">
          <div className="flex flex-col gap-5">
            <p className="text-6xl font-bold">Experience.</p>
            <p className="text-6xl font-bold">Video Frames.</p>
            <p className="text-6xl font-bold">powered by</p>
            <div className="flex gap-1 items-center text-6xl">
              <p className="font-bold">Livepeer</p>
              <img src="/livepeer.png" alt="livepeer" className="h-16 w-16" />
            </div>

            <div className="bottom-7 left-1/4 flex gap-3 absolute items-center text-sm font-semibold">
              <img
                src="https://assets-global.website-files.com/6364e65656ab107e465325d2/637aede94d31498505bc9412_DpYIEpePqjDcHIbux04cOKhrRwBhi7F0-dBF_JCdCYY.png"
                alt="farcaster"
                className="w-7 aspect-square"
              />
              <p className="tracking-wide">Powered by Farcaster Network.</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center h-full">
        <div className="mx-auto grid w-[450px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Get Started.</h1>
            <p className="text-balance text-muted-foreground">
              Connect to Farcaster Network
            </p>
          </div>
          <div className="grid gap-4">
            <Button onClick={login} variant="outline">
              <img
                src="https://assets-global.website-files.com/6364e65656ab107e465325d2/637aede94d31498505bc9412_DpYIEpePqjDcHIbux04cOKhrRwBhi7F0-dBF_JCdCYY.png"
                alt="farcaster"
                className="w-5 aspect-square"
              />{" "}
              <span className="ml-2">Login with Farcaster</span>
            </Button>
          </div>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
}
