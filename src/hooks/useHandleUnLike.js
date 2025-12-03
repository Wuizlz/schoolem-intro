import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleUnLike } from "../services/apiPublications";
import toast from "react-hot-toast";

export default function useHandleUnLike() {
  const queryClient = useQueryClient();
  const { mutateAsync: handleUnLikeAsync } = useMutation({
    mutationFn: ({ actorId, publicationId, uniId }) =>
      handleUnLike(actorId, publicationId),
    onError: (error) => {
      console.error(error);
      toast.error("Couldn't unlike");
    },
    onSuccess: (_data, vars) => {
      queryClient.setQueryData(["publications", vars.uniId], (cache) => {
        if (!cache) return cache;
        return {
          ...cache,
          pages: cache.pages.map((page) =>
            page.map((publication) =>
              publication.publication_id === vars.publicationId
                ? {
                    ...publication,
                    liked_by_current_user: false,
                    likes_count: (publication.likes_count ?? 0) - 1,
                  }
                : publication
            )
          ),
        };
      });
    },
  });
  return {
    handleUnLikeAsync,
  };
}
