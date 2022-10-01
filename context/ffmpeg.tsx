import { createFFmpeg, FFmpeg } from "@ffmpeg/ffmpeg";
import {
  ReactNode,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";

let ffmpeg: FFmpeg;

if (typeof window !== "undefined") {
  ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
    log: process.env.NODE_ENV === "development",
  });
}

interface AppContextInterface {
  ffmpeg: FFmpeg;
  loading: boolean;
}

const FfmpegContext = createContext<AppContextInterface | undefined>(undefined);

export const useFfmpeg = () => {
  const context = useContext(FfmpegContext);
  if (context === undefined) {
    throw new Error("useFfmpeg must be used within a FfmpegProvider");
  }
  return context;
};

export const FfmpegProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (ffmpeg && !ffmpeg.isLoaded()) {
      (async () => {
        await ffmpeg.load();
        setLoading(false);
      })();
    }
  }, []);

  if (loading) {
    return <div>Please wait...</div>;
  }

  return (
    <FfmpegContext.Provider
      value={{
        ffmpeg,
        loading,
      }}
    >
      {children}
    </FfmpegContext.Provider>
  );
};
