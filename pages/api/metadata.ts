import NextCors from "nextjs-cors";
import ytdl from "ytdl-core";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error?: string;
  title?: string;
  artist?: string;
  thumbnail?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await NextCors(req, res, {
    methods: ["GET"],
    origin: "*",
    optionsSuccessStatus: 200,
  });

  const { url } = (req.query as { url: string }) || "";
  if (!url) {
    res.status(400).json({ error: "No URL provided" });
    return;
  }

  //   get video title, thumbnail, and artist data
  const info = await ytdl.getInfo(url);
  // res.send(info);
  const title = info.videoDetails.title;
  const thumbnail =
    info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 2].url;
  const artist = info.videoDetails.author.name;

  res.status(200).json({ title, thumbnail, artist });
}
