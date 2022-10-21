import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { HOST_URL } from "./constants";

export const generateStatus = async (
  ffmpeg: FFmpeg,
  audioUrl: string,
  setProgress: (progress: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  start: number,
  end: number,
  url: string
) => {
  let step = 0;
  let duration = 0;
  // create audio into ffmpeg
  ffmpeg.FS("writeFile", "temp_audio.mp3", await fetchFile(audioUrl));

  // trim audio.mp3 to 10 seconds
  await ffmpeg.run(
    "-ss",
    start?.toString(),
    "-i",
    "temp_audio.mp3",
    "-t",
    (end - start).toString(),
    "audio.mp3"
  );
  ffmpeg.FS("writeFile", "status.png", await fetchFile(url));

  //   @ts-ignore
  ffmpeg.setProgress((p: Progress) => {
    if (p.time && p.duration) {
      duration = p.duration;
      const progress = Math.floor((p.time / p.duration) * 100);
      if (progress > step) {
        step = progress;
        setProgress(`${progress}%`);
      }
    }
  });

  //   merge audio.mp3 and status.png with maximum compatibility
  await ffmpeg.run(
    "-loop",
    "1",
    "-y",
    "-i",
    "status.png",
    "-i",
    "audio.mp3",
    "-shortest",
    "-pix_fmt",
    "yuv420p",
    "output.mp4"
  );

  // create blob
  const data = ffmpeg.FS("readFile", "output.mp4");
  const blob = new Blob([data.buffer], { type: "video/mp4" });
  const res_url = URL.createObjectURL(blob);

  setIsLoading(false);
  return res_url;
};
