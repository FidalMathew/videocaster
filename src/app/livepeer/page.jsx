"use client";
import React, { useEffect, useState } from "react";
import { Livepeer } from "livepeer";
import axios from "axios";
import Frame from '@/components/ui/Frame';
import * as tus from 'tus-js-client';
function Page() {
    const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;
    const [file, setFile] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const livepeer = new Livepeer({ apiKey });

    // const checkProgress = async (id: string) => {
    //     const interval = setInterval(async () => {
    //         const { asset } = axios.get(/api/asset / { id });
    //   const phase = asset?.status?.phase;
    //         const progress = asset?.status?.progress;
    //         console.log("phase", phase);
    //         console.log("phase", progress);

    //         if (phase === "ready") {
    //             console.log("video is ready, time to play!");
    //             clearInterval(interval);
    //         }
    //     }, 5000);
    // };

    const createAsset = async () => {
        const assetData = {
            name: file.name
        };

        const url = 'https://livepeer.studio/api/asset/request-upload';

        axios.post(url, assetData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
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
            .catch(error => {
                console.error('There was a problem with the request:', error);
            });
    }



    const handleFileChange = (e) => {

        console.log(e.target.files[0], "hellooo")
        var file = e.target.files[0]

        setFile(file);
        // const url = URL.createObjectURL(file);
        // setVideoUrl(url);
        // console.log(url, "hellooo")

    }

    // input.addEventListener('change', function (e) {
    //     // Get the selected file from the input element
    //     var file = e.target.files[0]


    //     // Create a new tus upload
    //     var upload = new tus.Upload(file, {
    //         endpoint: 'http://localhost:1080/files/',
    //         retryDelays: [0, 3000, 5000, 10000, 20000],
    //         metadata: {
    //             filename: file.name,
    //             filetype: file.type,
    //         },
    //         onError: function (error) {
    //             console.log('Failed because: ' + error)
    //         },
    //         onProgress: function (bytesUploaded, bytesTotal) {
    //             var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
    //             console.log(bytesUploaded, bytesTotal, percentage + '%')
    //         },
    //         onSuccess: function () {
    //             console.log('Download %s from %s', upload.file.name, upload.url)
    //         },
    //     })

    //     // Check if there are any previous uploads to continue.
    //     upload.findPreviousUploads().then(function (previousUploads) {
    //         // Found previous uploads so we select the first one.
    //         if (previousUploads.length) {
    //             upload.resumeFromPreviousUpload(previousUploads[0])
    //         }

    //         // Start the upload
    //         upload.start()
    //     })
    // })

    // useEffect(() => {
    //     // console.log(file);
    //     const func = async () => {
    //         const playbackId = '01faw9p23up7bwwe'
    //         try {
    //             const playbackInfo = await livepeer.playback.get(playbackId);
    //             const videoUrl = playbackInfo.playbackInfo?.meta.source[0]?.url;
    //             console.log(videoUrl)
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     func();
    // }, [file]);

    return (
        <div>
            <input
                type="file"
                placeholder="upload video"
                onChange={handleFileChange}
            />
            <button onClick={createAsset}>Create Asset</button>
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
                    <p>Filename: {videoUrl.substring(videoUrl.lastIndexOf('/') + 1)}</p>
                </div>
            )}
        </div>
    )
}

export default Page;
