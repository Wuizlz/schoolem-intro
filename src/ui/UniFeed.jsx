import { GoDot } from "react-icons/go";
import { useAuth } from "../hooks/useAuth";
import { useGetPostFeed } from "../hooks/useGetPostFeed";
import UserPost from "./UserPost";
export default function UniFeed() {
  const { profile } = useAuth();
  const uniId = profile?.uni_id;

  const { data: posts = [], isPending, isError, error } = useGetPostFeed(uniId);

  return (
    <ul className="flex flex-col gap-15 ">
   
        {posts.map((post) => (
          <UserPost postData={post} key={post.publications.publication_id} />
        ))}

    </ul>
  );
}
