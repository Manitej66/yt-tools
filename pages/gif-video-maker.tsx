/* eslint-disable @next/next/no-img-element */
import { ChangeEvent, useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useFfmpeg } from "../context/ffmpeg";
import { generateVideo } from "../utils/generateVideo";
import { HOST_URL } from "../utils/constants";

export default function GifArt() {
  const { ffmpeg, loading } = useFfmpeg();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [emoji, setEmoji] = useState("");
  const [progress, setProgress] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [gif, setGif] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const makeVideo = async () => {
    if (loading || !gif) return;
    setIsLoading(true);
    const result_video_url = await generateVideo(
      ffmpeg,
      `${HOST_URL}/api/audio?url=${url}`,
      setProgress,
      setIsLoading,
      startTime,
      endTime,
      undefined,
      undefined,
      "gif",
      gif.toString()
    );
    setResult(result_video_url);
    scrollToBottom();
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = result;
    a.download = "output.mp4";
    a.click();
  };

  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-3xl">GIF art maker</h1>
      <p className="opacity-75">
        This feature allows you to create a video clip with an GIF and youtube
        audio.
      </p>
      <Input
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        placeholder="YouTube video URL"
      />
      <div className="flex gap-4">
        <Input
          type="number"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setStartTime(Number(e.target.value))
          }
          placeholder="Start time (seconds)"
        />
        <Input
          type="number"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setEndTime(Number(e.target.value))
          }
          placeholder="End time (seconds)"
        />
      </div>
      <p>Choose GIF</p>
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }, (_, i) => i).map((i) => (
          <div key={i} onClick={() => setGif(i + 1)}>
            <img
              className={`w-full h-32 ${
                gif === i + 1 ? "border-4 border-green-200" : ""
              }`}
              src={`/gifs/${i + 1}.gif`}
              alt={`${i}-image`}
            />
          </div>
        ))}
      </div>

      <Button
        disabled={!url || gif < 1 || gif > 4 || progress.length > 0}
        onClick={makeVideo}
      >
        {progress && !isLoading && `Converting ${progress}`}
        {!progress && isLoading && "Generating..."}
        {!progress && !isLoading && "📀 Generate video"}
      </Button>
      <p className="opacity-50 text-sm">{`Conversion doesn't need internet`}</p>
      {result && !progress && (
        <>
          <video
            src={result}
            controls
            className="mx-auto w-full lg:w-96"
            autoPlay
          />
          <Button onClick={download}>Download</Button>
        </>
      )}
      <div ref={ref} />
    </div>
  );
}
