import Link from "next/link";
import { ToolsIcon } from "./icons";

/* eslint-disable @next/next/no-html-link-for-pages */
export default function Header() {
  return (
    <nav className="flex justify-between px-4 xl:justify-around items-center h-16 bg-slate-700 fixed top-0 w-full z-10">
      <Link href="/">
        <a className="font-bold flex items-center">
          <ToolsIcon className="w-5 h-5 mr-2" />
          YT Tools
        </a>
      </Link>
      <a href="https://github.com/Manitej66/yt-tools">Github</a>
    </nav>
  );
}
