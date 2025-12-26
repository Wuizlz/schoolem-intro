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
      <div className="flex h-full w-full items-center justify-center ">
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
    <div className="flex flex-col gap-5 w-full justify-center items-center   ">
      <div className="flex flex-col  items-center  sm:w-10/12 ">
        <header className="pt-10 flex mb-5">
          <div className="flex flex-row ">
            <div className="mr-10 md:mr-10 h-fit flex flex-col">
              <div className="h-30 w-30 md:h-40 md:w-40 lg:h-40 lg:w-40 rounded-full   shadow-[0_0_25px_-10px_rgb(245_158_11)]">
                <img
                  src={avatar}
                  alt={username ?? "Your picture"}
                  className="rounded-full object-cover h-full w-full "
                />
              </div>
            </div>

            <div className="flex flex-col justify-center ">
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
              <div className="flex gap-2 sm:gap-8 items-center  ">
                <div className="flex flex-col ">
                  <p className="text-amber-50 font-extrabold text-sm sm:text-3xl ">
                    {username}
                  </p>
                  <p className="text-gray-300 text-xs sm:text-md whitespace-nowrap">
                    {profile.full_name}
                  </p>
                </div>
              </div>
              <div>
                <ProfileStats
                  data={profile ?? null}
                  isLoading={isLoadingUser}
                />
              </div>
            </div>
          </div>
        </header>
        <div className=" text-center    ">
          <ProfileBio bio={profile.bio} />
        </div>
        <div className="flex flex-col gap-3 items-center">
          {/* <div className="flex  ">
            <h1 className="text-amber-50 text-2xl font-light italic font-crimson">
              Quickie Collage
            </h1>
          </div> */}
          <div className="flex">
            <div className="flex">
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
    </div>
  );
}
