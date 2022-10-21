import type { NextApiRequest, NextApiResponse } from "next";
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

type Data = {
  error?: string;
};

export default async function handler(
  req: NextRequest,
  res: NextApiResponse<Data | ImageResponse>
) {
  const { searchParams } = new URL(req.url);

  return new ImageResponse(
    (
      <div
        tw="flex flex-col justify-center items-center h-screen w-screen"
        style={{ backgroundColor: `#${searchParams.get("color")}` || "white" }}
      >
        <p style={{ fontSize: 128 }}>{searchParams.get("emoji") || "👋"} </p>
        <p>made with yt-tools.vercel.app</p>
      </div>
    ),
    {
      emoji: "fluent",
      width: 1000,
      height: 600,
    }
  );
}
