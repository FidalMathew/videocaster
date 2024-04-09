import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request) {
  try {
    const data = await request.json();
    const postUrl = data.framesUrl;

    // Make the POST request
    const response = await axios.post(postUrl);
    console.log(response.data, "response.data");

    return NextResponse.json({ redirectUrl: response.data.redirectUrl });
  } catch (error) {
    // Log error and send error message
    console.error(error.message);
    return NextResponse.json({ message: "error" });
  }
}
