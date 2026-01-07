import { Link } from "react-router-dom";

export default function FollowersRow({ user }) {
    const username = user?.follower_display_name
  return (
    <li className="flex gap-2 ">
      <div className="h-10 w-10 ">
        <img
          className="h-full w-full rounded-full object-cover"
          src={user?.follower_avatar_url}
        ></img>
      </div>
      <div className="flex flex-col">
        <p className="text-amber-50 text-sm">
          <Link to={`/${username}`}>{user?.follower_display_name}</Link>
        </p>
        <p className="text-amber-50 text-xs">{user?.follower_full_name}</p>
      </div>
    </li>
  );
}
