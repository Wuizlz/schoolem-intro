// src/services/apiProfile.js
import supabase from "./supabase";
import { ensureProfile } from "../lib/ensureProfile";

/**
 * Map common Supabase auth errors to friendlier messages.
 */
function friendlyAuthError(err) {
  const m = (err?.message || "").toLowerCase();

  if (m.includes("user already registered")) return "That email is already registered. Try signing in.";
  if (m.includes("invalid login credentials")) return "Wrong email or password.";
  if (m.includes("email not confirmed")) return "Your email isn’t verified yet. Check your inbox.";
  if (m.includes("token has expired")) return "That link has expired. Request a new one.";
  if (m.includes("refresh token")) return "Your session expired. Please sign in again.";

  return err?.message || "Something went wrong.";
}

/**
 * Sign up a user with email/password.
 * - If email confirmations are enabled (recommended), Supabase returns no session and sends a link.
 *   => we return { emailConfirmation: true }
 * - If confirmations are disabled, Supabase returns a session immediately.
 *   => we call ensureProfile() and return the result.
 *
 * @param {{ email: string, password: string, firstName?: string, lastName?: string, username?: string }} payload
 * @returns {Promise<{ emailConfirmation: boolean, created?: boolean, profileError?: Error }>}
 */
export async function signUpWithEmail(payload) {
  const { email, password, firstName, lastName, username } = payload;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        display_name: `${firstName ?? ""} ${lastName ?? ""}`.trim(),
        first_name: firstName ?? null,
        last_name: lastName ?? null,
        username: username ?? null,
      },
    },
  });
  if (error) throw new Error(friendlyAuthError(error));

  // Email confirmation enabled → no session yet
  if (!data.session) {
    return { emailConfirmation: true };
  }

  // Confirmation disabled → already signed in; bootstrap profile now
  try {
    const ep = await ensureProfile();
    return { emailConfirmation: false, created: ep.created };
  } catch (profileError) {
    // Don't throw so the caller can show a friendly toast via result.profileError
    return { emailConfirmation: false, profileError };
  }
}

/**
 * Sign in with email/password, then ensure the profile row exists.
 * @param {{ email: string, password: string }} params
 */
export async function signInWithEmail({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(friendlyAuthError(error));
  return ensureProfile();
}

/**
 * Resend a confirmation email (useful when user tries to sign in before confirming).
 * @param {string} email
 */
export async function resendConfirmation(email) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw new Error(friendlyAuthError(error));
  return true;
}

/**
 * Optional: global auth listener that ensures profile after any sign-in.
 * Call this ONCE at app root if you want this behavior.
 * @returns {() => void} unsubscribe function
 */
export function startAuthListenerEnsureProfile() {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      try {
        await ensureProfile();
      } catch (e) {
        // non-fatal; just log
        console.error("Failed to ensure profile after sign-in", e);
      }
    }
  });
  return () => {
    try {
      subscription.unsubscribe();
    } catch {}
  };
}

/**
 * Optional helpers
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(friendlyAuthError(error));
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(friendlyAuthError(error));
  return data.session ?? null;
}

export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(friendlyAuthError(error));
  return data.user ?? null;
}
