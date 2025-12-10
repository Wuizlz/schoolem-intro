import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createComment} from "../services/apiPublications";

export default function () {
  const queryClient = useQueryClient()
  const { mutateAsync: handleCommentAsync } = useMutation({
    mutationFn: ({publicationId, actorId, userComment}) => createComment(publicationId,actorId,userComment),
    onSuccess: (_data,vars) =>
    {
        toast.success("comment created")  
        queryClient.invalidateQueries({
          queryKey: ["postId", vars.publicationId]
        })
       
 

        
    },
    onError: () =>
    {
        toast.error("cant create")
    }
  });

  return {
    handleCommentAsync
  }
}
