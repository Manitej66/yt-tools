import { ChangeEvent, useRef, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useFfmpeg } from "../context/ffmpeg";
import { generateVideo } from "../utils/generateVideo";
import { HOST_URL } from "../utils/constants";

export default function AlbumArt() {
  const { ffmpeg, loading } = useFfmpeg();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [progress, setProgress] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const makeVideo = async () => {
    if (loading || !file) return;
    const result_video_url = await generateVideo(
      ffmpeg,
      `${HOST_URL}/api/audio?url=${url}`,
      setProgress,
      setIsLoading,
      file
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
      <h1 className="text-3xl">Album art maker</h1>
      <p className="opacity-75">
        This feature allows you to create a video clip with an image and youtube
        audio.
      </p>
      <Input
        type="text"
        onChange={(e: ChangeEvent<HTMLInputElement>) => setUrl(e.target.value)}
        placeholder="YouTube video URL"
      />

      <div>
        <label className="block mb-2 text-sm">Upload Image</label>
        <Input
          type="file"
          accept="image/jpeg"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </div>

      <Button
        disabled={!url || !file || progress.length > 0}
        onClick={makeVideo}
      >
        {progress ? `Converting ${progress}` : "📀 Generate video"}
      </Button>
      <p className="opacity-50 text-sm">{`Conversion doesn't need internet`}</p>

      {result && (
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
