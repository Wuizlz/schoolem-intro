import { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef} from "react";
import supabase from "../services/supabase";
import { useAuth } from "./useAuth";

const ThemeContext = createContext(null);
const STORAGE_KEY = "schoolem.theme"; // "light" | "dark"

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }) {
  const { user } = useAuth(); // ✅ make sure useAuth actually returns `user`
  const userId = user?.id ?? null;

  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "light"
  );
  const [loadedFromDb, setLoadedFromDb] = useState(false);

  // Skip the first DB save after we load (prevents overwriting)
  const skipFirstSaveRef = useRef(true);

  // Apply + persist locally (always)
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Load from DB when user changes
  useEffect(() => {
    // reset per-user
    setLoadedFromDb(false);
    skipFirstSaveRef.current = true;

    if (!userId) return;

    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("theme")
        .eq("id", userId)
        .maybeSingle();

      if (cancelled) return;

      if (!error && data?.theme != null) {
        setTheme(data.theme ? "dark" : "light");
      }

      setLoadedFromDb(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Save to DB when theme changes (but NOT immediately after load)
  useEffect(() => {
    if (!userId) return;
    if (!loadedFromDb) return;

    // prevents: load -> immediately upsert same/default -> overwrite
    if (skipFirstSaveRef.current) {
      skipFirstSaveRef.current = false;
      return;
    }

    (async () => {
      await supabase
        .from("settings")
        .upsert({ id: userId, theme: theme === "dark" }, { onConflict: "id" });
    })();
  }, [theme, userId, loadedFromDb]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === "dark", setTheme, toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}