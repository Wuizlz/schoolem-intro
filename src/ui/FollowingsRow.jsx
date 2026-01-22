import { Link, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProfileByUsername } from "../hooks/useProfileByUsername";
import useAmIfollowing from "../hooks/useAmIFollowing";
import useHandleUnfollow from "../hooks/useHandleUnfollow";
import useHandleFollow from "../hooks/useHandleFollow";
import Button from "./ui components/Button";
import Spinner from "./ui components/Spinner";
import { SkeletonFollowerFollowingRow, SkeletonLine } from "./SkeletonLine";

export default function FollowingsRow({ user, sessionUser }) {
  const sessionUserUserName = sessionUser.user_metadata.display_name;


  const currentUser = sessionUser?.id ?? null;
  const username = user?.followee_display_name;
  const actedOnUser = user?.followee_id;
  const { data: isFollowing, isLoading: isFollowingLoading } = useAmIfollowing(
    currentUser,
    actedOnUser
  );

  const displayButtonIfNotSessionUser = currentUser === actedOnUser;

  const { createFollowerAsync, isPending } = useHandleFollow();
  const { removeFollowAsync, isPending: removingFollower } =
    useHandleUnfollow();

  function handleFollow(currentUserId, viewedUserId, username) {
    createFollowerAsync({
      followerId: currentUserId,
      followeeId: viewedUserId,
      username,
      sessionUserUserName
    });
  }

  function handleUnfollow(currentUserId, viewedUserId, username) {
    removeFollowAsync({
      followerId: currentUserId,
      followeeId: viewedUserId,
      sessionUserUserName,
    });
  }

  const yep = true;

  if (isFollowingLoading) return <SkeletonFollowerFollowingRow />;

  return (
    <li className="flex gap-2 ">
      <Link to={`/${username}`} className="flex gap-2">
        <div className="h-10 w-10 ">
          <img
            className="h-full w-full rounded-full object-cover"
            src={user?.followee_avatar_url}
          ></img>
        </div>

        <div className="flex flex-col">
          <p className="text-amber-50 text-sm">{user?.followee_display_name}</p>
          <p className="text-amber-50 text-xs">{user?.followee_full_name}</p>
        </div>
      </Link>
      <div className="ml-auto">
        {!displayButtonIfNotSessionUser ? (
          isFollowing === false ? (
            <Button
              type="primary"
              onClick={() => handleFollow(currentUser, actedOnUser, username)}
              className="h-5 w-18 "
            >
              {isPending ? <Spinner type="buttonSpinner" /> : "Follow"}
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={() => handleUnfollow(currentUser, actedOnUser, username)}
              className="h-5 w-18 bg-gray-500"
            >
              {removingFollower ? (
                <Spinner type="buttonSpinner" />
              ) : (
                "Following"
              )}
            </Button>
          )
        ) : (
          ""
        )}
      </div>
    </li>
  );
}
