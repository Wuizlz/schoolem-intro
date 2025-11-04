import { useQuery } from "@tanstack/react-query";
import supabase from "../services/supabase";

export default function ProfileQuery(userId) {
 // ------------------------- Profile query ----------------------------------
  // Reads your own profile row. This relies on RLS allowing the current user
  // to select their own row only. We fetch display_name and uni_id for UI.
  
  return useQuery({
    queryKey: ["profile", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, display_name, uni_id")
        .eq("id", userId)
        .single();
      if (error) throw error;
      return data;
    },
  });
}