import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFollower } from "../services/apiActions";
import toast from "react-hot-toast";

export default function useHandleFollow() {
  const queryClient = useQueryClient();
  const {
    mutate: createFollowerAsync,
    error,
    isPending,
  } = useMutation({
    mutationFn: ({ followerId, followeeId, username }) =>
      createFollower(followerId, followeeId, username),
    //invalidate alerts tab
    onError: (error) => {
      console.error(error);
      toast.error("Couldn't follow, try again later");
    },
    //mutationFn passes arguments into onSuccess too
    onSuccess: (_data, vars) => {
      queryClient.setQueryData(["profile", vars.username], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followersCount: (prev.followersCount ?? 0) + 1,
        };
      });

      queryClient.setQueryData(
        ["IsFollowing", vars.followerId, vars.followeeId],
        true
      );
    },
  });
  return {
    createFollowerAsync,
    isPending,
  };
}
