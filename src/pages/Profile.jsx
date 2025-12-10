import { useAuth } from "../hooks/useAuth";
import { useProfileByUsername } from "../hooks/useProfileByUsername";
import { Outlet, useParams } from "react-router-dom";

import Button from "../ui/ui components/Button";
import OwnUserCircle from "../ui/ui components/OwnUserCircle";
import Spinner from "../ui/ui components/Spinner";

import CirclePlusIcon from "../ui/icons/CirclePlusIcon";
import ProfileStats from "../ui/ui components/ProfileStats";
import ProfileBio from "../ui/profile/ProfileBio";

import useHandleFollow from "../hooks/useHandleFollow";
import supabase from "../services/supabase";
import useAmIfollowing from "../hooks/useAmIFollowing";
import useHandleUnfollow from "../hooks/useHandleUnfollow";

export default function Profile() {
  const { profile: sessionUser } = useAuth();
  const currentUserId = sessionUser?.id ?? null;

  const { username } = useParams();
  const {
    data,
    isLoading: isLoadingUser,
    error,
  } = useProfileByUsername({ username });
  const { createFollowerAsync, isPending } = useHandleFollow();
  const { removeFollowAsync, isPending: removingFollower } =
    useHandleUnfollow();

  const viewedUserId = data?.id ?? null;
  const isViewerUser =
    currentUserId && viewedUserId ? currentUserId === viewedUserId : false;

  const profile = data ?? {};
  const avatar = profile?.avatar_url ?? "";

  function handleFollow(currentUserId, viewedUserId, username) {
    console.log(username);
    createFollowerAsync({
      followerId: currentUserId,
      followeeId: viewedUserId,
      username,
    });
  }

  function handleUnfollow(currentUserId, viewedUserId, username) {
    removeFollowAsync({
      followerId: currentUserId,
      followeeId: viewedUserId,
      username,
    });
  }

  const { data: isFollowing, isLoading: isFollowingLoading } = useAmIfollowing(
    currentUserId,
    viewedUserId
  );

  const showSpinnerLoader = isFollowingLoading || isLoadingUser;

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-80 w-100 flex flex-col rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950  shadow-[0_15px_40px_-25px_rgb(245_158_11)]">
          <div className="flex flex-col h-full text-amber-50 items-center justify-center">
            <h1 className=" font-extrabold text-xl">
              Oops... account not found
            </h1>

            <img
              src="sadschoolem3.png"
              className=" h-32 w-32 max-w-full object-contain"
            ></img>
          </div>
        </div>
      </div>
    );

  if (showSpinnerLoader) return <Spinner />;

  return (
    <div className="flex flex-col gap-5 ">
      <header className="pt-10 flex justify-center sm:justify-start  lg:justify-center ">
        <div className="flex flex-row ">
          <div className="mr-2 md:mr-25 h-fit flex flex-col">
            <div className="h-25 w-25 md:h-35 md:w-35 lg:h-40 lg:w-40 rounded-full  p-[3px] shadow-[0_0_25px_-10px_rgb(245_158_11)]">
              <img
                src={avatar}
                alt={username ?? "Your picture"}
                className="rounded-full object-cover h-full w-full "
              />
            </div>
          </div>

          <div className="flex flex-col ">
            <div className="w-fit">
              {isViewerUser ? (
                <Button
                  to="/settings"
                  type="primary"
                  className=" h-5 min-w-[122px] "
                >
                  Edit Profile
                </Button>
              ) : isFollowing === false ? (
                <Button
                  type="primary"
                  onClick={() =>
                    handleFollow(currentUserId, viewedUserId, username)
                  }
                  className="h-5 min-w-[92px] "
                >
                  {isPending ? <Spinner type="buttonSpinner" /> : "Follow"}
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() =>
                    handleUnfollow(currentUserId, viewedUserId, username)
                  }
                  className="h-5 min-w-[107px] bg-gray-500"
                >
                  {removingFollower ? (
                    <Spinner type="buttonSpinner" />
                  ) : (
                    "Unfollow"
                  )}
                </Button>
              )}
            </div>
            <div className="flex gap-4 sm:gap-8  ">
              <div className="flex flex-col ">
                <p className="text-amber-50 font-extrabold text-xl sm:text-3xl ">
                  {username}
                </p>
                <p className="text-gray-300 text-md whitespace-nowrap">
                  {profile.full_name}
                </p>
              </div>
              <div className=" hidden sm:flex">
                <ProfileBio bio={profile?.bio} />
              </div>

              <div className="flex sm:hidden  ">
                <ProfileStats data={profile ?? null} isLoading={isLoadingUser} />
              </div>
            </div>
            <div className="hidden sm:block">
              <ProfileStats isLoading={isLoadingUser} data={profile ?? null} />
            </div>
          </div>
        </div>
      </header>
      <div className="block text-center sm:hidden  ">
        <ProfileBio bio={profile.bio} />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex self-center ">
          <h1 className="text-amber-50 text-2xl font-light italic font-crimson">
            Quickie Collage
          </h1>
        </div>
        <div className="flex flex-row self-center   ">
          <div className="flex flex-col">
            <CirclePlusIcon
              aria-hidden="true"
              className="h-[4.9rem] w-[4.9rem] shrink-0 text-grey-50 transition-colors duration-300"
              fillColor="#000"
              outlineColor="#5b5757"
            />
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}
