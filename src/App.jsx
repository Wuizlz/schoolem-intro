import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import GlobalStyles from "./styles/GlobalStyles";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Uni from "./pages/Uni";
import Settings from "./pages/Settings";
import ProtectedRoute from "./ui/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { startAuthListenerEnsureProfile } from "./services/apiProfile";
import AuthCallback from "./pages/AuthCallBack"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  useEffect(() => {
    const cleanup = startAuthListenerEnsureProfile();
    return () => {
      cleanup?.();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStyles />
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          {/* Default  -> /signup */}
          <Route path="/" element={<Navigate to="signup" replace />} />
          {/* Auth routes */}
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="auth/callback" element={<AuthCallback />} />
          
          {/* Protected routes */}
          <Route
            path="uni"
            element={
              <ProtectedRoute>
                <Uni />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          
          {/* Catch-all -> /uni (which will redirect to signin if not authenticated) */}
          <Route path="*" element={<Navigate to="uni" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },

          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "--color-white-0",
            color: "--color-white-700",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
