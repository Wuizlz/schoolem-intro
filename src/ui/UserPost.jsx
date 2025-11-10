import { BsThreeDotsVertical } from "react-icons/bs";
import { CiHeart } from "react-icons/ci";
import { GoDot } from "react-icons/go";
import { TfiThought } from "react-icons/tfi";

export default function UserPost({ postData, id }) {
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
  const author = postData.publications.profiles;
  const publications = postData.publications;
  return (
    <li className=" flex-row w-full ">
      <div className="flex">
        <header className="h-12 w-12 rounded-full border p-[3px]">
          <img src={author.avatar_url} className="rounded-full" />
        </header>
        <div className=" flex-row">
          <div className="flex">
            <GoDot  className="text-[13px] my-auto text-gray-600 " />

            <p className="text-gray-600 text-[12px] pl-[1px]">
              {formatRelative(publications.created_at)}
            </p>
          </div>
          <p className="text-white font-bold pl-[1px] text-[16px]">
            {author.display_name}
          </p>
        </div>
        <button className="ml-auto text-[20px]">
          <BsThreeDotsVertical color="white"></BsThreeDotsVertical>
        </button>
      </div>

      <div className="flex justify-center  ">
        <div className="flex-row w-96 ">
          <div className="flex border border-gray-500">
            <img className="w-96" src={postData.pic_url}></img>
          </div>
          <div className="flex">
            <div className="flex text-2xl items-center gap-1 leading-none" >
              <CiHeart color="white" className="my-1 h-8 w-8   " />
              <TfiThought color="white" className="my-1 h-8 w-6 " />
            </div>
          </div>

          <div className="flex">
            <p className="text-amber-50 my-1">
              <span className="font-extrabold">{author.full_name}</span>: {postData.caption}
            </p>
          </div>
        </div>
      </div>
    </li>
  );
}
