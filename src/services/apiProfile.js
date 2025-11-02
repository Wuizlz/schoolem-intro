// src/services/apiProfile.js
import supabase from "./supabase";
import { ensureProfile } from "../lib/ensureProfile";

/** Detects the classic duplicate-email error from Supabase */
function isEmailInUseError(err) {
  const msg = String(err?.message || "").toLowerCase();
  return (
    (err?.status === 400 || err?.status === 422) &&
    (msg.includes("already") || msg.includes("registered") || msg.includes("exists"))
  );
}

/** Friendly messages for other auth errors */
function friendlyAuthError(err) {
  const m = (err?.message || "").toLowerCase();
  if (m.includes("user already registered")) return "That email is already registered. Try signing in.";
  if (m.includes("invalid login credentials")) return "Wrong email or password.";
  if (m.includes("email not confirmed")) return "Your email isn't verified yet. Check your inbox.";
  if (m.includes("token has expired")) return "That link has expired. Request a new one.";
  if (m.includes("refresh token")) return "Your session expired. Please sign in again.";
  return err?.message || "Something went wrong.";
}

/**
 * Sign up a user with email/password.
 * Returns { emailConfirmation: boolean, created?: boolean, profileError?: Error }
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

  // Case A: Supabase returned an error (e.g., confirmed account already exists)
  if (error) {
    if (isEmailInUseError(error)) {
      const e = new Error("An account with that email already exists. Please sign in.");
      e.code = "E_EMAIL_IN_USE";
      e.userMessage = "An account with that email already exists. Please sign in.";
      throw e;
    }
    throw new Error(friendlyAuthError(error));
  }

  // Case B: No error, but Supabase signals existing user via identities=[]
  // (common when the email exists but isn't confirmed yet, or re-signup edge cases)
  // If identities is an empty array, treat it as "email in use" to keep UX consistent.
  const identities = data?.user?.identities;
  if (Array.isArray(identities) && identities.length === 0) {
    const e = new Error("An account with that email already exists. Please sign in.");
    e.code = "E_EMAIL_IN_USE";
    e.userMessage = "An account with that email already exists. Please sign in.";
    throw e;
  }

  // When confirmations are enabled -> no session yet (email sent)
  if (!data?.session) {
    return { emailConfirmation: true };
  }

  // When confirmations are disabled -> we have a session; ensure profile now
  try {
    const ep = await ensureProfile();
    return { emailConfirmation: false, created: ep.created };
  } catch (profileError) {
    return { emailConfirmation: false, profileError };
  }
}

export async function signInWithEmail({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(friendlyAuthError(error));
  return ensureProfile();
}

export async function resendConfirmation(email) {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw new Error(friendlyAuthError(error));
  return true;
}

export function startAuthListenerEnsureProfile() {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      try {
        await ensureProfile();
      } catch (e) {
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
