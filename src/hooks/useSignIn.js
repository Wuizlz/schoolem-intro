// src/hooks/useSignIn.js
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import supabase from "../services/supabase";

/**
 * useSignIn
 * - Password sign-in
 * - If email isn't verified, automatically resends confirmation
 * - Ensures profile (if provided) and redirects on success
 *
 * @param {{ ensureProfileFn?: () => Promise<any>, redirectTo?: string }} opts
 */
export default function useSignIn({
  ensureProfileFn,
  redirectTo = "/uni",
} = {}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState(null);

  const signIn = useCallback(
    async ({ email, password }) => {
      setIsLoading(true);
      setLastError(null);

      try {
        

        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (typeof ensureProfileFn === "function") {
          await ensureProfileFn();
        }

        navigate(redirectTo);
      } catch (e) {
        const msg = e?.message || "Sign in failed";
        setLastError(msg);

        // Common case: account exists but email isn't confirmed yet.
        if (/confirm/i.test(msg) && /email/i.test(msg)) {
          try {
            await supabase.auth.resend({
              type: "signup",
              email,
              options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
              },
            });
            toast.success(
              "Your email isn't verified yet. I sent a new confirmation link."
            );
            return;
          } catch (resendErr) {
            toast.error(
              resendErr?.message || "Couldn't resend the confirmation email."
            );
            return;
          }
        }

        toast.error(msg);
        console.error(e);
      } finally {
        
        setIsLoading(false);
      }
    },
    [ensureProfileFn, navigate, redirectTo]
  );

  return { signIn, isLoading, lastError };
}
