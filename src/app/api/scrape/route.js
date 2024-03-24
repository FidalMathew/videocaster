import { NextResponse } from "next/server"
import cheerio from "cheerio";
import axios from "axios";

const extractButtonProperties = (exampleJson) => {
    const buttonProperties = [];

    Object.keys(exampleJson).forEach((key) => {
        if (key.startsWith('fc:frame:button')) {
            const buttonIndex = key.split(":")[3];
            const actionKey = `fc:frame:button:${buttonIndex}:action`;
            const buttonTarget = `fc:frame:button:${buttonIndex}:target`
            const buttonName = exampleJson[key];
            const action = exampleJson[actionKey];

            if (buttonIndex && buttonProperties[buttonIndex] === undefined) {
                buttonProperties[buttonIndex] = {
                    buttonIndex: buttonIndex,
                    buttonContent: exampleJson[key]
                }
            }

            if (buttonProperties[buttonIndex] && action) {
                buttonProperties[buttonIndex].action = action
            }

            if (buttonProperties[buttonIndex] && exampleJson[buttonTarget]) {
                buttonProperties[buttonIndex].target = exampleJson[buttonTarget]
            }
        }
    });

    // if any index is coming null, filter it and return
    return buttonProperties.filter(item => item != null)
};

export async function POST(request) {
    try {
        // console.log(url)

        const data = await request.json()
        const framesUrl = data.framesUrl

        const response = await axios.get(framesUrl);
        const html = response.data;


        const $ = cheerio.load(html);

        const metaTags = {};
        $("meta").each((index, element) => {
            const name = $(element).attr("name");
            const property = $(element).attr("property");
            const content = $(element).attr("content");

            // Check if the meta tag has either name or property attribute
            if (name || property) {
                metaTags[name || property] = content;
            }
        });

        const extractedButtonProperties = extractButtonProperties(metaTags)


        return NextResponse.json({
            metaTags,
            buttonProperties: extractedButtonProperties,
            video: metaTags["fc:frame:video"],
            image: metaTags["fc:frame:image"],
            fallbackImage: metaTags["og:image"]
        })
    } catch (err) {
        console.log(err.message)
        return NextResponse.json(err)
    }
}