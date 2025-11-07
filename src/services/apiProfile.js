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
  console.log("SignUpwithEmail was hit");
  const { data: uniId, error: uniError } = await supabase.rpc("email_domain", {
    p_email: email,
  });
  if (uniError) throw uniError; // unexpected server issue
  if (!uniId) {
    throw new Error("University not yet supported.");
  }
  console.log("Uni not supp");

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ").trim() || null;
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
        username: username,
        first_name: firstName,
        last_name: lastName,
        birthdate: birthdate,
        gender: gender,
        gender_label: genderLabel,
        full_name: fullName,
      },
    },
  });

  console.log(data);
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
      b_date: birthdate,
      gender: gender
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

export async function ensureProfile(opts = {}) {
  const { enforceDomain = false } = opts;

  // 1) Get session + user
  const {
    data: { session },
    error: sessErr,
  } = await supabase.auth.getSession();
  if (sessErr) throw sessErr;
  const user = session?.user;
  if (!user) throw new Error("Not signed in");
  console.log("[ensureProfile] session ok", user.id);

  // 2) Derive display name from metadata
  const meta = user.user_metadata || {};
  const fromMeta = meta.display_name && String(meta.display_name).trim();
  const fromNames = [meta.first_name, meta.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  const display_name = fromMeta ?? (fromNames || null);

  // 3) Ask DB which university matches the email domain
  let uniId = null;
  try {
    const { data: uniLookup, error: uniErr } = await supabase.rpc(
      "university_id_for_email",
      { p_email: user.email }
    );
    console.log("[ensureProfile] rpc result", { uniLookup, uniErr });
    if (uniErr) {
      // non-fatal; just log and continue
      console.warn("university_id_for_email failed:", uniErr);
    } else {
      uniId = uniLookup ?? null;
    }
  } catch (e) {
    console.warn("university_id_for_email threw:", e);
  }

  // 4) (Optional) Hard-enforce the domain AFTER login
  if (enforceDomain && !uniId) {
    return { created: false, user, allowed: false, uniId: null };
  }

  // 5) See if profile exists; if it does, we might still patch missing fields
  const { data: existing, error: selErr } = await supabase
    .from("profiles")
    .select("id, email, display_name, uni_id")
    .eq("id", user.id)
    .maybeSingle();
  console.log("[ensureProfile] profile select", { existing, selErr });
  if (selErr) throw selErr;

  // Build the row we want to persist (only set uni_id if we actually found one)
  const row = {
    id: user.id,
    email: user.email ?? null,
    display_name,
    ...(uniId ? { uni_id: uniId } : {}),
  };

  // If profile exists but has all desired values already, skip the write
  const needsUpsert =
    !existing ||
    existing.email !== row.email ||
    (display_name && existing.display_name !== display_name) ||
    (uniId && existing.uni_id !== uniId);
  console.log("[ensureProfile] needsUpsert", needsUpsert, { row });

  if (needsUpsert) {
    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert(row, { onConflict: "id" });
    console.log("[ensureProfile] upsert result", upsertErr);
    if (upsertErr) throw upsertErr;
  }

  const result = { created: !existing, user, allowed: true, uniId };
  console.log("[ensureProfile] returning", result);
  return result;
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
