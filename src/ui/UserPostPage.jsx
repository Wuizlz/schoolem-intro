import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import useReceivePubData from "../hooks/useReceivePubData";
import Spinner from "./ui components/Spinner";
import { formatRelative } from "../hooks/useFormatRelative";
import UserComment from "./UserComment";

export default function UserPostPage() {
  const { profile } = useAuth();
  const user = profile?.id;
  const { postId } = useParams();
  const { data, isLoading, error } = useReceivePubData(user, postId);
  console.log(data)
  const comments = data?.latest_comments;
  const firstPic = data?.post?.pic_url?.[0];
  if (isLoading) return <Spinner />;
  if (error) return <p>Failed to load</p>;

  return (
    <div className="grid grid-cols-2 w-full gap-4 max-h-[90vh] overflow-y-auto ">
      <div className="w-full">
        {firstPic && (
          <img
            src={firstPic}
            alt="Post media"
          />
        )}
      </div>
      <div className="w-full">
        <div className="flex flex-col max-h-[65vh] overflow-y-auto">
          <div className="flex flex-row items-center  ">
            <div className="h-14 w-14 rounded-full border p-[3px] ">
              <img
                src={data?.author?.avatar_url}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <p className="font-extrabold text-amber-50 ">
              {data?.author?.display_name}
            </p>
          </div>

          <div className="flex flex-col break-words mb-4   ">
            <p className="leading-snug text-md">
              <span className="text-amber-50 font-extrabold">
                {data?.author?.full_name}
              </span>
              <span className="text-amber-50 font-extralight">
                : {data?.post?.caption}
              </span>
            </p>
            <span className="font-thin text-xs text-gray-400">
              {formatRelative(data?.created_at)}
            </span>
          </div>
          <ul className="flex flex-col gap-8">
            {comments.map((comment) => (
              <UserComment key={comment?.comment_id} data={comment} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
