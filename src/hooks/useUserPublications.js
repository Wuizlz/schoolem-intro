import { useQuery } from "@tanstack/react-query";
import { getUserPublications } from "../services/apiProfile";

export default function useUserPublications(username, pubType = "post"  )
{
    const {data, error} =  useQuery({
        queryKey:["UserPublications", username],
        enabled: !!username,
        queryFn: () => getUserPublications(username, pubType )

    }) 
    return {data,error}
}