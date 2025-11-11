import { useCallback } from "react";
import supabase from "./supabase";

function paramsFrom(raw = "") {
  if (!raw) return new URLSearchParams();
  const trimmed =
    raw.startsWith("#") || raw.startsWith("?") ? raw.slice(1) : raw;
  return new URLSearchParams(trimmed);
}

export default function usePasswordUpdate() {
  const verifyRecoverySession = useCallback(
    async ({ hash, search } = {}) => {
      const hashParams =
        hash !== undefined
          ? paramsFrom(hash)
          : typeof window !== "undefined"
          ? paramsFrom(window.location.hash)
          : new URLSearchParams();

      const searchParams =
        search !== undefined
          ? paramsFrom(search)
          : typeof window !== "undefined"
          ? paramsFrom(window.location.search)
          : new URLSearchParams();

      const typeParam =
        hashParams.get("type")?.toLowerCase() ||
        searchParams.get("type")?.toLowerCase() ||
        "";

      if (typeParam && typeParam !== "recovery") {
        throw new Error("This link is not for password recovery.");
      }

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const code = searchParams.get("code");

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) throw error;
        return { ok: true, email: data.session?.user?.email ?? null };
      }

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        return { ok: true, email: data.session?.user?.email ?? null };
      }

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) {
        throw new Error("Reset link already used or expired.");
      }

      return { ok: true, email: session.user?.email ?? null };
    },
    []
  );

  const updatePassword = useCallback(async (password) => {
    if (!password) throw new Error("Password is required.");

    const { error } = await supabase.auth.updateUser({ password });
    await supabase.auth.signOut();
    if (error) throw error;

    return { ok: true };
  }, []);

  return { verifyRecoverySession, updatePassword };
}
