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
  const { data: uniId, error: uniError } = await supabase.rpc("email_domain", {
    p_email: email,
  });
  if (uniError) throw uniError; // unexpected server issue
  if (!uniId) {
    throw new Error("University not yet supported.");
  }

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

  if (needsUpsert) {
    const { error: upsertErr } = await supabase
      .from("profiles")
      .upsert(row, { onConflict: "id" });
    console.log("[ensureProfile] upsert result", upsertErr);
    if (upsertErr) throw upsertErr;
  }

  const result = { created: !existing, user, allowed: true, uniId };

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

/**
 * Update user profile with new data
 */
export async function updateProfile({
  fullName,
  username,
  bio,
  birthdate,
  gender,
  avatarFile,
}) {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Not authenticated");

  let avatarUrl = null;

  // Upload avatar if provided (unique path + no upsert → INSERT only)
  if (avatarFile) {
    const extFromName = avatarFile.name?.split(".").pop()?.toLowerCase();
    const fallbackExt =
      (avatarFile.type && avatarFile.type.split("/")[1]) || "jpg";
    const fileExt = extFromName || fallbackExt;
    const filePath = `${user.id}/${user.id}-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-pic")
      .upload(filePath, avatarFile, {
        cacheControl: "360", // ok to bump if you like
        upsert: true,
        contentType: avatarFile.type || `image/${fileExt}`,
      });

    if (uploadError) throw uploadError;

    // Public bucket: get public URL and cache-bust
    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pic").getPublicUrl(filePath);

    avatarUrl = `${publicUrl}?v=${Date.now()}`;
  }

  // Convert birthdate MM/DD/YYYY -> YYYY-MM-DD (if needed)
  let dbBirthdate = birthdate;
  if (birthdate && birthdate.includes("/")) {
    const [month, day, year] = birthdate.split("/");
    dbBirthdate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  }

  // Update profile in database
  const updateData = {
    full_name: fullName,
    display_name: username,
    bio: bio || null,
    b_date: dbBirthdate || null,
    gender: gender || null,
  };
  if (avatarUrl) updateData.avatar_url = avatarUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", user.id);

  if (updateError) throw updateError;

  return { success: true, avatarUrl };
}



export async function getUserPublications(username, pubType) {
  if (!username) throw new Error("Not authorized to perform action");

  const { data: userRow, error: userIdError } = await supabase
    .from("profiles")
    .select("id")
    .eq("display_name", username)
    .maybeSingle();

  if (userIdError) throw userIdError;
  if (!userRow?.id) throw new Error("User not found");

  const query = supabase
    .from("publications")
    .select(
      "publication_id, created_at, type, post:posts(caption,pic_url),thread:threads(thread_text)"
    )
    .eq("author_id", userRow.id)
    .order("created_at", { ascending: false });

  if (pubType) query.eq("type", pubType);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getProfileByUsername(username) {
  if (!username) throw new Error("Username failed to transfer");
  //1) Look up the profile in database using username from params to receive basic information
  
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, avatar_url, display_name, full_name, bio")
    .eq("display_name", username)
    .maybeSingle();
  if (profileError) throw profileError;
  
  //2) Now get count of publications published from user using data.id
  const { count: publicationsCount, error: publicationsError } = await supabase
    .from("publications")
    .select("publication_id", { count: "exact", head: true })
    .eq("author_id", profile.id);
  if (publicationsError) throw publicationsError;

  const { count: followingCount, error: followingError } = await supabase
    .from("followings")
    .select("id", { count: "exact", head: true })
    .eq("follower_id", profile.id);
  if (followingError) throw followingError;
  const { count: followersCount, error: followersError } = await supabase
    .from("followings")
    .select("id", { count: "exact", head: true })
    .eq("followee_id", profile.id);
  if(followersError) throw followersError
  return {
    ...profile,
    publicationsCount: publicationsCount ?? 0,
    followersCount: followersCount ?? 0, //TODO: ADD REAL FOLLOWER COUNT
    followingCount: followingCount ?? 0, //TODO: ADD REAL FOLLOWING COUNT
  };
}

