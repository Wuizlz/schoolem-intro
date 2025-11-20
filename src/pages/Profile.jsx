import { useAuth } from "../hooks/useAuth";
import { useProfileInfoReciever } from "../hooks/useProfileInfoReciever";
import { Outlet } from "react-router-dom";

import Button from "../ui/ui components/Button";
import OwnUserCircle from "../ui/ui components/OwnUserCircle";

import CirclePlusIcon from "../ui/icons/CirclePlusIcon";

export default function Profile() {
  const { profile, user } = useAuth();
  const username = profile?.display_name;
  const name = profile?.full_name;
  const bio = profile?.bio;
  const authorId = user?.id;
  const { data: count, isError, isLoading } = useProfileInfoReciever(authorId);

  return (
    <div className="flex flex-col gap-5">
      <header className="pt-10 flex justify-center">
        <div className="flex flex-row ">
          <div className="mr-30">
            <OwnUserCircle type="profileStyle" />
          </div>

          <div className="flex flex-col ">
            <Button to="/settings" type="primary" className="w-fit size-2"  >
              Edit Profile
            </Button>
            <div className="flex  gap-8 ">
              <div className="flex flex-col">
                <p className="text-amber-50 font-extrabold text-3xl ">
                  {username}
                </p>
                <p className="text-gray-300">{name}</p>
              </div>
              <div className="w-90 my-auto">
                <p className="text-amber-50 font-serif my-auto ">{bio}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 pt-4 text-amber-50">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">
                  {isLoading ? "…" : count ?? 0}
                </span>
                <span className="text-sm uppercase tracking-wide text-amber-200/80">
                  {count === 1 ? "Publication" : "Publications"}
                </span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">0</span>
                  <span className="text-sm uppercase tracking-wide text-amber-200/80">
                    Followers
                  </span>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold">0</span>
                <span className="text-sm uppercase tracking-wide text-amber-200/80">
                  Following
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-3  ">
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
