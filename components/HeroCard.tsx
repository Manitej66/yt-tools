import Link from "next/link";
import { RouteLinks } from "../types/RouteLinks";

export default function HeroCard({ data }: { data: RouteLinks }) {
  return (
    <Link href={data.disabled ? "#" : data.href}>
      <a
        className={`border border-slate-600 shadow rounded p-4 w-full flex items-center space-x-2 opacity-80 relative`}
      >
        {data.icon}
        <h1>{data.name}</h1>
        {data.disabled && (
          <p className="absolute right-2 top-2 bg-slate-800 py-1 px-2 text-xs rounded">
            Coming soon
          </p>
        )}
      </a>
    </Link>
  );
}
