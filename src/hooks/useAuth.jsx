import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import supabase from "../services/supabase";

class ProfileMissingError extends Error {
  constructor() {
    super("Profile not found");
    this.name = "ProfileMissingError";
    this.code = "PROFILE_MISSING";
  }
}

function isUnauthorizedError(err) {
  if (!err) return false;
  const status =
    err.status ??
    err.statusCode ??
    err?.response?.status ??
    err?.originalError?.status ??
    null;
  return status === 401 || status === 403;
}

function isProfileMissingError(err) {
  return err instanceof ProfileMissingError || err?.code === "PROFILE_MISSING";
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  const verifySession = useCallback(async (candidateSession) => {
    if (!candidateSession) return { user: null, invalid: false };

    try {
      const { data, error: getUserError } = await supabase.auth.getUser(
        candidateSession.access_token
      );
      if (getUserError) {
        if (isUnauthorizedError(getUserError)) {
          return { user: null, invalid: true };
        }
        throw getUserError;
      }

      const verifiedUser = data?.user ?? null;
      if (!verifiedUser) {
        return { user: null, invalid: true };
      }

      return { user: verifiedUser, invalid: false };
    } catch (err) {
      if (isUnauthorizedError(err)) {
        return { user: null, invalid: true };
      }
      throw err;
    }
  }, []);

  const loadProfile = useCallback(async (nextUser) => {
    if (!nextUser) {
      setProfile(null);
      return null;
    }

    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, display_name, full_name, uni_id, bio, avatar_url")
      .eq("id", nextUser.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!data) {
      setProfile(null);
      throw new ProfileMissingError();
    }

    setProfile(data);
    return data;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return null;
    }

    setIsLoading(true);
    try {
      const data = await loadProfile(user);
      setError(null);
      return data;
    } catch (err) {
      console.error("Failed to refresh profile", err);
      setError(err);
      setProfile(null);
      throw err;
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  }, [loadProfile, user]);

  const handleAuthChange = useCallback(
    async (event, newSession) => {
      setIsLoading(true);
      try {
        if (!isMountedRef.current) return;

        if (event === "USER_DELETED") {
          setSession(null);
          setUser(null);
          setProfile(null);
          setError(null);
          await supabase.auth.signOut();
          return;
        }

        let nextSession = newSession ?? null;
        let nextUser = null;
        let shouldSignOut = false;

        if (nextSession) {
          const { user: verifiedUser, invalid } =
            await verifySession(nextSession);
          if (invalid) {
            nextSession = null;
            shouldSignOut = true;
          } else {
            nextUser = verifiedUser;
          }
        }

        if (!isMountedRef.current) {
          if (shouldSignOut) await supabase.auth.signOut();
          return;
        }

        setSession(nextSession);
        setUser(nextUser);

        if (!nextUser) {
          setProfile(null);
          setError(null);
          if (shouldSignOut) await supabase.auth.signOut();
          return;
        }

        await loadProfile(nextUser);
        setError(null);
        if (shouldSignOut) await supabase.auth.signOut();
      } catch (err) {
        console.error("Failed to handle auth state change", err);
        setError(err);
        setProfile(null);
        if (isUnauthorizedError(err) || isProfileMissingError(err)) {
          await supabase.auth.signOut();
          if (isMountedRef.current) {
            setSession(null);
            setUser(null);
          }
        }
      } finally {
        if (isMountedRef.current) setIsLoading(false);
      }
    },
    [loadProfile, verifySession]
  );

  useEffect(() => {
    isMountedRef.current = true;

    const initialize = async () => {
      try {
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (!isMountedRef.current) return;

        await handleAuthChange("INITIAL_SESSION", initialSession ?? null);
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error("Failed to initialize auth context", err);
        setError(err);
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      void handleAuthChange(event, newSession);
    });

    return () => {
      isMountedRef.current = false;
      subscription.unsubscribe();
    };
  }, [handleAuthChange]);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      isLoading,
      error,
      refreshProfile,
    }),
    [session, user, profile, isLoading, error, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
