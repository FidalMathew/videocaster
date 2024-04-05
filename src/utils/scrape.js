// const axios = require("axios");
// const cheerio = require("cheerio");
import axios from "axios";
import cheerio from "cheerio";

export async function scrapeMetaData(url) {
  try {
    // Fetch HTML content of the URL
    const response = await axios.get(url);
    const html = response.data;

    // Load HTML into Cheerio
    const $ = cheerio.load(html);

    // Extract meta tags
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

    // Output metadata
    // console.log(metaTags);

    // Extract value for 'fc:frame:video'
    const fcFrameVideo = metaTags["fc:frame:video"];
    // console.log("fc:frame:video value:", fcFrameVideo);

    return {
      fcFrameVideo,
      metaTags,
    };
  } catch (error) {
    console.error("Error scraping metadata:", error);
  }
}

// // Example usage:
// const url = "https://far-from-frames.vercel.app/";
// scrapeMetaData(url);
