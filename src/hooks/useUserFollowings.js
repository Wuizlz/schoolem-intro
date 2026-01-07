import { useQuery } from "@tanstack/react-query";
import { getUserFollowings } from "../services/apiProfile";

export default function useUserFollowings(username)
{
    const  {data, isLoading} = useQuery(
        {
            queryKey: ["user", username],
            enabled: !!(username),
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            queryFn: () => getUserFollowings(username)

        }
    )

    return {
        data, isLoading
    }
}