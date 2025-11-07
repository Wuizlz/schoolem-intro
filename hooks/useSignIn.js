import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import supabase from "../src/services/supabase";

export function useSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Get the location user was trying to access before being redirected to signin
  const from = location.state?.from?.pathname || "/uni";

  const { mutate: signIn, isPending: isSigningIn } = useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate profile query to fetch fresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      
      toast.success("Welcome back!");
      
      // Redirect to where they were trying to go, or /uni
      navigate(from, { replace: true });
    },
    onError: (error) => {
      console.error("Sign in error:", error);
      toast.error(error.message || "Failed to sign in");
    },
  });

  return { signIn, isSigningIn };
}
