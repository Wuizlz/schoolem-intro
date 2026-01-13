import { useParams } from "react-router-dom";
import useUserFollowers from "../hooks/useUserFollowers";
import FollowersRow from "./FollowersRow";
import Spinner from "./ui components/Spinner";
import { useAuth } from "../hooks/useAuth";
import { SkeletonFollowerFollowingRow } from "./SkeletonLine";

export default function FollowersOverlayPage() {
  const { user, profile } = useAuth();
  const { username } = useParams();
  const sessionUser = user?.id;
  const sessionUserDisplayName = profile?.display_name;

  const isSessionUser = sessionUserDisplayName === username;

  const { data: followers = [], isLoading } = useUserFollowers(
    username,
    sessionUser
  );



  if (isLoading)
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner/>
      </div>
    );

  if (followers.length === 0)
    return (
      <div className="flex h-full justify-center items-center">
        <p className="font-black text-lg text-amber-50">
          Buddy got no friends!
        </p>
      </div>
    );

  return (
    <div
      className="flex flex-col"
      style={{
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      <ul className="flex flex-col gap-4 ">
        {followers.map((f) => (
          <FollowersRow
            isSessionUser={isSessionUser}
            sessionUser={sessionUser}
            key={f?.relationship_id}
            user={f}
          />
        ))}
      </ul>
    </div>
  );
}
