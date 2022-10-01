import { fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { HOST_URL } from "./constants";

interface Progress {
  duration: number;
  ratio: number;
  time: number;
}

export const generateVideo = async (
  ffmpeg: FFmpeg,
  audioUrl: string,
  setProgress: (progress: string) => void,
  setIsLoading: (isLoading: boolean) => void,
  file?: File,
  emoji?: string
) => {
  let step = 0;
  let duration = 0;
  // create image into ffmpeg
  if (file) {
    ffmpeg.FS("writeFile", "image1.jpeg", await fetchFile(file!));
    await ffmpeg.run("-i", "image1.jpeg", "-vf", "scale=300:200", "image.jpeg");
  }
  if (emoji)
    ffmpeg.FS(
      "writeFile",
      `emoji.jpeg`,
      await fetchFile(
        `${HOST_URL}/api/emoji-to-image?emoji=${emoji.split("~")[0]}&color=${
          emoji.split("~")[1]
        }`
      )
    );

  // create audio into ffmpeg
  ffmpeg.FS("writeFile", "audio.mp3", await fetchFile(audioUrl));

  //   @ts-ignore
  ffmpeg.setProgress((p: Progress) => {
    step += 1;
    if (step === 2) {
      duration = Math.ceil(p.duration);
      setIsLoading(false);
    }
    if (step > 3) {
      if (`${Math.round((p.time * 100) / duration)}%` === "NaN%")
        setProgress("");
      else if (Math.round((p.time * 100) / duration) > 100) setProgress("");
      else setProgress(`${Math.round((p.time * 100) / duration)}%`);
    }
  });

  // run ffmpeg command
  await ffmpeg.run(
    "-loop",
    "1",
    "-y",
    "-i",
    file ? "image.jpeg" : "emoji.jpeg",
    "-i",
    "audio.mp3",
    "-shortest",
    "output.mp4"
  );

  // read the output video
  const data2 = ffmpeg.FS("readFile", "output.mp4");

  // create a URL
  const op_url = URL.createObjectURL(
    new Blob([data2.buffer], { type: "video/mp4" })
  );

  //   remove the files from ffmpeg
  ffmpeg.FS("unlink", file ? "image.jpeg" : "emoji.jpeg");
  ffmpeg.FS("unlink", "audio.mp3");
  ffmpeg.FS("unlink", "output.mp4");

  return op_url;
};
