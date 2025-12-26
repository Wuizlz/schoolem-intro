import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUnLike } from "../services/apiPublications";
import toast from "react-hot-toast";

export default function useHandleUnLike() {
  const queryClient = useQueryClient();
  const { mutate: mutateHandleUnlike } = useMutation({
    mutationFn: ({ actorId, publicationId, uniId }) =>
      handleUnLike(actorId, publicationId),
    
    onError: (error) => {
      console.error(error);
      toast.error("Couldn't unlike");
    },

  });
  return {
    mutateHandleUnlike,
  };
}
