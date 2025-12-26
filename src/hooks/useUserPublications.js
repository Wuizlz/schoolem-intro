import { useQuery } from "@tanstack/react-query";
import { getUserPublications } from "../services/apiProfile";

export default function useUserPublications(username, pubType = "post") {
  const { data, isFetching, error } = useQuery({
    queryKey: ["UserPublications", username],
    enabled: !!username,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryFn: () => getUserPublications(username, pubType),
  });
  return { data, isFetching, error };
}
