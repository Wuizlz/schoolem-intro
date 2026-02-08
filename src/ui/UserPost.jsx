import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDot } from "react-icons/go";
import { FaRegFileLines } from "react-icons/fa6";
import HeartIcon from "./icons/HeartIcon";
import ThoughtIcon from "./icons/ThoughtIcon";

import Input from "../ui/ui components/Input";
import Button from "./ui components/Button";

import { Link, NavLink, useLocation } from "react-router-dom";
import { memo, useState } from "react";

import useHandleLike from "../hooks/useHandleLike";
import useHandleUnLike from "../hooks/useHandleUnLike";
import { formatRelative } from "../utils/helpers";
import useHandleComment from "../hooks/useHandleComment";
import { useQueryClient } from "@tanstack/react-query";
import { CommentForm } from "./ui components/CommentForm";
import { ThreadContent } from "./ui components/ThreadContent";

function UserPost({
  publicationData,
  publicationId,
  actorId,
  uniId,
}) {
  const location = useLocation();

  const queryClient = useQueryClient();

  const liked = publicationData?.liked_by_current_user;

  const { mutateHandleLike } = useHandleLike();
  const { mutateHandleUnlike } = useHandleUnLike();

  function handleClickLike(actorId, publicationId, uniId) {
    mutateHandleLike({ actorId, publicationId, uniId });
    queryClient.setQueryData(["publications", uniId], (prev) => {
      // Optimize cache update: only rebuild the page that contains the target post.
      // Previously every page got a new array reference, forcing unnecessary re-renders.

      if (!prev) return prev;
      let changed = false;

      const pages = prev.pages.map((page) => {
        if (!page.some((p) => p.publication_id === publicationId)) return page;

        const nextPage = page.map((p) => {
          if (p.publication_id !== publicationId) return p; // same ref
          changed = true;
          return {
            ...p,
            liked_by_current_user: true, // or false for unlike
            likes_count: (p.likes_count ?? 0) + 1, // or -1
          };
        });
        return nextPage;
      });

      if (!changed) return prev;
      return { ...prev, pages };
    });

    queryClient.setQueryData(["postId", publicationId], (postCache) => {
      if (!postCache) return postCache;
      return {
        ...postCache,
        liked_by_current_user: true,
        likes_count: (postCache?.likes_count ?? 0) + 1,
      };
    });
  }

  function handleClickUnlike(actorId, publicationId, uniId) {
    mutateHandleUnlike({ actorId, publicationId, uniId });
    queryClient.setQueryData(["publications", uniId], (prev) => {
      if (!prev) return prev;
      let changed = false;

      const pages = prev.pages.map((page) => {
        if (!page.some((p) => p.publication_id === publicationId)) return page;

        const nextPage = page.map((p) => {
          if (p.publication_id !== publicationId) return p; // same ref
          changed = true;
          return {
            ...p,
            liked_by_current_user: false, // or false for unlike
            likes_count: (p.likes_count ?? 0) - 1, // or +1
          };
        });
        return nextPage;
      });

      if (!changed) return prev;
      return { ...prev, pages };
    });

    queryClient.setQueryData(["postId", publicationId], (postCache) => {
      if (!postCache) return postCache;
      return {
        ...postCache,
        liked_by_current_user: false,
        likes_count: (postCache.likes_count ?? 0) - 1,
      };
    });
  }

  if (publicationData.type === "post") {
    const username = publicationData.display_name;

    const firstPic = publicationData.pic_url?.[0];

    return (
      <li className="flex flex-col gap-4 border-t border-gray-800/60   ">
        <div className="flex flex-col  ">
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
                <span>{publicationData?.relative_created_at}</span>
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

          <div className=" space-y-4 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_15px_40px_-25px_rgb(245_158_11)]">
            <div className="h-120   overflow-hidden rounded-2xl border border-amber-200/30">
              {firstPic && (
                <img
                  className="h-full w-full object-contain "
                  src={firstPic}
                  alt="Post media"
                />
              )}
            </div>
            <div className="flex items-center gap-2 text-white/90">
              {!liked ? (
                <Button
                  type="iconButton"
                  onClick={() => handleClickLike(actorId, publicationId, uniId)}
                >
                  <HeartIcon className="h-7 w-8" />
                </Button>
              ) : (
                <Button
                  type="iconButton"
                  onClick={() =>
                    handleClickUnlike(actorId, publicationId, uniId)
                  }
                >
                  <HeartIcon
                    className="h-7 w-8"
                    fill="#FFE082"
                    stroke="#FFE082"
                  />
                </Button>
              )}
              <span className="text-amber-50 text-sm">
                {publicationData?.likes_count}
              </span>
              <Link
                to={`/p/${publicationId}`}
                state={{ backgroundLocation: location }}
              >
                <ThoughtIcon className="h-7 w-8 transition-transform hover:scale-105 hover:cursor-pointer" />
              </Link>
              <span className="text-amber-50 text-sm">
                {publicationData?.comments_count}
              </span>
            </div>

            <div className="text-amber-50 break-words">
              <p className="leading-snug">
                <span className="font-extrabold">
                  {publicationData?.full_name}
                </span>
                <span className="font-extralight">
                  : {publicationData?.caption}
                </span>
              </p>
            </div>
            <div>
              <CommentForm
                publicationId={publicationId}
                user={actorId}
                uniId={uniId}
              />
            </div>
          </div>
        </div>
      </li>
    );
  } else if (publicationData.type === "thread") {
    const username = publicationData?.display_name;

    return (
      <li className="border-t border-gray-800/60  ">
        <div className="flex gap-3 pt-4  ">
          <div className="flex flex-col flex-1  gap-3 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-[0_15px_40px_-25px_rgb(245_158_11)]  ">
            <header className="flex flex-row gap-2 ">
              <div className="h-14 w-14 rounded-full border p-[3px]">
                <img
                  src={publicationData?.avatar_url}
                  className="h-full w-full  rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col ">
                <span className="text-indigo-200 text-sm">Thread</span>
                <Link to={username ? `/${username}` : "/"}>
                  <p className="text-lg font-semibold text-white">{username}</p>
                </Link>
                <span className="flex text-gray-300 text-xs items-center">
                  <GoDot /> {publicationData?.relative_created_at}
                </span>
              </div>
              <Button
                type="iconButton"
                className="ml-auto text-lg text-gray-300 hover:text-white"
                aria-label="Thread options"
              >
                <BsThreeDotsVertical />
              </Button>
            </header>

            <div>
              <ThreadContent publicationData={publicationData} />
            </div>

            <div className="flex gap-2  ">
              <div className="flex flex-col items-center">
                {!liked ? (
                  <Button
                    type="iconButton"
                    onClick={() =>
                      handleClickLike(actorId, publicationId, uniId)
                    }
                  >
                    <HeartIcon className="h-6 w-7" />
                  </Button>
                ) : (
                  <Button
                    type="iconButton"
                    onClick={() =>
                      handleClickUnlike(actorId, publicationId, uniId)
                    }
                  >
                    <HeartIcon
                      fill="#FFE082"
                      stroke="#FFE082"
                      className="h-6 w-7"
                    />
                  </Button>
                )}
                <span className="text-amber-50">
                  {publicationData?.likes_count}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <Button type="iconButton">
                  <ThoughtIcon className="h-6 w-7" />
                </Button>
                <span className="text-amber-50">
                  {publicationData?.comments_count}
                </span>
              </div>
              <div className="w-full">
                <CommentForm
                  publicationId={publicationId}
                  user={actorId}
                  uniId={uniId}
                />
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default memo(UserPost)
