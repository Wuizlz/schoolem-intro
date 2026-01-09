import { useQueryClient, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { removeFollow } from "../services/apiActions";


export default function useHandleUnfollow()
{
    const queryClient = useQueryClient();
    const {mutate: removeFollowAsync, error, isPending} = useMutation({
        mutationFn: ({followerId, followeeId}) => removeFollow(followerId,followeeId),
        onError: () => {
            toast.error("Couldn't unfollow, try again later ")
        },
        onSuccess: (_data, vars)=>
        {
            queryClient.setQueryData(["profile", vars.username], (prev) =>
            {
                if(!prev) return prev;
                return{
                    ...prev, followersCount: (prev.followersCount ?? 0) - 1,
                }
            }
            )
            queryClient.invalidateQueries({
                queryKey: ["IsFollowing", vars.followerId, vars.followeeId]
            })
            
        }

    })
    return {
        removeFollowAsync, 
        isPending
    }
}