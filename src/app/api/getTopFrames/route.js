import axios from "axios";
import { NextResponse } from "next/server";

// Replace '<token>' with your actual bearer token
const token = process.env.NEXT_PUBLIC_PINATA_API_KEY;

export async function GET() {
    try {
        const response = await axios.get('https://graph.cast.k3l.io/scores/global/following/rankings');
        const top5data = response.data.result.sort((a, b) => b.score - a.score).slice(0, 5); // Assuming you want the top scores

        // response body is sent as json.stringify
        // const requestBody = await request.json();
        // const response = await axios.post('https://graph.cast.k3l.io/frames/personalized/rankings/fids', [requestBody.farcasterAccount.fid], {
        //     params: {
        //         agg: 'sumsquare',
        //         weights: 'L1C10R5',
        //         k: 2,
        //         limit: 100
        //     },
        //     headers: {
        //         'accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     }
        // })
        // Function to fetch additional user data
        async function fetchUserData(fid) {
            const userResponse = await axios.get(`https://api.pinata.cloud/v3/farcaster/users/${fid}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return userResponse.data;
        }

        // Map over the top5data to fetch and append additional data
        const fulldata = await Promise.all(top5data.map(async (item) => {
            const userData = await fetchUserData(item.fid);
            // console.log(userData, 'udata1')
            return {
                ...item,
                display_name: userData.data.display_name,
                pfp_url: userData.data.pfp_url
            };
        }));

        // console.log(fulldata, 'fulldata');
        return NextResponse.json(fulldata);
    } catch (error) {
        console.error(error.message);
        return NextResponse.error(500, error.message);
    }
}
