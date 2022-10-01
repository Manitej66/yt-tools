import NextCors from "nextjs-cors";
import ytdl from "ytdl-core";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error?: string;
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

  const stream = ytdl(url, {
    quality: "lowestaudio",
  });

  stream.on("error", (err) => {
    res.status(500).json({ error: err.message });
  });
  stream.pipe(res);
}
