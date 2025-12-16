import { BsThreeDotsVertical } from "react-icons/bs";
import { GoDot } from "react-icons/go";
import HeartIcon from "./icons/HeartIcon";
import ThoughtIcon from "./icons/ThoughtIcon";

import Input from "../ui/ui components/Input";
import Button from "./ui components/Button";

import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

import useHandleLike from "../hooks/useHandleLike";
import useHandleUnLike from "../hooks/useHandleUnLike";
import { formatRelative } from "../utils/helpers";
import useHandleComment from "../hooks/useHandleComment";

export default function UserPost({ publicationData, publicationId, actorId, uniId }) {
  const location = useLocation();
  const [userComment, setUserComment] = useState("");

  const liked = publicationData?.liked_by_current_user;

  const { handleLikeAsync } = useHandleLike();
  const { handleUnLikeAsync } = useHandleUnLike();
  const { handleCommentAsync } = useHandleComment();

  function handleLike(actorId, publicationId, uniId) {
    handleLikeAsync({ actorId, publicationId, uniId });
  }

  function handleUnLike(actorId, publicationId, uniId) {
    handleUnLikeAsync({ actorId, publicationId, uniId });
  }

  function handleComment(e, comment) {
    e.preventDefault();
    if (!comment.trim()) return;
    handleCommentAsync({ publicationId, actorId, userComment: comment });
    setUserComment("");
  }

  // Shared wrapper styles
  const topBorder = "border-t border-[var(--color-grey-200)]";
  const card =
    "rounded-3xl border border-amber-500/25 bg-[var(--color-grey-0)] p-4 " +
    "shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]";

  if (publicationData?.type === "post") {
    const username = publicationData.display_name;
    const firstPic = publicationData.pic_url?.[0];

    return (
      <li className={`flex flex-col gap-4 ${topBorder} py-6`}>
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full border border-[var(--color-grey-200)] p-[2px] bg-[var(--color-grey-50)] shadow-[0_0_25px_-10px_rgba(245,158,11,0.8)]">
            <img
              src={publicationData.avatar_url}
              className="h-full w-full rounded-full object-cover"
              alt={publicationData.full_name}
            />
          </div>

          <div className="flex flex-col">
            <p className="text-sm uppercase tracking-wide text-[var(--color-accent)]/80">
              Post
            </p>

            <Link to={username ? `/${username}` : "/"}>
              <p className="text-lg font-semibold text-[var(--color-grey-900)]">
                {username}
              </p>
            </Link>

            <div className="flex items-center gap-1 text-xs text-[var(--color-grey-500)]">
              <GoDot className="text-[12px]" />
              <span>{formatRelative(publicationData.created_at)}</span>
            </div>
          </div>

          <Button
            type="iconButton"
            className="ml-auto text-[var(--color-grey-700)]"
            aria-label="Post options"
          >
            <BsThreeDotsVertical />
          </Button>
        </div>

        {/* Card */}
        <div className="flex flex-col items-center">
          <div className={`w-full max-w-sm sm:max-w-md lg:max-w-2xl space-y-4 ${card}`}>
            {/* Media */}
            <div className="overflow-hidden rounded-2xl border border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
              {firstPic ? (
                <img className="h-full w-full object-cover" src={firstPic} alt="Post media" />
              ) : (
                <div className="p-6 text-[var(--color-grey-500)]">No media</div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 text-[var(--color-grey-900)]">
              {!liked ? (
                <Button
                  type="iconButton"
                  onClick={() => handleLike(actorId, publicationId, uniId)}
                  className="text-[var(--color-grey-900)]"
                >
                  <HeartIcon className="h-7 w-8" />
                </Button>
              ) : (
                <Button type="iconButton" onClick={() => handleUnLike(actorId, publicationId, uniId)}>
                  <HeartIcon className="h-7 w-8" fill="#FFE082" stroke="#FFE082" />
                </Button>
              )}

              <Link
                to={`/p/${publicationId}`}
                state={{ backgroundLocation: location }}
                className="inline-flex items-center"
              >
                <ThoughtIcon className="h-7 w-8 transition-transform hover:scale-105 hover:cursor-pointer text-[var(--color-grey-900)]" />
              </Link>

              <div className="ml-auto text-xs uppercase tracking-wide text-[var(--color-grey-500)]">
                Share the vibe
              </div>
            </div>

            {/* Caption */}
            <div className="break-words">
              <div className="flex gap-1">
                <span className="text-[var(--color-grey-700)]">{publicationData.likes_count}</span>
                <span className="font-extrabold text-[var(--color-grey-700)]">
                  {publicationData.likes_count === 1 ? "dub" : "dubs"}
                </span>
              </div>

              <p className="leading-snug">
                <span className="font-extrabold text-[var(--color-grey-900)]">
                  {publicationData.full_name}
                </span>
                <span className="font-light text-[var(--color-grey-700)]">
                  : {publicationData.caption}
                </span>
              </p>
            </div>

            {/* Comment */}
            <form onSubmit={(e) => handleComment(e, userComment)}>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Write a comment..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    styleType="comment"
                    className="w-full"
                  />
                </div>

                {userComment.trim() ? (
                  <Button type="commentButton" buttonType="submit">
                    Post
                  </Button>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </li>
    );
  }

  if (publicationData?.type === "thread") {
    const username = publicationData.display_name;

    return (
      <li className={`w-full ${topBorder} py-6`}>
        <div className="flex gap-3 w-full">
          <header className="h-14 w-14 rounded-full border border-[var(--color-grey-200)] p-[2px] bg-[var(--color-grey-50)]">
            <img
              src={publicationData.avatar_url}
              className="h-full w-full rounded-full object-cover"
              alt={publicationData.full_name}
            />
          </header>

          <div className={`flex flex-col flex-1 gap-3 rounded-2xl border border-amber-500/25 bg-[var(--color-grey-0)] p-4 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.35)]`}>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-[var(--color-grey-500)]">
              <span className="text-[var(--color-accent)]/80">Thread</span>
              <span>•</span>
              <span>{formatRelative(publicationData.created_at)}</span>

              <button
                className="ml-auto text-lg text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
                aria-label="Thread options"
                type="button"
              >
                <BsThreeDotsVertical />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Link to={username ? `/${username}` : "/"}>
                <p className="text-lg font-semibold text-[var(--color-grey-900)]">
                  {username}
                </p>
              </Link>
              <GoDot className="text-[11px] text-[var(--color-grey-400)]" />
            </div>

            <div className="font-light leading-relaxed text-[var(--color-grey-700)]">
              <span className="font-extrabold text-[var(--color-grey-900)]">
                {publicationData.full_name}
              </span>
              <span className="w-full break-words break-all whitespace-pre-wrap">
                : {publicationData.thread_text}
              </span>
            </div>
          </div>
        </div>
      </li>
    );
  }

  return null;
}