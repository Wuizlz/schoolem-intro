// src/lib/ensureProfile.js
import supabase from "../services/supabase";

/**
 * Ensure there's a profile row for the signed-in user.
 * - Auto-derives display_name from user metadata.
 * - Looks up uni_id via RPC `university_id_for_email(p_email)`.
 * - If enforceDomain=true and no uni_id is found, returns { allowed:false } so the caller can block access.
 *
 * @param {{ enforceDomain?: boolean }} [opts]
 * @returns {Promise<{ created: boolean, user: any, allowed: boolean, uniId: string|null }>}
 */
export async function ensureProfile(opts = {}) {
  const { enforceDomain = false } = opts;

  // 1) Get session + user
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();
  if (sessErr) throw sessErr;
  const user = session?.user;
  if (!user) throw new Error("Not signed in");

  // 2) Derive display name from metadata
  const meta = user.user_metadata || {};
  const fromMeta = meta.display_name && String(meta.display_name).trim();
  const fromNames = [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim();
  const display_name = fromMeta ?? (fromNames || null);

  // 3) Ask DB which university matches the email domain (may be null if not allowed/unknown)
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
    if (upsertErr) throw upsertErr;
  }

  return { created: !existing, user, allowed: true, uniId };
}
