import { GoDot } from "react-icons/go";


import { useAuth } from "../hooks/useAuth";
// import { useGetPublicationsFeed } from "../hooks/useGetPublicationsFeed";
import UserPost from "./UserPost";

import { PostSkeleton } from "./SkeletonLine";
import Spinner from "../ui/ui components/Spinner"

import useTanStackInfiniteQuery from "../hooks/useTanStackInfiniteQuery";
import { useEffect, useRef } from "react";
export default function UniFeed() {
  const { profile, isLoading: authLoading } = useAuth();
  const actorId = profile?.id ?? null;
  const uniId = profile?.uni_id;

  // const {
  //   data: publications = [],
  //   isPending,
  //   isError,
  //   error,
  // } = useGetPublicationsFeed(uniId);

  const {
    data: items,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPending,
    isError: isIniniteQueryError,
  } = useTanStackInfiniteQuery(uniId);
  const publications = items?.pages.flat() ?? [];
  const sentinelRef = useRef(null);
  const hasData = !!publications?.length;
  const isInitialLoading = (authLoading && !uniId) || (isPending && !hasData);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isInitialLoading)
    return (
      <ul className="flex flex-col gap-15 w-full  ">
        {[...Array(3)].map((_,idx) => (
          <PostSkeleton key={idx} />
        ))}
      </ul>
    );
  return (
    <ul className="flex flex-col gap-5 w-full ">
      {publications.map((publications) => (
        <UserPost
          uniId={uniId}
          actorId={actorId}
          publicationData={publications}
          key={publications.publication_id}
          publicationId={publications.publication_id}
        />
      ))}{" "}
      <li ref={sentinelRef} />
      {isFetchingNextPage ? <Spinner/> : null}
    </ul>
  );
}
