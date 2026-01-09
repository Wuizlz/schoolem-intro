import { useQuery } from "@tanstack/react-query";
import { getUserFollowings } from "../services/apiProfile";

export default function useUserFollowings(username, sessionUser) {
  const { data, isLoading } = useQuery({
    queryKey: ["user-followings", username, sessionUser],
    enabled: !!(username && sessionUser),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () => getUserFollowings(username, sessionUser),
  });

  return {
    data,
    isLoading,
  };
}
