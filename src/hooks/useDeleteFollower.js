import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFollowerApi } from "../services/apiActions";

export default function useDeleteFollower() {
  const queryClient = useQueryClient();
  const { mutate: deleteFollow, isPending } = useMutation({
    mutationFn: ({ sessionUser, follower, username: _username }) =>
      deleteFollowerApi(sessionUser, follower),
    onSuccess: (_data, vars) => {
      queryClient.setQueryData(["profile", vars.sessionUserName], (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          followersCount: (prev.followersCount ?? 0) - 1,
        };
      });
      queryClient.setQueryData(
        ["IsFollowing", vars.follower, vars.sessionUser],
        false,
      );
    },
  });

  return {
    deleteFollow,
    isPending,
  };
}
