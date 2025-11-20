import { useQuery } from "@tanstack/react-query";
import { getPostsThreadsForUni } from "../services/apiPublications";

export function useGetPublicationsFeed(uniId) {
  const {data, error, isError, isPending  } = useQuery({
    queryKey: ["publications", uniId],
    enabled: !!uniId,
    queryFn: () => getPostsThreadsForUni(uniId)
    
  })
  return {data, isPending, isError}
}
