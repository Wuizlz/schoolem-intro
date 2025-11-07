import { useQuery } from "@tanstack/react-query";
import { getUni } from "../services/apiUni";

export default function useUniReciever(uniId) {
  const {
    isPending,
    data: uni,
    error,
  } = useQuery({
    queryKey: ["universities", uniId],
    enabled: !!uniId,
    queryFn: () => getUni(uniId),
    staleTime: Infinity,
    cacheTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return { isPending, uni, error };
}
