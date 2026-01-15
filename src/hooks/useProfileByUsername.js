import { useQuery } from "@tanstack/react-query";
import { getProfileByUsername } from "../services/apiProfile";
import toast from "react-hot-toast";

export function useProfileByUsername({username}) {
  return useQuery({
    queryKey:["profile", username],
    refetchOnWindowFocus: false,
    enabled: !!username,
    retry: false,
    queryFn: () => getProfileByUsername(username),
    
    
     
  })
}
