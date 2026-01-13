import useUserPublications from "../../hooks/useUserPublications";
import ProfilePostCard from "./ProfilePostCard";
import Spinner from "../ui components/Spinner";

import {
  Link,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";

export default function Posts() {
  const location = useLocation();
  const { username } = useParams();

  const pubType = "post";
  const {
    data: userPub = [],
    isFetching,
    error,
  } = useUserPublications(username, pubType);

  if (isFetching) return <Spinner />;

  return (
    <ul className=" grid grid-cols-3 md:grid md:grid-cols-4   ">
      {userPub.map((userPost) => (
        <Link key={userPost?.publication_id} to={`/p/${userPost?.publication_id}`} state={{backgroundLocation : location}} className="flex">
          <ProfilePostCard
            profileuserPost={userPost}
            key={userPost?.publication_id}
            id={userPost?.publication_id}
          />
        </Link>
      ))}
    </ul>
  );
}
