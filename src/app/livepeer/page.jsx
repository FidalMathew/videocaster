"use client";
import React, { useEffect, useState } from 'react';
import { Livepeer } from "livepeer";
import axios from "axios";
import Frame from '@/components/ui/Frame';
function Page() {
    const apiKey = process.env.NEXT_PUBLIC_LIVEPEER_API_KEY;
    const [fileName, setFileName] = useState('');

    const livepeer = new Livepeer({ apiKey });

    const createAsset = async () => {
        const assetData = {
            name: fileName
        };

        // try {
        //     const response = await livepeer.asset.create(assetData);
        //     console.log("Asset upload request:", response);
        // } catch (error) {
        //     console.error("Error requesting asset upload:", error);
        // }
        const url = 'https://livepeer.studio/api/asset/request-upload';

        axios.post(url, assetData, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log(response.data); // Handle the response data here
            })
            .catch(error => {
                console.error('There was a problem with the request:', error);
            });
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);
        console.log(file, apiKey)
    }

    // useEffect(() => {
    //     // console.log(fileName);
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
    // }, [fileName]);

    return (
        <div>
            <input type="file" placeholder='upload video' onChange={handleFileChange} />
            <button onClick={createAsset}>Create Asset</button>
            {/* <iframe
                src="https://lvpr.tv?v=01faw9p23up7bwwe"
                allowfullscreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                frameborder="0"
            >
            </iframe> */}
            <Frame />
        </div>
    )
}

export default Page;
