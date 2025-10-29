import supabase from "./supabase";

/**
 * Sign up with email/password.
 * If email confirmation is OFF and we get a session, we immediately insert the profile row.
 * If confirmation is ON (no session yet), we skip insert — call ensureProfile() after the user verifies & logs in.
 */

export async function signUpWithEmail({ email, password, username }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      //Where supabase redirects after email verification
      
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      // attach to user_metadata
      data: { display_name: username ?? null },
    },
  });
  if (error) throw error;

  const { user, session } = data;
  let profileInserted = false;
  let profileError = null;

  if (session) {
    const { error: insertError } = await supabase.from("profiles").insert({
      // Your BEFORE INSERT trigger sets : id := auth.uid(), email, uni_id
      display_name: username ?? null,
    });
    if (insertError) profileError = insertError;
    else profileInserted = true;
  }

  return {
    user,
    hasSession: !!session,
    emailConfirmation: !session, // true when confirmation required
    profileInserted,
    profileError,
    username
  };
}

/** Create-if-missing (or lightly update) the current user's profile. */
export async function ensureProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  console.log('healthy')

  if (userError) throw userError;
  if (!user) throw new Error("Not signed in");

  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existingProfile) {
    return { created: false, user };
  }

  const displayName = user.user_metadata?.display_name ?? null;

  const { error: insertError } = await supabase.from("profiles").insert({
    display_name: displayName,
  });

  if (insertError) throw insertError;

  return { created: true, user };
}

let authListenerCleanup = null;

export function startAuthListenerEnsureProfile() {
  if (authListenerCleanup) return authListenerCleanup;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event) => {
    if (event === "SIGNED_IN") {
      try {
        await ensureProfile();
      } catch (error) {
        console.error("Failed to ensure profile after sign-in", error);
      }
    }
  });

  authListenerCleanup = () => {
    subscription.unsubscribe();
    authListenerCleanup = null;
  };

  return authListenerCleanup;
}
