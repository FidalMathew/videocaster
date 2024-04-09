import axios from "axios";
import { NextResponse } from "next/server";

// Replace '<token>' with your actual bearer token
const token = process.env.NEXT_PUBLIC_PINATA_API_KEY;

export async function POST(request) {
    try {

        const requestBody = await request.json();
        const userResponse = await axios.get(`https://api.pinata.cloud/v3/farcaster/users/${requestBody.fid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return NextResponse.json(userResponse.data);

    } catch (error) {
        console.error(error.message);
        return NextResponse.error(500, error.message);
    }
}
