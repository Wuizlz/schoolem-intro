import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPost } from "../services/apiPublications";
import { useAuth } from "./useAuth";

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation({
    mutationFn: ({ caption, mediaItems }) =>
      createPost({ caption, mediaItems, authorId: user?.id }),
    onSuccess: () => {
      toast.success("Post shared!");
      queryClient.invalidateQueries(["posts"]);
    },
    onError: (error) => {
      console.error("Failed to create post", error);
      toast.error(error.message ?? "Unable to share post right now.");
    },
  });

  return {
    createPost: mutation.mutate,
    createPostAsync: mutation.mutateAsync,
    isCreatingPost: mutation.isPending ?? mutation.isLoading,
  };
}
