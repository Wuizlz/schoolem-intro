import supabase from "./supabase";

/**
 * Sign up with email/password.
 * If email confirmation is OFF and we get a session, we immediately insert the profile row.
 * If confirmation is ON (no session yet), we skip insert — call ensureProfile() after the user verifies & logs in.
 */

export async function signUpWithEmail({
  email,
  password,
  username,
  firstName,
  lastName,
  birthdate,
  gender,
  genderLabel,
}) {
  const { data: uniId, error: uniError } = await supabase.rpc(
    "email_domain",
    { p_email: email }
  );
  if (uniError) throw uniError; // unexpected server issue
  if (!uniId) {
    throw new Error("University not yet supported.");
  }

  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim() || null;
  const displayName = username ?? null;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      //Where supabase redirects after email verification

      emailRedirectTo: `${window.location.origin}/auth/callback`,
      // attach to user_metadata
      data: {
        display_name: displayName,
        username: username ?? null,
        first_name: firstName ?? null,
        last_name: lastName ?? null,
        birthdate: birthdate ?? null,
        gender: gender ?? null,
        gender_label: genderLabel ?? null,
        full_name: fullName,
      },
    },
  });

  console.log(data)
  if (error) {
    if (error.message?.toLowerCase().includes("user already registered")) {
      throw new Error("Account already created, sign in instead!");
    }
    throw error;
  }

  const { user, session } = data;

  const alreadyRegistered =
    user &&
    Array.isArray(user.identities) &&
    user.identities.length === 0 &&
    !session;

  if (alreadyRegistered) {
    throw new Error("Account already created, sign in instead!");
  }

  let profileInserted = false;
  let profileError = null;

  if (session) {
    const { error: insertError } = await supabase.from("profiles").insert({
      // Your BEFORE INSERT trigger sets : id := auth.uid(), email, uni_id
      display_name: displayName,
      full_name: fullName,
      b_date: birthdate ?? null,
      gender: gender ?? null,
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
    username,
  };
}

/** Create-if-missing (or lightly update) the current user's profile. */
export async function ensureProfile() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

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
  const fullName = user.user_metadata?.full_name ?? null;
  const birthdate = user.user_metadata?.birthdate ?? null;
  const gender = user.user_metadata?.gender ?? null;

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email ?? null,
    display_name: displayName,
    full_name: fullName,
    b_date: birthdate,
    gender,
  });

  if (insertError) throw insertError;

  return { created: true, user };
}

let authListenerCleanup = null;
let lastEnsuredUserId = null;

export function startAuthListenerEnsureProfile() {
  if (authListenerCleanup) return authListenerCleanup;

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      lastEnsuredUserId = null;
      return;
    }

    const userId = session?.user?.id ?? null;
    if (event === "SIGNED_IN" && userId && userId !== lastEnsuredUserId) {
      ensureProfile().catch((error) => {
        console.error("Failed to ensure profile after sign-in", error);
      });
      lastEnsuredUserId = userId;
    }
  });

  authListenerCleanup = () => {
    subscription.unsubscribe();
    authListenerCleanup = null;
  };
  return authListenerCleanup;
}
