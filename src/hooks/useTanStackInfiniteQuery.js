import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchFeedPage } from "../services/apiPublications";

export default function useTanStackInfiniteQuery(uniId) {
  return useInfiniteQuery({
    queryKey: ["publications", uniId],
    enabled: !!uniId,
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      fetchFeedPage({
        cursor: pageParam,
        limit: 5,
      }), // call feed_get_page
    getNextPageParam: (lastPage) => lastPage?.at(-1)?.next_cursor ?? undefined,
  });
}
