import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentLike } from "../services/apiPublications";

export default function () {
  const queryClient = useQueryClient();
  const { mutate: handleCommentLike } = useMutation({
    mutationFn: ({ commentId, actorId }) =>
      createCommentLike(commentId, actorId),
  });
  return { handleCommentLike };
}
