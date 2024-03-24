import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const url = new URL(req.url);
  const searchparams = new URLSearchParams(url.searchParams);

  const fid = searchparams.get("fid");
  console.log(fid, "fid");

  const params = { fid: fid };
  const posturl = "https://api.pinata.cloud/v3/farcaster/casts";
  const token = process.env.NEXT_PUBLIC_PINATA_API_KEY;

  try {
    // Make the GET request
    const response = params
      ? await axios.get(posturl, {
          params: params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      : await axios.get(posturl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    return NextResponse.json({ message: response.data });
  } catch (error) {
    // Log error and send error message
    console.error(error.message);
    return NextResponse.json({ message: "error" });
  }
}
