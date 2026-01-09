import { useQuery } from "@tanstack/react-query";
import { getUserFollowers } from "../services/apiProfile";

export default function (username, sessionUser) {
  const { data, isLoading } = useQuery({
    queryKey: ["followers", username],
    enabled: !!(username && sessionUser),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () => getUserFollowers(username, sessionUser),
  });
  return {
    data,
    isLoading,
  };
}
