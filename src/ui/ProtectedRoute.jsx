import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import supabase from "../services/supabase";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setAuthenticated(!!session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function checkAuth() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setAuthenticated(!!session);
    } catch (error) {
      console.error("Auth check error:", error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Redirect to signin if not authenticated
  // Save the attempted location so we can redirect back after login
  if (!authenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // User is authenticated, render the protected content
  return children;
}
