import { useMutation } from "@tanstack/react-query";
import { deleteCommentLike } from "../services/apiPublications";

export default function useHandleCommentUnLike() {
  const { mutate: handleCommentUnLike } = useMutation({
    mutationFn: ({ commentId, actorId }) =>
      deleteCommentLike(commentId, actorId),
  });

  return {
    handleCommentUnLike,
  };
}
