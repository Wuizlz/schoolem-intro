import { useAuth } from "./useAuth";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createThread } from "../services/apiPublications";

export function useCreateThread() {
  const queryClient = useQueryClient();
  const { user,profile } = useAuth();
  const uniId = profile.uni_id;

  const mutation = useMutation({
    mutationFn: (thread_text) =>
      createThread({ thread_text, authorId: user?.id }),
    onSuccess: () => {
      toast.success("Thread shared!");
      queryClient.invalidateQueries(
        {
          queryKey: ["publications", uniId]
        }
      );
    },
    onError: (error) => {
      console.error("Failed to create thread", error);
      toast.error(error.message ?? "Unable to share Thread right now ");
    },
  });

  return {
    createThreadAsync: mutation.mutateAsync,
    isCreatingThread: mutation.isPending ?? mutation.isLoading,
  };
}
