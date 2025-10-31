import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) throw new Error("VITE_SUPABASE_URL missing");
if (!supabaseAnonKey) throw new Error("VITE_SUPABASE_ANON_KEY missing");

const KEY = "__supabase_singleton__";
const supabase =
  globalThis[KEY] ||
  createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false, // we handle the URL in our callback
    },
  });

globalThis[KEY] = supabase;
export default supabase;
