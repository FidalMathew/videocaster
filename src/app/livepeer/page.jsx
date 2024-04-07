"use client";
import React, {useEffect, useState} from "react";
import {Livepeer} from "livepeer";
import axios from "axios";
import Frame from "@/components/ui/Frame";
import * as tus from "tus-js-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {ArrowLeftIcon, ReloadIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";

function Page() {
  const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;
  const [file, setFile] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const livepeer = new Livepeer({apiKey});
  const [image, setImage] = useState("");

  const createAsset = async () => {
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
        console.log(response.data); // Handle the response data here

        let res = response.data;
        let tusEndpoint = res.tusEndpoint;

        const upload = new tus.Upload(file, {
          endpoint: tusEndpoint, // tus endpoint which you get from the API response
          chunkSize: 100 * 1024 * 1024, // 1KB
          onError: (error) => {
            console.log("Failed because: " + error);
          },
          onProgress: (bytesUploaded, bytesTotal) => {
            const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            console.log(bytesUploaded, bytesTotal, percentage + "%");
          },
          onSuccess: () => {
            // checkProgress(res.object?.asset.id);
            console.log("Upload finished: " + upload);
          },
        });

        upload.start();

        console.log("upload started");
      })
      .catch((error) => {
        console.error("There was a problem with the request:", error);
      });
  };

  const handleFileChange = (e) => {
    console.log(e.target.files[0], "hellooo");
    var file = e.target.files[0];

    setFile(file);
  };

  const pinFileToIPFS = (image) => {
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
      body: form, // No need to set options.body separately, you can directly include it here
    };

    fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", options)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setImageUrl(`https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`);
      })
      .catch((err) => console.error(err));
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

  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <input
        type="file"
        placeholder="upload video"
        onChange={handleFileChange}
      />
      <button onClick={createAsset}>Create Asset</button>
      <input
        type="file"
        placeholder="upload fallback image"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <button onClick={() => pinFileToIPFS(image)}>Pin to IPFS</button>
      {/* <iframe
                src="https://lvpr.tv?v=01faw9p23up7bwwe"
                allowfullscreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                frameborder="0"
            >
            </iframe> */}
      {/* <Frame /> */}
      {videoUrl && (
        <div>
          <video controls>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>Filename: {videoUrl.substring(videoUrl.lastIndexOf("/") + 1)}</p>
        </div>
      )}
      {image && (
        <div>
          <img
            src={URL.createObjectURL(image)}
            alt="Preview Image"
            style={{maxWidth: "100%", maxHeight: "200px"}}
          />
          <p>Filename: {imageUrl.substring(imageUrl.lastIndexOf("/") + 1)}</p>
        </div>
      )}

      <Dialog
        open={openModal}
        onOpenChange={() => {
          setOpenModal(false);
          setCurrentStep(0);
        }}
      >
        {/* <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger> */}
        {currentStep === 0 ? (
          <DialogContent className="h-[400px] duration-200 ease-in-out transition-all">
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
        <Button onClick={() => setOpenModal(true)}>Open</Button>
      </div>
    </div>
  );
}

export default Page;
