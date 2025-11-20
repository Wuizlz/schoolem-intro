import { useAuth } from "../../hooks/useAuth";
import useUserPublications from "../../hooks/useUserPublications";
import ProfilePostCard from "./ProfilePostCard";

export default function Posts() {
  const { user } = useAuth();
  const author_id = user?.id;
  const pubType = "post"
  const { data: userPub = [], error } = useUserPublications(author_id, pubType);
  console.log(userPub)

  return (
    <ul className="md:grid md:grid-cols-3 lg:grid lg:grid-cols-4  ">
      {userPub.map((userPost) => (
        <ProfilePostCard
          profileuserPost={userPost}
          key={userPub.publication_id}
          id={userPub.publications_id}
        />
      ))}
    </ul>
  );
}
