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
  start: number,
  end: number,
  file?: File,
  emoji?: string,
  type?: string,
  gif?: string
) => {
  let step = 0;
  let duration = 0;
  // create image into ffmpeg
  if (file) {
    ffmpeg.FS("writeFile", "image1.jpeg", await fetchFile(file!));
    await ffmpeg.run("-i", "image1.jpeg", "-vf", "scale=300:200", "image.jpeg");
  } else if (emoji)
    ffmpeg.FS(
      "writeFile",
      `emoji.jpeg`,
      await fetchFile(
        `${HOST_URL}/api/emoji-to-image?emoji=${emoji.split("~")[0]}&color=${
          emoji.split("~")[1]
        }`
      )
    );
  else if (type === "gif")
    ffmpeg.FS(
      "writeFile",
      `image.gif`,
      await fetchFile(`${HOST_URL}/gifs/${gif}.gif`)
    );

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

  // merge looped gif and audio into video
  if (type === "gif") {
    await ffmpeg.run(
      "-stream_loop",
      "-1",
      "-i",
      "image.gif",
      "-i",
      "audio.mp3",
      "-shortest",
      "output.mp4"
    );
  } else {
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
  }

  // read the output video
  const data2 = ffmpeg.FS("readFile", "output.mp4");

  // create a URL
  const op_url = URL.createObjectURL(
    new Blob([data2.buffer], { type: "video/mp4" })
  );

  //   remove the files from ffmpeg
  if (file) {
    if (type === "gif") {
      ffmpeg.FS("unlink", "image.gif");
    } else {
      ffmpeg.FS("unlink", "image1.jpeg");
      ffmpeg.FS("unlink", "image.jpeg");
    }
  }
  ffmpeg.FS("unlink", "audio.mp3");
  ffmpeg.FS("unlink", "temp_audio.mp3");
  ffmpeg.FS("unlink", "output.mp4");

  return op_url;
};
