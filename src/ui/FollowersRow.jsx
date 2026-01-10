import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "./ui components/Button";
import useAmIfollowing from "../hooks/useAmIFollowing";
import useHandleFollow from "../hooks/useHandleFollow";
import useHandleUnfollow from "../hooks/useHandleUnfollow";
import Spinner from "./ui components/Spinner";
import useDeleteFollower from "../hooks/useDeleteFollower";
import { useState } from "react";

export default function FollowersRow({ user, isSessionUser, sessionUser }) {
  const username = user?.follower_display_name;
  const followerId = user?.follower_id;

  const { data: isFollowing, isLoading } = useAmIfollowing(
    sessionUser,
    followerId
  );

  const { data: isFollower, isLoading: isFollowerLoading } = useAmIfollowing(
    followerId,
    sessionUser
  );

  const isFollowerUser = sessionUser === followerId;
  const { deleteFollow, isPending: deleting } = useDeleteFollower();
  const { createFollowerAsync, isPending: following } = useHandleFollow();
  const { removeFollowAsync, isPending: removing } = useHandleUnfollow();

  const handleFollower = (sessionUser, followerId, username) => {
    createFollowerAsync({
      followerId: sessionUser,
      followeeId: followerId,
      username,
    });
  };

  const handleRemoveFollower = (sessionUser, followerId, username) => {
    removeFollowAsync({
      followerId: sessionUser,
      followeeId: followerId,
      username,
    });
  };

  const handleDeleteFollower = (sessionUser, followerId, username) => {
    deleteFollow({
      sessionUser: sessionUser,
      follower: followerId,
      username,
    });
  };

  return (
    <li className="flex gap-2 ">
      <Link to={`/${username}`} className="flex gap-2">
        <div className="h-10 w-10 ">
          <img
            className="h-full w-full rounded-full object-cover"
            src={user?.follower_avatar_url}
          ></img>
        </div>
        <div className="flex flex-col">
          <p className="text-amber-50 text-sm">{user?.follower_display_name}</p>
          <p className="text-amber-50 text-xs">{user?.follower_full_name}</p>
        </div>
      </Link>

      <div className="ml-auto">
        {isSessionUser ? (
          isFollower === false ? (
            <Button className="h-5 w-18 bg-gray-500" disabled={true}>
              Deleted
            </Button>
          ) : (
            <Button
              className="h-5 w-18"
              onClick={() =>
                handleDeleteFollower(sessionUser, followerId, username)
              }
            >
              {deleting ? <Spinner type="buttonSpinner" /> : <p>Delete</p>}
            </Button>
          )
        ) : !isFollowerUser ? (
          !isFollowing ? (
            <Button
              type="primary"
              className="h-5 w-18"
              onClick={() => handleFollower(sessionUser, followerId, username)}
            >
              {following ? <Spinner type="buttonSpinner" /> : <p>Follow </p>}
            </Button>
          ) : (
            <Button
              type="primary"
              className="h-5 w-18 bg-gray-500"
              onClick={() =>
                handleRemoveFollower(sessionUser, followerId, username)
              }
            >
              {removing ? <Spinner type="buttonSpinner" /> : <p>Following</p>}
            </Button>
          )
        ) : (
          ""
        )}
      </div>
    </li>
  );
}
