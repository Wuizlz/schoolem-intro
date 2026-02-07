import { CiHeart } from "react-icons/ci";
import ThoughtIcon from "../icons/ThoughtIcon";
import HeartIcon from "../icons/HeartIcon";

export default function ProfilePostCard({ profileuserPost, id }) {
  const userPostUrl = profileuserPost?.post?.pic_url[0];

  return (
    <li className="relative  w-full">
      <div className="aspect-square w-full  overflow-hidden rounded-lg border">
        <img
          src={userPostUrl}
          className="h-full w-full object-cover block "
          alt="User post"
        ></img>
      </div>
      <div className="absolute top-2 left-2 flex flex-col gap-1 bg-black/30 py-1 rounded text-white text-sm">
        <div className="flex items-center gap-1">
          <HeartIcon className="h-4 w-5" />
          <span>{profileuserPost?.likes_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <ThoughtIcon className="h-4 w-5" />
          <span>{profileuserPost?.comments_count}</span>
        </div>
      </div>
    </li>
  );
}
