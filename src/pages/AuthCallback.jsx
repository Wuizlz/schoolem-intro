// src/pages/AuthCallback.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import supabase, { supabaseUrl } from "../services/supabase";
import { ensureProfile } from "../lib/ensureProfile";

const waitForUser = async (ms = 10000) =>
  new Promise((resolve, reject) => {
    let settled = false;
    let sub;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        try { sub?.unsubscribe?.(); } catch {}
        reject(new Error("Auth timeout waiting for user"));
      }
    }, ms);

    supabase.auth.getSession().then(({ data }) => {
      if (!settled && data.session?.user) {
        settled = true;
        clearTimeout(timer);
        try { sub?.unsubscribe?.(); } catch {}
        resolve(data.session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!settled && session?.user) {
        settled = true;
        clearTimeout(timer);
        try { subscription.unsubscribe(); } catch {}
        resolve(session.user);
      }
    });
    sub = subscription;
  });

export default function AuthCallback() {
  const { hash, search } = useLocation();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("Preparing your account…");
  const [blockedByDomain, setBlockedByDomain] = useState(false); // <— NEW

  const params = useMemo(() => new URLSearchParams(search), [search]);
  const frag = useMemo(() => new URLSearchParams(hash.replace(/^#/, "")), [hash]);

  useEffect(() => {
    (async () => {
      try {
        const urlError   = params.get("error") || frag.get("error");
        const code       = params.get("code");
        const iss        = params.get("iss");
        const hasTokens  = frag.get("access_token") && frag.get("refresh_token");
        const token_hash = params.get("token_hash") || frag.get("token_hash");
        const emailParam = params.get("email") || frag.get("email");

        // 1) PKCE code flow
        if (code) {
          setMsg("Exchanging code for session…");
          if (iss) {
            const issHost = new URL(iss).host;
            const supaHost = new URL(supabaseUrl).host;
            if (issHost !== supaHost) throw new Error("Issuer mismatch");
          }
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        // 2) Legacy hash tokens
        else if (hasTokens) {
          setMsg("Setting session…");
          const { error } = await supabase.auth.setSession({
            access_token: frag.get("access_token"),
            refresh_token: frag.get("refresh_token"),
          });
          if (error) throw error;
        }
        // 3) Last resort: token_hash verify
        else if (token_hash) {
          setMsg("Verifying email…");
          const candidates = [
            { type: "signup" },
            { type: "magiclink" },
            { type: "recovery" },
            { type: "email_change" },
          ];
          let verified = false;
          for (const c of candidates) {
            try {
              const { error } = await supabase.auth.verifyOtp({
                token_hash,
                type: c.type,
                ...(emailParam ? { email: emailParam } : {}),
              });
              if (!error) { verified = true; break; }
            } catch { /* try next */ }
          }
          if (!verified) {
            if (urlError) {
              const desc = params.get("error_description") || frag.get("error_description") || "";
              throw new Error(`${urlError}: ${decodeURIComponent(desc)}`);
            }
            throw new Error("Could not verify email link.");
          }
        }
        // 4) Only an error present
        else if (urlError) {
          const desc = params.get("error_description") || frag.get("error_description") || "";
          throw new Error(`${urlError}: ${decodeURIComponent(desc)}`);
        }

        setMsg("Finalizing sign-in…");
        await waitForUser(10000);

        // Enforce domain AFTER login
        setMsg("Creating your profile…");
        const res = await ensureProfile({ enforceDomain: true });
        if (!res.allowed) {
          setBlockedByDomain(true);                       // <— NEW
          await supabase.auth.signOut();
          setMsg("You can’t sign in with this email because it isn’t from an approved school domain.");
          return; // Do NOT show resend UI
        }

        // Success → go to app
        window.history.replaceState({}, "", "/uni");
        navigate("/uni", { replace: true });
      } catch (e) {
        console.error(e);
        const m = e?.message || "Unexpected error";
        const friendly = /token|expired|already used|invalid|issuer mismatch|verify/i.test(m)
          ? "We couldn’t confirm the link. Open it in the same browser you used to sign up, or resend a new link below."
          : m;
        setMsg(friendly);
      }
    })();
  }, [frag, params, navigate]);

  function useDifferentEmail() {
    navigate("/signup", { replace: true });
  }

  return (
    <main className="min-h-dvh grid place-items-center bg-black text-zinc-100 p-8">
      <div className="max-w-lg w-full text-center space-y-4">
        <p className="text-zinc-300">{msg}</p>

        {/* Only show Resend if NOT blocked by domain */}
        {!blockedByDomain ? (
          <ResendBlock />
        ) : (
          <button
            onClick={useDifferentEmail}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
          >
            Use a different email
          </button>
        )}
      </div>
    </main>
  );
}

function ResendBlock() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  async function resend() {
    try {
      setStatus("Sending…");
      await supabase.auth.resend({
        type: "signup",
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setStatus("Check your inbox for a new link. (If you just tried, wait ~60–120s to avoid rate limits.)");
    } catch (e) {
      const msg = e?.message || "";
      if (/429|rate/i.test(msg)) {
        setStatus("Too many requests — wait ~60–120s and try again.");
      } else {
        setStatus(msg || "Failed to resend");
      }
    }
  }

  return (
    <div className="mt-6 space-y-2">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full px-3 py-2 rounded bg-zinc-800 border border-zinc-700"
      />
      <button onClick={resend} className="px-4 py-2 rounded bg-white/10 hover:bg-white/20">
        Resend confirmation
      </button>
      {status && <p className="text-sm text-zinc-400">{status}</p>}
    </div>
  );
}
