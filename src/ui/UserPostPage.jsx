import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useReceivePubData from "../hooks/useReceivePubData";
import Spinner from "./ui components/Spinner";
import UserComment from "./UserComment";
import HeartIcon from "./icons/HeartIcon";
import ThoughtIcon from "./icons/ThoughtIcon";
import Button from "./ui components/Button";
import useHandleLike from "../hooks/useHandleLike";
import useHandleUnLike from "../hooks/useHandleUnLike";



import { useQueryClient } from "@tanstack/react-query";
import { CommentForm } from "./ui components/CommentForm";

export default function UserPostPage() {

  const { profile } = useAuth();
  const user = profile?.id;
  const uniId = profile?.uni_id;
  const { postId } = useParams();
  const { data, isLoading, error } = useReceivePubData(user, postId);
  const comments = data?.latest_comments;
  const liked = data?.liked_by_current_user;
  const publicationId = data?.publication_id;
  const queryClient = useQueryClient();




  const { mutateHandleLike } = useHandleLike();
  const { mutateHandleUnlike } = useHandleUnLike();

  function handleLike(actorId, publicationId, uniId) {
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

  function handleUnLike(actorId, publicationId, uniId) {
    mutateHandleUnlike({ actorId, publicationId, uniId });
    mutateHandleUnlike({ actorId, publicationId, uniId });
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
            liked_by_current_user: false, // or false for unlike
            likes_count: (p.likes_count ?? 0) - 1, // or + 1
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

  

  const firstPic = data?.post?.pic_url[0];

  if (isLoading) return <Spinner />;
  if (error) return <p>Failed to load</p>;

  return (
    <div className=" grid sm:grid-cols-[1fr_1fr] md:grid-cols-[2fr_1fr] sm:gap-2 md:gap-4  ">
      <div className="hidden sm:flex sm:flex-1 sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[80vh] bg-black  ">
        {firstPic && (
          <img
            src={firstPic}
            className="h-full w-full rounded-lg object-contain  "
          ></img>
        )}
      </div>
      <div className="overflow-y-scroll max-h-[80vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[80vh] grid sm:grid-rows-[auto_1fr_auto_auto]">
        <div className="flex flex-row items-center ">
          <div className="h-14 w-14 flex-none rounded-full border p-[3px] ">
            <img
              src={data?.author?.avatar_url}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <Link to={`/${data?.author?.display_name ?? "404"}`}>
            <p className="font-extrabold text-amber-50 justify-center wrap-anywhere  ">
              {data?.author?.display_name}
            </p>
          </Link>
        </div>

        <div className="flex flex-col break-words mb-4 overflow-y-auto my-4    ">
          <p className="leading-snug text-md">
            <span className="text-amber-50 font-extrabold">
              {data?.author?.full_name}
            </span>
            <span className="text-amber-50 font-extralight">
              : {data?.post?.caption}
            </span>
          </p>
          <span className="font-thin text-xs text-gray-400">
            {(data?.relative_created_at)}
          </span>
          {data?.comments_count === 0 ? (
            <p className="text-amber-50 h-full flex justify-center items-center font-extrabold ">
              Be the first to comment!
            </p>
          ) : (
            <ul className="flex flex-col gap-5 mt-1">
              {comments.map((comment) => (
                <UserComment
                  key={comment?.comment_id}
                  data={comment}
                  pubId = {publicationId}
                  user={user}
                />
              ))}
            </ul>
          )}
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row w-full h-fit ">
            {!liked ? (
              <Button
                type="iconButton"
                onClick={() => handleLike(user, publicationId, uniId)}
              >
                <HeartIcon className="h-7 w-8" />
              </Button>
            ) : (
              <Button
                type="iconButton"
                onClick={() => handleUnLike(user, publicationId, uniId)}
              >
                {" "}
                <HeartIcon
                  className="h-7 w-8"
                  fill="#FFE082"
                  stroke="#FFE082"
                />{" "}
              </Button>
            )}
            <ThoughtIcon className="h-7 w-8" />
          </div>
          <div className="flex flex-row">
            <p className="text-amber-50 ">
              <span>{data?.likes_count}</span>
              {
                <span className="font-bold">
                  {" "}
                  {data?.likes_count === 1 ? "like" : "likes"}
                </span>
              }
            </p>
          </div>

          <div className="flex flex-row">
            <p className="text-amber-50">
              <span>{data?.comments_count} </span>
              <span className="font-bold">
                {data?.comments_count === 1 ? "comment" : "comments"}
              </span>
            </p>
          </div>

          <div>
            <CommentForm publicationId={publicationId} user={user} uniId={uniId} />
          </div>
        </div>
      </div>
    </div>
  );
}
