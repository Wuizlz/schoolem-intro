import { useAuth } from "../hooks/useAuth";
import { useProfileByUsername } from "../hooks/useProfileByUsername";
import { Outlet, useParams } from "react-router-dom";

import Button from "../ui/ui components/Button";
import Spinner from "../ui/ui components/Spinner";

import CirclePlusIcon from "../ui/icons/CirclePlusIcon";
import ProfileStats from "../ui/ui components/ProfileStats";
import ProfileBio from "../ui/profile/ProfileBio";

import useHandleFollow from "../hooks/useHandleFollow";
import useAmIfollowing from "../hooks/useAmIFollowing";
import useHandleUnfollow from "../hooks/useHandleUnfollow";

export default function Profile() {
  const { profile: sessionUser } = useAuth();
  const currentUserId = sessionUser?.id ?? null;

  const { username } = useParams();
  const { data, isLoading: isLoadingUser, error } = useProfileByUsername({ username });

  const { createFollowerAsync, isPending } = useHandleFollow();
  const { removeFollowAsync, isPending: removingFollower } = useHandleUnfollow();

  const viewedUserId = data?.id ?? null;
  const isViewerUser =
    currentUserId && viewedUserId ? currentUserId === viewedUserId : false;

  const profile = data ?? {};
  const avatar = profile?.avatar_url ?? "";

  function handleFollow(currentUserId, viewedUserId, username) {
    createFollowerAsync({ followerId: currentUserId, followeeId: viewedUserId, username });
  }

  function handleUnfollow(currentUserId, viewedUserId, username) {
    removeFollowAsync({ followerId: currentUserId, followeeId: viewedUserId, username });
  }

  const { data: isFollowing, isLoading: isFollowingLoading } = useAmIfollowing(
    currentUserId,
    viewedUserId
  );

  const showSpinnerLoader = isFollowingLoading || isLoadingUser;

  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center bg-[var(--color-grey-50)]">
        <div className="h-80 w-[25rem] max-w-[92vw] flex flex-col rounded-3xl border border-amber-500/30 bg-[var(--color-grey-0)] shadow-lg">
          <div className="flex flex-col h-full items-center justify-center text-center px-6">
            <h1 className="font-extrabold text-xl text-[var(--color-grey-900)]">
              Oops... account not found
            </h1>

            <img
              src="sadschoolem3.png"
              alt="Not found"
              className="mt-4 h-32 w-32 max-w-full object-contain"
            />

            <p className="mt-4 text-[var(--color-grey-500)]">
              This user may not exist or the link is wrong.
            </p>
          </div>
        </div>
      </div>
    );

  if (showSpinnerLoader) return <Spinner />;

  return (
    <div className="flex flex-col gap-5 text-[var(--color-grey-900)]">
      <header className="pt-10 flex justify-center sm:justify-start lg:justify-center">
        <div className="flex flex-row">
          <div className="mr-2 md:mr-25 h-fit flex flex-col">
            <div className="h-25 w-25 md:h-35 md:w-35 lg:h-40 lg:w-40 rounded-full p-[3px] shadow-[0_0_25px_-10px_rgb(245_158_11)]">
              <img
                src={avatar}
                alt={username ?? "Profile picture"}
                className="rounded-full object-cover h-full w-full"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="w-fit">
              {isViewerUser ? (
                <Button to="/settings" type="primary" className="h-5 min-w-[122px]">
                  Edit Profile
                </Button>
              ) : isFollowing === false ? (
                <Button
                  type="primary"
                  onClick={() => handleFollow(currentUserId, viewedUserId, username)}
                  className="h-5 min-w-[92px]"
                >
                  {isPending ? <Spinner type="buttonSpinner" /> : "Follow"}
                </Button>
              ) : (
                <Button
                  onClick={() => handleUnfollow(currentUserId, viewedUserId, username)}
                  className="h-5 min-w-[107px] bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] hover:bg-[var(--color-grey-200)]"
                >
                  {removingFollower ? <Spinner type="buttonSpinner" /> : "Unfollow"}
                </Button>
              )}
            </div>

            <div className="flex gap-4 sm:gap-8">
              <div className="flex flex-col">
                <p className="text-[var(--color-grey-900)] font-extrabold text-xl sm:text-3xl">
                  {username}
                </p>
                <p className="text-[var(--color-grey-500)] text-md whitespace-nowrap">
                  {profile.full_name}
                </p>
              </div>

              <div className="hidden sm:flex">
                <ProfileBio bio={profile?.bio} />
              </div>

              <div className="flex sm:hidden">
                <ProfileStats data={profile ?? null} isLoading={isLoadingUser} />
              </div>
            </div>

            <div className="hidden sm:block">
              <ProfileStats isLoading={isLoadingUser} data={profile ?? null} />
            </div>
          </div>
        </div>
      </header>

      <div className="block text-center sm:hidden">
        <ProfileBio bio={profile.bio} />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex self-center">
          <h1 className="text-[var(--color-grey-900)] text-2xl font-light italic font-crimson">
            Quickie Collage
          </h1>
        </div>

        <div className="flex flex-row self-center">
          <div className="flex flex-col">
            <CirclePlusIcon
              aria-hidden="true"
              className="h-[4.9rem] w-[4.9rem] shrink-0 text-[var(--color-grey-700)] transition-colors duration-300"
              fillColor="var(--color-grey-900)"
              outlineColor="var(--color-grey-400)"
            />
          </div>
        </div>
      </div>

      <Outlet />
    </div>
  );
}