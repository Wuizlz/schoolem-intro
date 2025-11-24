import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDot } from "react-icons/go";
import { FaRegFileLines } from "react-icons/fa6";
import ThoughtIcon from "./ui components/ThoughtIcon";
import HeartIcon from "./ui components/HeartIcon";

export default function UserPost({ publicationData, publicationId }) {
  const formatRelative = (dateString) => {
    if (!dateString) return "";
    const now = Date.now();
    const then = new Date(dateString).getTime();
    const diff = Math.max(0, now - then);
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const author = publicationData.profiles;

  if (publicationData.type === "post") {
    const postData = publicationData.posts;

    return (
      <li className="flex flex-col gap-4 border-t border-gray-800/60 py-6">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full border p-[3px] shadow-[0_0_25px_-10px_rgb(245_158_11)]">
            <img
              src={author.avatar_url}
              className="h-full w-full rounded-full object-cover"
              alt={author.full_name}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm uppercase tracking-wide text-amber-300/70">
              Post
            </p>
            <p className="text-lg font-semibold text-white">
              {author.display_name}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <GoDot className="text-[12px]" />
              <span>{formatRelative(publicationData.created_at)}</span>
            </div>
          </div>

          <button
            className="ml-auto rounded-full p-1.5 text-xl text-gray-300 hover:text-white"
            aria-label="Post options"
          >
            <BsThreeDotsVertical />
          </button>
        </div>

        <div className="flex flex-col items-center ">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl space-y-4 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_15px_40px_-25px_rgb(245_158_11)]">
            <div className="overflow-hidden rounded-2xl border border-amber-200/30">
              <img
                className="h-full w-full object-cover"
                src={postData.pic_url[0]}
                alt="Post media"
              />
            </div>
            <div className="flex items-center gap-2 text-white/90">
              <button className="text-2xl transition-transform hover:scale-105">
                <HeartIcon className="h-7 w-8"   />
              </button>
              <button className="text-xl transition-transform hover:scale-105">
                <ThoughtIcon className="h-7 w-8"/>
              </button>
              <div className="ml-auto text-xs uppercase tracking-wide text-gray-400">
                Share the vibe
              </div>
            </div>
            <div className="text-amber-50 break-words">
              <p className="leading-snug">
                <span className="font-extrabold">{author.full_name}</span>
                <span className="font-extralight">: {postData.caption}</span>
              </p>
            </div>
          </div>
        </div>
      </li>
    );
  } else if (publicationData.type === "thread") {
    return (
      <li className="w-full border-t border-gray-800/60 py-6 ">
        <div className="flex gap-3 ">
          <header className="h-14 w-14 rounded-full border p-[3px]">
            <img
              src={author.avatar_url}
              className="h-full w-full rounded-full object-cover"
            />
          </header>

          <div className="flex flex-col flex-1 gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_15px_40px_-25px_rgb(245_158_11)]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-200">
              <FaRegFileLines className="text-sm" />
              <span>Thread</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">
                {formatRelative(publicationData.created_at)}
              </span>

              <button
                className="ml-auto text-lg text-gray-300 hover:text-white"
                aria-label="Thread options"
              >
                <BsThreeDotsVertical />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-semibold">
                {author.display_name}
              </p>
              <GoDot className="text-[11px] text-gray-500" />
            </div>

            <div className="text-amber-50 font-extralight leading-relaxed">
              <span className="font-extrabold">{author.full_name}</span>:{" "}
              {publicationData.threads.thread_text}
            </div>
          </div>
        </div>
      </li>
    );
  }
}
