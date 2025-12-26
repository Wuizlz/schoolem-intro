import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createComment } from "../services/apiPublications";
import { formatRelative } from "../utils/helpers";

export default function () {
  const queryClient = useQueryClient();
  const { mutate: handleCommentApi } = useMutation({
    mutationFn: ({ publicationId, actorId, userComment, uniId }) =>
      createComment(publicationId, actorId, userComment),
    /*data is received from createCommment which returns data of inital body, author, comment id, created at, 
    and parent comment of the individual comment  then left join on author using author id to 
     return revelant data of author display name,url,and id */
    onSuccess: (data, vars) => {
      const rel = formatRelative(data?.created_at) || "";

      const newComment = {
        body: data.body,
        author: {
          id: data.author.id,
          avatar_url: data.author.avatar_url,
          display_name: data.author.display_name,
        },
        author_id: data.id,
        comment_id: data.comment_id,
        created_at: rel,
        parent_comment_id: data.parent_comment_id,
      };
      toast.success("comment created");
      queryClient.setQueryData(["postId", vars.publicationId], (prev) => {
        if (!prev) return prev;

        const nextComments = [
          newComment,
          ...(prev.latest_comments || []),
        ].slice(0, 50);
        // If you only ever prepend, this always changes; otherwise check for dupes.

        return {
          ...prev,
          comments_count: (prev.comments_count ?? 0) + 1,
          latest_comments: nextComments,
        };
      });

      queryClient.setQueryData(["publications", vars.uniId], (cache) => {
        if (!cache) return cache;
        return {
          ...cache,
          pages: cache.pages.map((page) =>
            page.map((publication) =>
              publication.publication_id === vars.publicationId
                ? {
                    ...publication,
                    comments_count: (publication?.comments_count ?? 0) + 1,
                  }
                : publication
            )
          ),
        };
      });
    },
    onError: () => {
      toast.error("cant create");
    },
  });

  return {
    handleCommentApi,
  };
}
