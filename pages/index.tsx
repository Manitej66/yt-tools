import type { NextPage } from "next";
import HeroCard from "../components/HeroCard";
import { AlbumIcon, CropIcon, EmojiIcon } from "../components/icons";
import { RouteLinks } from "../types/RouteLinks";

const Links: RouteLinks[] = [
  {
    id: 1,
    name: "Album art maker",
    href: "/album-art-maker",
    icon: <AlbumIcon className="w-6 h-6" />,
  },
  {
    id: 2,
    name: "Emoji video maker",
    href: "/emoji-video-maker",
    icon: <EmojiIcon className="w-6 h-6" />,
  },
  {
    id: 3,
    name: "Status maker",
    href: "/status-maker",
    icon: <CropIcon className="w-6 h-6" />,
    disabled: true,
  },
];

const Home: NextPage = () => {
  return (
    <div>
      <h1 className="text-xl">Available tools</h1>
      <div className="flex flex-col items-center space-y-4 w-full mt-4">
        {Links.map((link) => (
          <HeroCard data={link} key={link.id} />
        ))}
      </div>
    </div>
  );
};

export default Home;
