import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { deleteFollowerApi } from "../services/apiActions";

export default function useDeleteFollower() {
  const queryClient = useQueryClient();
  const { mutate: deleteFollow, isPending } = useMutation({
    mutationFn: ({ sessionUser, follower, sessionUserName }) =>
      deleteFollowerApi(sessionUser, follower),
    onSuccess: (_data, vars) => {
      queryClient.setQueryData(["profile", vars.sessionUserName], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followersCount: (prev.followersCount ?? 0) - 1,
        };
      });
      queryClient.invalidateQueries({
        queryKey: ["IsFollowing", vars.follower, vars.sessionUser],
      });
    },
  });

  return {
    deleteFollow,
    isPending,
  };
}
