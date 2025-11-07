import { useQuery } from "@tanstack/react-query";
import supabase from "../src/services/supabase";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      // Get the authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Not authenticated");

      // Fetch the profile from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      return {
        ...profile,
        email: user.email, // Add email from auth user
        user_metadata: user.user_metadata, // Include metadata
      };
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
