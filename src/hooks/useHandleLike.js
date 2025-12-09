import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleLike } from "../services/apiPublications";
import toast from "react-hot-toast";

export default function useHandleLike() {
  const queryClient = useQueryClient();
  const { mutateAsync: handleLikeAsync } = useMutation({
    mutationFn: ({ actorId, publicationId, uniId }) =>
      handleLike(actorId, publicationId),
    onError: (error) => {
      console.error(error);
      toast.error("Couldn't like");
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
                    liked_by_current_user: true,
                    likes_count: (publication.likes_count ?? 0) + 1,
                  }
                : publication
            )
          ),
        };
      });
    },
  });
  return {
    handleLikeAsync,
  };
}
