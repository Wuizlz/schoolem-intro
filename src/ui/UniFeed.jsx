import UserPost from "./UserPost";
import { PostSkeleton } from "./SkeletonLine";
import Spinner from "../ui/ui components/Spinner";
import useTanStackInfiniteQuery from "../hooks/useTanStackInfiniteQuery";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useRef } from "react";

export default function UniFeed() {
  const { profile, isLoading: authLoading } = useAuth();
  const actorId = profile?.id ?? null;
  const uniId = profile?.uni_id;

  const {
    data: items,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPending,
    isError,
  } = useTanStackInfiniteQuery(uniId);

  const publications = items?.pages.flat() ?? [];
  const sentinelRef = useRef(null);

  const hasData = publications.length > 0;
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

  if (isInitialLoading) {
    return (
      <ul className="flex flex-col gap-15">
        {Array.from({ length: 3 }).map((_, idx) => (
          <PostSkeleton key={idx} />
        ))}
      </ul>
    );
  }

  // optional: show a friendly empty state
  if (!hasData && !isPending && !isFetchingNextPage && !isError) {
    return (
      <div className="rounded-2xl border border-[var(--color-grey-200)] bg-[var(--color-grey-0)] p-6 text-[var(--color-grey-500)]">
        No posts yet. Be the first to post something.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-15">
      {publications.map((pub) => (
        <UserPost
          uniId={uniId}
          actorId={actorId}
          publicationData={pub}
          key={pub.publication_id}
          publicationId={pub.publication_id}
        />
      ))}

      <li ref={sentinelRef} />

      {isFetchingNextPage ? (
        <li className="py-6">
          <Spinner />
        </li>
      ) : null}
    </ul>
  );
}