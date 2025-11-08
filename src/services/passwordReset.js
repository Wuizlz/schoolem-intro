import { useCallback } from "react";
import { toast } from "react-hot-toast";
import supabase from "./supabase";

export default function usePasswordReset() {
  const sendResetEmail = useCallback(
    async ({ email, onMissingEmail, onSuccess, onError } = {}) => {
      if (!email) {
        const message = "Enter your email address to reset your password.";
        onMissingEmail?.(message);
        toast.error("Enter your email to reset your password.");
        return { ok: false, error: message };
      }
      try {
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/UpdatePassword`
            : undefined;

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo,
        });

        if (error) throw error;

        toast.success("Password reset link sent to your email!");
        onSuccess?.();
        return { ok: true };
      } catch (err) {
        console.error(err);
        const errorMessage =
          err?.message || "Failed to send password reset email.";
        toast.error(errorMessage);
        onError?.(errorMessage);
        return { ok: false, error: errorMessage };
      }
    },
    []
  );

  return { sendResetEmail };
}
