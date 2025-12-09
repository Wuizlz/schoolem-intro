import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GlobalStyles from "./styles/GlobalStyles";

import AppLayout from "./ui/Layouts/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";

import Alerts from "./pages/Alerts";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import SignUp from "./pages/SignUp";
import Uni from "./pages/Uni";
import AuthCallback from "./pages/AuthCallBack";

import { Toaster } from "react-hot-toast";

import { useEffect } from "react";
import { startAuthListenerEnsureProfile } from "./services/apiProfile";
import { AuthProvider } from "./hooks/useAuth";
import Profile from "./pages/Profile";
import Settings from "./pages/settings/Settings";
import ProfileTabsLayout from "./ui/Layouts/ProfileTabsLayout";
import ProfilePosts from "./ui/profile/Posts";
import ProfileSaved from "./ui/profile/ProfileSaved";
import ProfileTagged from "./ui/profile/ProfileTagged";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/signup" replace />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/UpdatePassword" element={<UpdatePassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="uni" element={<Uni />} />
              <Route path="settings" element={<Settings />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path=":username" element={<Profile />}>
                <Route element={<ProfileTabsLayout />}>
                  <Route index element={<ProfilePosts />} />
                  <Route path="saved" element={<ProfileSaved />} />
                  <Route path="tagged" element={<ProfileTagged />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: 8 }}
          toastOptions={{
            success: { duration: 3000 },
            error: { duration: 5000 },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "--color-white-0",
              color: "--color-white-700",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
