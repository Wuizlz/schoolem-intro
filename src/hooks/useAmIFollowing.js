import { useQuery } from "@tanstack/react-query";
import { amIfollowing } from "../services/apiActions";

export default function useAmIfollowing(followerId,followeeId)
{
    return useQuery({
        queryKey: ["IsFollowing", followerId, followeeId],
        enabled: !!(followerId && followeeId),
        queryFn: () => amIfollowing(followerId,followeeId)

    })
}