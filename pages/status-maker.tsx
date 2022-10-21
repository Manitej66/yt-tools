import { ChangeEvent, useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useFfmpeg } from "../context/ffmpeg";
import { generateVideo } from "../utils/generateVideo";
import { HOST_URL } from "../utils/constants";
import { HexColorPicker } from "react-colorful";
import { generateStatus } from "../utils/generateStatus";

export default function StatusArt() {
  const { ffmpeg, loading } = useFfmpeg();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [emoji, setEmoji] = useState("");
  const [progress, setProgress] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const makeVideo = async () => {
    if (loading) return;
    setIsLoading(true);

    const { title, thumbnail, artist } = await (
      await fetch(`/api/metadata?url=${url}`)
    ).json();

    const result_video_url = await generateStatus(
      ffmpeg,
      `${HOST_URL}/api/audio?url=${url}`,
      setProgress,
      setIsLoading,
      startTime,
      endTime,
      `${HOST_URL}/api/music-card?title=${title}&thumbnail=${thumbnail}&artist=${artist}`
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
      <h1 className="text-3xl">Status maker</h1>
      <p className="opacity-75">
        This feature allows you to create a video clip with an music player and
        youtube audio.
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
      <Button disabled={!url || progress.length > 0} onClick={makeVideo}>
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
