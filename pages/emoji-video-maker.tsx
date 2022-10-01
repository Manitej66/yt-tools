import { ChangeEvent, useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useFfmpeg } from "../context/ffmpeg";
import { generateVideo } from "../utils/generateVideo";
import { HOST_URL } from "../utils/constants";
import { HexColorPicker } from "react-colorful";

export default function EmojiArt() {
  const { ffmpeg, loading } = useFfmpeg();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [emoji, setEmoji] = useState("");
  const [progress, setProgress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const makeVideo = async () => {
    if (loading) return;
    setIsLoading(true);
    const result_video_url = await generateVideo(
      ffmpeg,
      `${HOST_URL}/api/audio?url=${url}`,
      setProgress,
      setIsLoading,
      undefined,
      `${emoji}~${color.slice(1)}`
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
      <h1 className="text-3xl">Emoji art maker</h1>
      <p className="opacity-75">
        This feature allows you to create a video clip with an emoji and youtube
        audio.
      </p>
      <Input
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        placeholder="YouTube video URL"
      />
      <Input
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmoji(e.target.value)
        }
        placeholder="Enter emoji(s)"
        maxLength={10}
      />
      <p>Choose background color</p>
      <HexColorPicker color={color} onChange={setColor} />
      <Button
        disabled={!url || !emoji || progress.length > 0}
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
          <div ref={ref} />
        </>
      )}
    </div>
  );
}
