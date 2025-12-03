import useUserPublications from "../../hooks/useUserPublications";
import ProfilePostCard from "./ProfilePostCard";

import { useOutletContext, useParams } from "react-router-dom";

export default function Posts() {
  const { username } = useParams()
  

  const pubType = "post"
  const { data: userPub = [], error } = useUserPublications(username, pubType);


  return (
    <ul className="grid grid-cols-3 md:grid md:grid-cols-3 lg:grid lg:grid-cols-5  ">
      {userPub.map((userPost) => (
        <ProfilePostCard
          profileuserPost={userPost}
          key={userPost.publication_id}
          id={userPost.publications_id}
        />
      ))}
    </ul>
  );
}
