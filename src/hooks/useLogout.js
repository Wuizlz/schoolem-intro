import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import supabase from "../services/supabase";

export default function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const logout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out");
      navigate("/signin", { replace: true });
    } catch (err) {
      console.error("Failed to sign out", err);
      toast.error(err.message ?? "Failed to sign out");
    } finally {
      setIsLoggingOut(false);
    }
  }, [navigate]);

  return { logout, isLoggingOut };
}
