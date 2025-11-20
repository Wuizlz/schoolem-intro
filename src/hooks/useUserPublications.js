import { useQuery } from "@tanstack/react-query";
import { getUserPublications } from "../services/apiProfile";

export default function useUserPublications(author_id, pubType = "post"  )
{
    const {data, error} =  useQuery({
        queryKey:["publications", author_id],
        enabled: !!author_id,
        queryFn: () => getUserPublications(author_id, pubType )

    }) 
    return {data,error}
}