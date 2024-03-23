"use client";
import React, { useState } from 'react';
import { Livepeer } from "livepeer";

function Page() {
    const apiKey = '0e09bc04-6b01-490e-bece-8617d7ad1099';
    const [fileName, setFileName] = useState('');

    const livepeer = new Livepeer({ apiKey });

    const createAsset = async () => {
        const assetData = {
            name: fileName
        };

        try {
            const response = await livepeer.asset.create(assetData);
            console.log("Asset upload request:", response);
        } catch (error) {
            console.error("Error requesting asset upload:", error);
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);
    }

    return (
        <div>
            <input type="file" placeholder='upload video' onChange={handleFileChange} />
            <button onClick={createAsset}>Create Asset</button>
        </div>
    )
}

export default Page;
