import { Link } from "react-router-dom";

import HeartIcon from "./icons/HeartIcon";
import Button from "./ui components/Button";
import useHandleCommentLike from "../hooks/useHandleCommentLike";
import useHandleCommentUnLike from "../hooks/useHandleCommentUnLike";
import { useQueryClient } from "@tanstack/react-query";
import { memo } from "react";

function UserComment({ data, user, pubId }) {

  
  const commentLiked = data?.comment_liked;
  const queryClient = useQueryClient();

  const commentId = data?.comment_id;

  const { handleCommentLike } = useHandleCommentLike();
  const { handleCommentUnLike } = useHandleCommentUnLike();
  function handleCommentLikeClick(commentId, user) {
    const actorId = user;
    handleCommentLike({ commentId, actorId });
    queryClient.setQueryData(["postId", pubId], (pubData) => {
      if (!pubData) return pubData;
      return {
        ...pubData,
        latest_comments: pubData.latest_comments.map((comment) =>
          comment?.comment_id === commentId
            ? {
                ...comment,
                comment_liked: true,
                comment_likes: (comment?.comment_likes ?? 0) + 1,
              }
            : comment
        ),
      };
    });
  }

  function handleCommentUnLikeClick(commentId, user) {
    const actorId = user;
    handleCommentUnLike({ commentId, actorId });
    queryClient.setQueryData(["postId", pubId], (pubData) => {
      if (!pubData) return pubData;
      return {
        ...pubData,
        latest_comments: pubData.latest_comments.map((comment) =>
          comment?.comment_id === commentId
            ? {
                ...comment,
                comment_liked: false,
                comment_likes: (comment?.comment_likes ?? 0) - 1,
              }
            : comment
        ),
      };
    });
  }
  return (
    <li>
      <div className="flex flex-row gap-2 ">
        <div className="flex shrink-0 h-11 w-11 rounded-full border  p-[3px]   ">
          <img
            src={data?.author?.avatar_url}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <main className="flex flex-col">
          <div className="break-words  ">
            <p className="leading-snug text-md wrap-anywhere">
              <Link to={`/${data?.author?.display_name}`}>
                <span className="text-amber-50 font-extrabold mr-1 ">
                  {data?.author?.display_name}
                </span>
              </Link>
              <span className="text-amber-50 font-extralight">
                {data?.body}
              </span>
            </p>
          </div>

          <div className=" text-gray-400 flex flex-row font-thin text-xs gap-2">
            <p>{data?.relative_created_at || data?.created_at}</p>
            {data?.comment_likes === 0 ? null : (
              <p>
                {data?.comment_likes}{" "}
                <span>{data?.comment_likes === 1 ? "like" : "likes"} </span>
              </p>
            )}
            <p>Reply</p>
          </div>
        </main>

        <div className="flex flex-row ml-auto items-start mt-2">
          {commentLiked ? (
            <Button
              type="iconButton"
              onClick={() => handleCommentUnLikeClick(commentId, user)}
            >
              <HeartIcon className="h-3 w-4" fill="#FFE082" stroke="#FFE082" />
            </Button>
          ) : (
            <Button
              type="iconButton"
              onClick={() => handleCommentLikeClick(commentId, user)}
            >
              <HeartIcon className="h-3 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* <p className="font-thin text-xs text-gray-400">
              {formatRelative(data?.created_at)}
            </p> */}
    </li>
  );
}

export default memo(UserComment);
