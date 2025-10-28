import supabase, { supabaseUrl } from "../services/supabase";

/**
 * Sign up with email/password.
 * If email confirmation is OFF and we get a session, we immediately insert the profile row.
 * If confirmation is ON (no session yet), we skip insert — call ensureProfile() after the user verifies & logs in.
 */

export async function signUpWithEmail({ email, password, displayName }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      //Where supabase redirects after email verification
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      // attach to user_metadata
      data: { display_name: displayName ?? null },
    },
  });
  if (error) throw error;

  const { user, session } = data;
  let profileInserted = false;
  let profileError = null;

  if (session) {
    const { error: pErr } = await supabase.from("profiles").insert({
      // Your BEFORE INSERT trigger sets : id := auth.uid(), email, uni_id
      display_name: displayName ?? null,
    });
    if (pErr) profileError = pErr;
    else profileInserted = true;
  }

  return {
    user,
    hasSession: !!session,
    emailConfirmation: !session, //true when confirmed
    profileInserted,
    profileError,
  };
}

/** Create-if-missing (or lightly update) the current user's profile. */
export async function ensureProfile({ displayName } = {}) {
  const { data: auth, error: authErr } = await supabase.auth.getUser();
  if (authErr) throw authErr;
  const user = auth?.user;
  if (!user) throw new Error("Not signed in");

  // Only send safe fields; your trigger fills id/email/uni_id.
  const payload = {
    id: user.id,
    // Prefer the explicit displayName arg; otherwise take from user_metadata on first run
    ...(displayName
      ? { display_name: displayName }
      : user.user_metadata?.display_name
        ? { display_name: user.user_metadata.display_name }
        : {}),
  };

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Optional: global listener you can start once in App.jsx */
export function startAuthListenerEnsureProfile() {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      try {
        await ensureProfile(); // idempotent
      } catch (err) {
        // Nice UX for blocked domains from your trigger
        if (String(err.message).includes("Unsupported school domain")) {
          // e.g. show a toast and sign out
          // await supabase.auth.signOut();
        }
      }
    }
  });
  return () => subscription.unsubscribe();
}
