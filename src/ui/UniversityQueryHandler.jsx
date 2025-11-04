import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";
import ProfileQuery from "./ProfileQueryHandler";


export default function UniversityQuery(uniId) {
  // ------------------------- University query -------------------------------
  // If profile has a uni_id, we look up the university for its name/domains.
  return useQuery({
    queryKey: ["university", uniId],
    enabled: Boolean(uniId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("universities")
        .select("id, name, domains")
        .eq("id", uniId)
        .single();
      if (error) throw error;
      return data;
    },
  });
}
