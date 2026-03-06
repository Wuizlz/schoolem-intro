import useUserPublications from "../../hooks/useUserPublications";
import ProfilePostCard from "./ProfilePostCard";
import Spinner from "../common/Spinner";

import { Link, useLocation, useParams } from "react-router-dom";

export default function Posts() {
  const location = useLocation();
  const { username } = useParams();

  const pubType = "post";
  const { data: userPub = [], isFetching } = useUserPublications(
    username,
    pubType,
  );

  if (isFetching) return <Spinner />;

  return (
    <ul className=" grid grid-cols-3 md:grid md:grid-cols-4   ">
      {userPub.map((userPost) => (
        <Link
          key={userPost?.publication_id}
          to={`/p/${userPost?.publication_id}`}
          state={{ backgroundLocation: location }}
          className="block w-full"
        >
          <ProfilePostCard
            profileuserPost={userPost}
            key={userPost?.publication_id}
          />
        </Link>
      ))}
    </ul>
  );
}
