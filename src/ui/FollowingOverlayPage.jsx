import { useParams } from "react-router-dom";
import useUserFollowings from "../hooks/useUserFollowings";
import FollowingsRow from "./FollowingsRow";

import Spinner from "../ui/ui components/Spinner";
import { useProfileByUsername } from "../hooks/useProfileByUsername";
import { useAuth } from "../hooks/useAuth";

export default function FollowingOverlayPage() {
  const { user } = useAuth();
  const sessionUser = user?.id
  const { username } = useParams();
  

  const { data: followings = [], isLoading } = useUserFollowings(
    username,
    sessionUser
  );

  if (isLoading ) return <Spinner />;

  if (followings.length === 0)
    return (
      <div className="flex h-full justify-center items-center">
        <p className="font-black text-lg text-amber-50">
          Buddy too cool to follow!
        </p>
      </div>
    );

  return (
    <div
      className="flex flex-col "
      style={{
        overflowY: "auto",
        scrollbarWidth: "none", // Firefox
        msOverflowStyle: "none", // IE/Edge
      }}
    >
      <ul className="flex flex-col gap-4  ">
        {followings.map((f) => (
          <FollowingsRow key={f?.relationship_id} user={f} />
        ))}
      </ul>
    </div>
  );
}
