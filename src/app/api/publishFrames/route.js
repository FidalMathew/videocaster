import { NextResponse } from "next/server";
import axios from "axios";

const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// Repository information
const owner = "FidalMathew";
const repo = "NoCodeFrames";
const branch = "main";

// API endpoints
const baseUrl = "https://api.github.com";
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github.v3+json",
};

// Function to create or update file
function createOrUpdateFile(content, filePath) {
  // Encode the content to base64

  console.log("createOrUpdateFile(content, filePath)", filePath);

  const contentBytes = Buffer.from(content, "utf-8");
  const contentBase64 = contentBytes.toString("base64");

  console.log(contentBase64, "contentBase64");
  // Check if the file exists, if not, create it; otherwise, update it
  axios
    .get(`${baseUrl}/repos/${owner}/${repo}/contents/${filePath}`, { headers })
    .then((response) => {
      // File exists, update content if different
      const currentContent = Buffer.from(
        response.data.content,
        "base64"
      ).toString("utf-8");
      if (currentContent !== content) {
        updateFile(contentBase64, filePath, response.data.sha);
      } else {
        console.log("File content is already up to date.");
      }
    })
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        // File doesn't exist, create it
        createFile(contentBase64, filePath);
      } else {
        console.error("Error retrieving file content:", error);
      }
    });
}

function createFile(contentBase64, filePath) {
  const fileData = {
    message: "Create new file",
    content: contentBase64,
    branch: branch,
  };

  axios
    .put(`${baseUrl}/repos/${owner}/${repo}/contents/${filePath}`, fileData, {
      headers,
    })
    .then((response) => {
      if (response.status === 201) {
        console.log("File created successfully!");
      } else {
        console.log(`Failed to create file: ${response.data.message}`);
      }
    })
    .catch((error) => {
      console.error("Error creating file:", error);
    });
}

function updateFile(contentBase64, filePath, sha) {
  const fileData = {
    message: "Update file content",
    content: contentBase64,
    branch: branch,
    sha: sha,
  };

  axios
    .put(`${baseUrl}/repos/${owner}/${repo}/contents/${filePath}`, fileData, {
      headers,
    })
    .then((response) => {
      if (response.status === 200) {
        console.log("File updated successfully!");
      } else {
        console.log(`Failed to update file: ${response.data.message}`);
      }
    })
    .catch((error) => {
      console.error("Error updating file:", error);
    });
}

export async function POST(request) {
  const req = await request.json();
  console.log("hello ", req);

  const {
    uname,
    nameOfFrameURL: frameName,
    fallbackimage,
    noOfButtons,
    needInputButton,
    playbackId,
    buttonProperties,
  } = req;

  const filePath = `app/examples/${frameName}-${uname}/frames/route.ts`;

  const jsxContent = `
export { POST } from "frames.js/next/server";
`;

  const filePath2 = `app/examples/${frameName}-${uname}/page.tsx`;

  let dynamicButtons = "";

  for (let i = 0; i < buttonProperties.length; i++) {
    let { action, target, buttonContent } = buttonProperties[i];
    let action1 = `"` + action + `"`;
    let target1 = `"` + target + `"`;

    if (action === "post") {
      target;
    }

    if (target && action) {
      dynamicButtons += `<FrameButton action=${action1} target=${target1}>${buttonContent}</FrameButton>\n`;
    } else if (action) {
      dynamicButtons += `<FrameButton action=${action1}>${buttonContent}</FrameButton>\n`;
    } else if (target) {
      dynamicButtons += `<FrameButton target=${target1}>${buttonContent}</FrameButton>\n`;
    } else {
      dynamicButtons += `<FrameButton>${buttonContent}</FrameButton>\n`;
    }
  }

  console.log({
    uname,
    nameOfFrameURL: frameName,
    fallbackimage,
    noOfButtons,
    needInputButton,
    playbackId,
    buttonProperties,
  });

  const video = "https://lvpr.tv?v=" + playbackId;

  const jsxContent2 = `
import { getTokenUrl } from "frames.js";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  useFramesReducer,
} from "frames.js/next/server";
import Link from "next/link";
import { zora } from "viem/chains";
import { currentURL } from "../../utils";
import { createDebugUrl } from "../../debug";

type State = {
  pageIndex: number;
};

const nfts: {
  src: string;
  tokenUrl: string;
}[] = [
  {
    src: "https://ipfs.decentralized-content.com/ipfs/bafybeifs7vasy5zbmnpixt7tb6efi35kcrmpoz53d3vg5pwjz52q7fl6pq/cook.png",
    tokenUrl: getTokenUrl({
      address: "0x99de131ff1223c4f47316c0bb50e42f356dafdaa",
      chain: zora,
      tokenId: "2",
    }),
  },
  {
    src: "https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeiegrnialwu66u3nwzkn4gik4i2x2h4ip7y3w2dlymzlpxb5lrqbom&w=1920&q=75",
    tokenUrl: getTokenUrl({
      address: "0x060f3edd18c47f59bd23d063bbeb9aa4a8fec6df",
      chain: zora,
      tokenId: "1",
    }),
  },
  {
    src: "https://remote-image.decentralized-content.com/image?url=https%3A%2F%2Fipfs.decentralized-content.com%2Fipfs%2Fbafybeidc6e5t3qmyckqh4fr2ewrov5asmeuv4djycopvo3ro366nd3bfpu&w=1920&q=75",
    tokenUrl: getTokenUrl({
      address: "0x8f5ed2503b71e8492badd21d5aaef75d65ac0042",
      chain: zora,
      tokenId: "3",
    }),
  },
];
const initialState: State = { pageIndex: 0 };

const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex;

  return {
    pageIndex: buttonIndex
      ? (state.pageIndex + (buttonIndex === 2 ? 1 : -1)) % nfts.length
      : state.pageIndex,
  };
};


// This is a react server component only
export default async function Home({ searchParams }: NextServerPageProps) {
  const url = currentURL("/examples/mint-button");
  const previousFrame = getPreviousFrame<State>(searchParams);
  const [state] = useFramesReducer<State>(reducer, initialState, previousFrame);

  // then, when done, return next frame
  return (
    <div>
      Mint button example <Link href={createDebugUrl(url)}>Debug</Link>
      <meta name="fc:frame:video" content="${video}" />
      <FrameContainer
        pathname="/examples/mint-button"
        postUrl="/examples/mint-button/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage
          src="${fallbackimage}"
          aspectRatio="1:1"
        ></FrameImage>
        ${dynamicButtons}
      </FrameContainer>
    </div>
  );
}
`;

  console.log(jsxContent2);
  try {
    createOrUpdateFile(jsxContent, filePath);
    console.log("--------------------------------");
    setTimeout(() => {
      createOrUpdateFile(jsxContent2, filePath2);
    }, 2000);
    // createOrUpdateFile(jsxContent2, filePath2);

    return NextResponse.json({ message: "success" });
  } catch (error) {
    // Log error and send error message
    console.error(error.message);
    return NextResponse.json({ message: "error" });
  }
}
