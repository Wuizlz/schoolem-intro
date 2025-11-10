import { useQuery } from "@tanstack/react-query";
import { getPostsForUni } from "../services/apiPosts";

export function useGetPostFeed(uniId) {
  const {data, error, isError, isPending  } = useQuery({
    queryKey: ["posts", uniId],
    enabled: !!uniId,
    queryFn: () => getPostsForUni(uniId)
    
  })
  return {data, isPending, isError}
}
