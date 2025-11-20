import { GoDot } from "react-icons/go";
import { useAuth } from "../hooks/useAuth";
import { useGetPublicationsFeed } from "../hooks/useGetPublicationsFeed";
import UserPost from "./UserPost";

import { PostSkeleton } from "./SkeletonLine";
export default function UniFeed() {
  const { profile, isLoading: authLoading } = useAuth();
  const uniId = profile?.uni_id;

  const {
    data: publications = [],
    isPending,
    isError,
    error,
  } = useGetPublicationsFeed(uniId);
  const hasData = !!publications?.length;
  const isInitialLoading = (authLoading && !uniId) || (isPending && !hasData);

  if (isInitialLoading)
    return (
      <ul className="flex flex-col gap-15">
        {[...Array(3)].map(() => (
          <PostSkeleton />
        ))}
      </ul>
    );
  return (
    <ul className="flex flex-col gap-15 ">
      {publications.map((publications) => (
        <UserPost
          publicationData={publications}
          key={publications.publication_id}
          publicationId={publications.publication_id}
        />
      ))}
    </ul>
  );
}
