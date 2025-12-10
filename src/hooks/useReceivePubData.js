import { useQuery } from "@tanstack/react-query";
import { receivePubData } from "../services/apiPublications";

export default function useReceivePubData( user, postId) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["postId", postId],
    enabled: !!(user && postId),
    queryFn: () => receivePubData(user, postId),
  });

  return { data, error, isLoading };
}
