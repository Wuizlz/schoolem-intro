import React, { useState } from "react"
import Input from "./Input";
import Button from "./Button";
import useHandleComment from "../../hooks/useHandleComment";

export const CommentForm = React.memo(function CommentForm({publicationId, user, uniId})
{
    const [userComment, setUserComment] = useState("");
    const { handleCommentApi } = useHandleComment();
    
      function handleComment(e, userComment) {
        e.preventDefault();
        const actorId = user;
        handleCommentApi({ publicationId, actorId, userComment, uniId });
        setUserComment("");
      }
    
    return (
        <form onSubmit={(e) => handleComment(e, userComment)}>
              <div className="text-gray-400 font-extralight flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Write a comment..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    styleType="comment"
                    className="w-full"
                  />
                </div>
                {userComment === "" ? null : (
                  <Button type="commentButton" buttonType="submit">
                    Post
                  </Button>
                )}
              </div>
            </form>
    )
})