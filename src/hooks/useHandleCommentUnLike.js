import { useMutation } from "@tanstack/react-query";
import { deleteCommentLike } from "../services/apiPublications";
import toast from "react-hot-toast";

export default function useHandleCommentUnLike() {
  const { mutate: handleCommentUnLike, error } = useMutation({
    mutationFn: ({ commentId, actorId }) =>
      deleteCommentLike(commentId, actorId),
    
  });
  
  return {
    handleCommentUnLike
  }
}
