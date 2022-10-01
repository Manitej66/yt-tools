import chromium from "chrome-aws-lambda";
import NextCors from "nextjs-cors";
import type { NextApiRequest, NextApiResponse } from "next";
import { chromePath } from "../../utils/constants";

type Data = {
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string | Buffer | Data | void>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });
  console.log(req.query);
  const { emoji, color } =
    (req.query as { emoji: string; color: string }) || "";

  if (!emoji) {
    res.status(400).json({ error: "No emoji provided" });
    return;
  }
  // Open the browser with the right window size
  const browser = await chromium.puppeteer.launch({
    defaultViewport: { width: 300, height: 200, deviceScaleFactor: 4 },
    executablePath:
      process.env.NODE_ENV === "production"
        ? await chromium.executablePath
        : chromePath,
    headless: process.env.NODE_ENV === "production" ? chromium.headless : true,
    ignoreHTTPSErrors: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--single-process",
    ],
  });

  // Navigate a new browser page to the layout page
  let page = await browser.newPage();
  await page.setContent(
    `
        <!DOCTYPE html>
        <html>
        <style>
            body {
                background-color: #${color};
            }
            .container {
                display: grid;
                place-items: center;
                height: 100vh;
            }
            .text {
              font-size: 8px;
              color: #94a3b8;
              position: absolute;
              bottom: 0;
            }
        </style>
        <body>
            <div class="container">
             <p style="font-size:40px;">${emoji}</p>
             <p class="text">made with <span style="text-decoration:underline">yt-tools.vercel.app</span></p>
            </div>
        </body>
        </html>
        `
  );

  const screenshotBuffer = await page.screenshot({ type: "jpeg" });
  await browser.close();

  // Tell the consuming service to cache the image being sent
  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
  );
  res.setHeader("Content-Type", "image/jpeg");
  res.status(200).send(screenshotBuffer);
}
