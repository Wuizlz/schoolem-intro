import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import supabase from "../services/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("Completing sign-in…");

  useEffect(() => {
    let isActive = true;

    async function handleCallback() {
      const hashParams = new URLSearchParams(
        location.hash.startsWith("#") ? location.hash.slice(1) : location.hash
      );
      const searchParams = new URLSearchParams(location.search);

      const errorDescription =
        hashParams.get("error_description") ||
        searchParams.get("error_description");

      if (errorDescription) {
        toast.error(errorDescription);
        navigate("/signin", { replace: true });
        return;
      }

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const code = searchParams.get("code");
      

      try {
        if (accessToken && refreshToken) {
          setStatus("Restoring your session…");
         
          const result = await supabase.auth
            .setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })
           

          
        } else if (code) {
          setStatus("Exchanging verification code…");
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }

        setStatus("Preparing your account…");
      

        toast.success("Signed in successfully!");

        navigate("/uni", { replace: true });
      } catch (error) {
        console.error("Failed to complete auth callback", error);
        toast.error(error.message ?? "Failed to finish sign-in.");
        navigate("/signin", { replace: true });
      } finally {
        if (isActive && window.history.replaceState) {
          window.history.replaceState({}, document.title, "/Uni");
        }
      }
    }

    handleCallback();

    return () => {
      isActive = false;
    };
  }, [location.hash, location.search, navigate]);

  return (
    <main className="min-h-dvh flex items-center justify-center bg-black text-zinc-100">
      <div className="w-full max-w-md rounded-3xl border-4 border-zinc-700/60 bg-zinc-900/80 p-10 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Hold tight…</h1>
        <p className="text-base text-zinc-300">{status}</p>
      </div>
    </main>
  );
}
