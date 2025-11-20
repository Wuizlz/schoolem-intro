import { CiHeart } from "react-icons/ci";
import ThoughtIcon from "../ui components/ThoughtIcon";
import HeartIcon from "../ui components/HeartIcon";


export default function ProfilePostCard({ profileuserPost, id }) {
  const userPostUrl = profileuserPost.post.pic_url;
  return (
    <li className="relative">
      <img
        src={userPostUrl}
        className="h-full object-cover border rounded-lg"
        alt="User post"
      ></img>
      <div className="absolute top-2 left-2 flex flex-col gap-1 bg-black/30 py-1 rounded text-white text-sm">
        <div className="flex items-center gap-1">
          <HeartIcon className="h-4 w-5"/>
          <span>0</span>
        </div>
        <div className="flex items-center gap-1">
            <ThoughtIcon className="h-4 w-5" />
            <span>0</span>
        </div>
      </div>
    </li>
  );
}
