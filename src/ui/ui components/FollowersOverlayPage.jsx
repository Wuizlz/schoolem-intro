import { useParams } from "react-router-dom";
import useUserFollowers from "../../hooks/useUserFollowers";
import FollowersRow from "../FollowersRow";
import Spinner from "./Spinner";

export default function FollowersOverlayPage() {
  const { username } = useParams()
  const { data: followers = [], isLoading } = useUserFollowers(username);
  console.log(followers)

  if(isLoading) return <Spinner/>

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
                    key={f?.relationship_id}
                    user={f}
                  />
                ))}
              </ul>
            </div>
    )
}
