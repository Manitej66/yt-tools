/* eslint-disable @next/next/no-img-element */
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

  const title = searchParams.get("title") || "No Title";
  const artist = searchParams.get("artist") || "No Artist";
  const thumbnail =
    searchParams.get("thumbnail") ||
    "ttps://i.ytimg.com/vi_webp/IN-ktaMM9Bs/maxresdefault.webp";

  return new ImageResponse(
    (
      <div tw="flex flex-col items-center w-screen h-screen p-8 bg-white">
        <img
          tw="h-[260px] w-full rounded border border-gray-300"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
          src={thumbnail}
          alt=""
        />
        <div tw="p-5 flex flex-col items-center">
          <h3 tw="text-black text-3xl">
            {title.length > 30 ? title.slice(0, 30) + "..." : title}
          </h3>
          <p tw="text-gray-800">
            🎵 {artist.length > 30 ? artist.slice(0, 30) + "..." : artist}
          </p>
          <p tw="text-xs">made with yt-tools.vercel.app</p>
        </div>
      </div>
    ),
    {
      emoji: "fluent",
      width: 500,
      height: 500,
    }
  );
}
