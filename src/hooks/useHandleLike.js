import { useMutation } from "@tanstack/react-query";
import { handleLike } from "../services/apiPublications";
import toast from "react-hot-toast";

export default function useHandleLike() {
  const { mutate: mutateHandleLike } = useMutation({
    mutationFn: ({ actorId, publicationId, uniId: _uniId }) =>
      handleLike(actorId, publicationId),

    onError: (error) => {
      console.error(error);
      toast.error("Couldn't like");
    },
  });
  return {
    mutateHandleLike,
  };
}
