import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDot } from "react-icons/go";
import { FaRegFileLines } from "react-icons/fa6";
import HeartIcon from "./icons/HeartIcon";
import ThoughtIcon from "./icons/ThoughtIcon";

import Input from "../ui/ui components/Input";

import { Link, NavLink } from "react-router-dom";
import Button from "./ui components/Button";
import useHandleLike from "../hooks/useHandleLike";
import useHandleUnLike from "../hooks/useHandleUnLike";
import { formatRelative } from "../utils/helpers";

export default function UserPost({ publicationData, publicationId, actorId, uniId }) {
  console.log(publicationData)
  
  
  const liked = publicationData?.liked_by_current_user

  const {handleLikeAsync} = useHandleLike();
  const {handleUnLikeAsync } = useHandleUnLike();

  function handleLike(actorId, publicationId, uniId) {
    handleLikeAsync({actorId, publicationId, uniId})
  }

function handleUnLike(actorId, publicationId, uniId){
  handleUnLikeAsync({actorId, publicationId, uniId})
}

  if (publicationData.type === "post") {
    const username = publicationData.display_name;

    return (
      <li className="flex flex-col gap-4 border-t border-gray-800/60 py-6">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full border p-[3px] shadow-[0_0_25px_-10px_rgb(245_158_11)]">
            <img
              src={publicationData.avatar_url}
              className="h-full w-full rounded-full object-cover"
              alt={publicationData.full_name}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm uppercase tracking-wide text-amber-300/70">
              Post
            </p>
            <Link to={username ? `/${username}` : "/"}>
              <p className="text-lg font-semibold text-white">{username}</p>
            </Link>

            <div className="flex items-center gap-1 text-xs text-gray-400">
              <GoDot className="text-[12px]" />
              <span>{formatRelative(publicationData.created_at)}</span>
            </div>
          </div>

          <Button
            type="iconButton"
            className="ml-auto"
            aria-label="Post options"
          >
            <BsThreeDotsVertical color="white" />
          </Button>
        </div>

        <div className="flex flex-col items-center ">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl space-y-4 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_15px_40px_-25px_rgb(245_158_11)]">
            <div className="overflow-hidden rounded-2xl border border-amber-200/30">
              <img
                className="h-full w-full object-cover"
                src={publicationData.pic_url[0]}
                alt="Post media"
              />
            </div>
            <div className="flex items-center gap-2 text-white/90">
              {!liked ? <Button type="iconButton" onClick={() => handleLike(actorId, publicationId, uniId)}>
                <HeartIcon className="h-7 w-8" />
              </Button> : <Button type="iconButton" onClick={() => handleUnLike(actorId, publicationId, uniId)}>
                <HeartIcon className="h-7 w-8" fill="#FFE082" stroke="#FFE082"  />
              </Button> }
              <Button type="iconButton">
                <ThoughtIcon className="h-7 w-8" />
              </Button>
              <div className="ml-auto text-xs uppercase tracking-wide text-gray-400">
                Share the vibe
              </div>
            </div>

            <div className="text-amber-50 break-words">
              <div className="flex gap-1 ">
                <span className="text-amber-50  ">{publicationData.likes_count}</span>
                <span className="text-amber-50  font-extrabold">{publicationData.likes_count === 1 ? "dub" : "dubs"}</span>
              </div>

              <p className="leading-snug">
                <span className="font-extrabold">
                  {publicationData.full_name}
                </span>
                <span className="font-extralight">
                  : {publicationData.caption}
                </span>
              </p>
            </div>

            <div className="text-gray-400 font-extralight flex flex-row  justify-between">
              <Input
                placeholder="Write a comment..."
                styleType="comment"
                className="flex-1"
              />
              <p>Post</p>
            </div>
          </div>
        </div>
      </li>
    );
  } else if (publicationData.type === "thread") {
    const username = publicationData.display_name;
    return (
      <li className="w-full border-t border-gray-800/60 py-6 ">
        <div className="flex gap-3 ">
          <header className="h-14 w-14 rounded-full border p-[3px]">
            <img
              src={publicationData.avatar_url}
              className="h-full w-full rounded-full object-cover"
            />
          </header>

          <div className="flex flex-col flex-1 gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_15px_40px_-25px_rgb(245_158_11)]">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-200">
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
              <Link to={username ? `/${username}` : "/"}>
                <p className="text-lg font-semibold text-white">{username}</p>
              </Link>
              <GoDot className="text-[11px] text-gray-500" />
            </div>

            <div className="text-amber-50 font-extralight leading-relaxed">
              <span className="font-extrabold">
                {publicationData.full_name}
              </span>
              : {publicationData.thread_text}
            </div>
          </div>
        </div>
      </li>
    );
  }
}
