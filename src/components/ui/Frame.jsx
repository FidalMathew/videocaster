"use client"
import React, { useEffect, useState } from 'react'
import { scrapeMetaData } from '@/utils/scrape'
function Frame() {

    const [res, setRes] = useState(null)
    useEffect(() => {
        const getData = async () => {

            const url = "https://far-from-frames.vercel.app/";
            let res = await scrapeMetaData(url);
            console.log(res, "ress")
            setRes(res)
        }
        getData()
    }, [])



    return (
        <div>
            <iframe
                src={res || `https://lvpr.tv?v=01faw9p23up7bwwe`}
                allowfullscreen
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                frameborder="0"
            >
            </iframe>
        </div>
    )
}

export default Frame