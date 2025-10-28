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
