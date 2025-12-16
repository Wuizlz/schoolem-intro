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

  const comments = data?.latest_comments ?? [];
  const firstPic = data?.post?.pic_url?.[0];

  if (isLoading) return <Spinner />;
  if (error) return <p className="text-[var(--color-grey-900)]">Failed to load</p>;

  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Media */}
        <div className="w-full rounded-2xl overflow-hidden border border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
          {firstPic ? (
            <img
              src={firstPic}
              alt="Post media"
              className="w-full max-h-[80vh] object-contain"
            />
          ) : (
            <div className="p-6 text-[var(--color-grey-500)]">No media</div>
          )}
        </div>

        {/* Right side */}
        <div className="w-full rounded-2xl border border-[var(--color-grey-200)] bg-[var(--color-grey-0)] p-4">
          <div className="flex flex-col max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-[var(--color-grey-200)]">
              <div className="h-12 w-12 rounded-full border border-[var(--color-grey-200)] p-[2px] bg-[var(--color-grey-50)]">
                <img
                  src={data?.author?.avatar_url}
                  alt={data?.author?.display_name || "Author"}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              <div className="flex flex-col">
                <p className="font-extrabold text-[var(--color-grey-900)] leading-tight">
                  {data?.author?.display_name}
                </p>
                <span className="text-xs text-[var(--color-grey-500)]">
                  {formatRelative(data?.created_at)}
                </span>
              </div>
            </div>

            {/* Caption */}
            <div className="py-4">
              <p className="leading-snug text-md text-[var(--color-grey-900)] break-words">
                <span className="font-extrabold text-[var(--color-grey-900)]">
                  {data?.author?.full_name}
                </span>
                <span className="text-[var(--color-grey-700)] font-light">
                  {" "}
                  {data?.post?.caption ? `: ${data.post.caption}` : ""}
                </span>
              </p>
            </div>

            {/* Comments */}
            <div className="pt-2">
              {comments.length === 0 ? (
                <p className="text-sm text-[var(--color-grey-500)]">
                  No comments yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-6">
                  {comments.map((comment) => (
                    <UserComment key={comment?.comment_id} data={comment} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}