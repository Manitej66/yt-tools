import "../styles/globals.css";
import type { AppProps } from "next/app";
import { FfmpegProvider } from "../context/ffmpeg";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FfmpegProvider>
      <div className="font-satoshi text-white">
        <Header />
        <div className="container max-w-4xl mx-auto p-4 mt-16">
          <Component {...pageProps} />
        </div>
      </div>
      <div>
        <p className="text-center text-sm text-white opacity-70">
          Made with ❤️ by <br />
          <a
            className="underline"
            href="https://www.instagram.com/manitej66/"
            target="_blank"
            rel="noreferrer"
          >
            manitej
          </a>
        </p>
      </div>
    </FfmpegProvider>
  );
}

export default MyApp;
