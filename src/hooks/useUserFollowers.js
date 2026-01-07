import { useQuery } from "@tanstack/react-query";
import { getUserFollowers } from "../services/apiProfile";

export default function (username) {
  const { data, isLoading } = useQuery({
    queryKey: ["followers", username],
    enabled: !!username,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    queryFn: () => getUserFollowers(username),
  });
  return {
    data,
    isLoading,
  };
}
