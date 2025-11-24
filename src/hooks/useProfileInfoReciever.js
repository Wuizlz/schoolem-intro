import { useQuery } from "@tanstack/react-query";
import { getPublicationCountByAuth } from "../services/apiPublications";

export function useProfileInfoReciever(authorId, type)
{
    return useQuery({
        queryKey: ['publicationCount', authorId, type],
        enabled: !!authorId,
        queryFn: () => getPublicationCountByAuth(authorId, type)
        
    })
}