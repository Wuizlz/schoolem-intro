// src/pages/Uni.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import { signOut } from "../services/apiProfile";
import { useQuery } from "@tanstack/react-query";

export default function Uni() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  // Guard: require an active session
  useEffect(() => {
    let unsub;
    (async () => {
      const { data } = await supabase.auth.getSession();
      const authed = data?.session?.user ?? null;
      if (!authed) {
        navigate("/signin", { replace: true });
        return;
      }
      setUser(authed);
      setChecking(false);

      // keep it in sync if they sign out elsewhere
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (!session?.user) navigate("/signin", { replace: true });
      });
      unsub = sub.subscription?.unsubscribe;
    })();

    return () => {
      try { unsub?.(); } catch {}
    };
  }, [navigate]);

  // Profile query (RLS policies already set)
  const { data: profile, isLoading: loadingProfile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, created_at")
        .eq("id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    staleTime: 0,
  });

  async function handleSignOut() {
    await signOut();
    navigate("/signin", { replace: true });
  }

  if (checking) {
    return (
      <main className="min-h-dvh grid place-items-center bg-black text-zinc-100">
        <p className="text-zinc-300">Checking session…</p>
      </main>
    );
  }

  const greeting =
    profile?.display_name?.trim() ||
    user.user_metadata?.display_name?.trim() ||
    [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(" ").trim() ||
    user.email;

  return (
    <main className="min-h-dvh bg-black text-zinc-100 p-6">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Welcome{greeting ? `, ${greeting}` : ""} 👋
            </h1>
            <p className="text-zinc-400 text-sm">
              {loadingProfile ? "Loading your profile…" : "You’re signed in."}
            </p>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-2 rounded-2xl border border-zinc-700 bg-white/10 hover:bg-white/20 transition"
          >
            Sign out
          </button>
        </header>

        <section className="grid gap-4">
          <div className="rounded-3xl border border-zinc-700/60 bg-zinc-900/70 p-5">
            <h2 className="text-lg font-medium mb-3">Account</h2>
            <div className="text-sm text-zinc-300 space-y-1">
              <div><span className="text-zinc-500">Email:</span> {user.email}</div>
              <div><span className="text-zinc-500">User ID:</span> {user.id}</div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-700/60 bg-zinc-900/70 p-5">
            <h2 className="text-lg font-medium mb-3">Profile</h2>
            {loadingProfile ? (
              <div className="text-sm text-zinc-400">Loading…</div>
            ) : profile ? (
              <div className="text-sm text-zinc-300 space-y-1">
                <div><span className="text-zinc-500">Display name:</span> {profile.display_name ?? "—"}</div>
                <div><span className="text-zinc-500">Created:</span> {profile.created_at ? new Date(profile.created_at).toLocaleString() : "—"}</div>
              </div>
            ) : (
              <div className="text-sm text-zinc-400">
                No profile row found (it will be created automatically after sign-in).
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
