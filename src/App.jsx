import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Suspense, lazy } from "react";
import { Toaster } from "react-hot-toast";

import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/Layouts/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import { AuthProvider } from "./hooks/useAuth";

// 🔹 Lazy-loaded pages & components (code-splitting)
const Alerts = lazy(() => import("./pages/Alerts"));
const SignIn = lazy(() => import("./pages/SignIn"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const UpdatePassword = lazy(() => import("./pages/UpdatePassword"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Uni = lazy(() => import("./pages/Uni"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));

const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/settings/Settings"));

const ProfileTabsLayout = lazy(() => import("./ui/Layouts/ProfileTabsLayout"));
const ProfilePosts = lazy(() => import("./ui/profile/Posts"));
const ProfileSaved = lazy(() => import("./ui/profile/ProfileSaved"));
const ProfileTagged = lazy(() => import("./ui/profile/ProfileTagged"));

const UserPostPage = lazy(() => import("./ui/UserPostPage"));
const Overlay = lazy(() => import("./ui/ui components/Overlay"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 1000 } },
});

// Simple full-screen loader for lazy chunks
function FullPageLoader() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "1.1rem",
      }}
    >
      Loading…
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  // When coming from a background route (for modal overlay)
  const background = location.state?.backgroundLocation;

  return (
    <>
      {/* Main routes – use background location if present */}
      <Routes location={background || location}>
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

          {/* Full-page post view (non-modal) */}
          <Route path="p/:postId" element={<UserPostPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>

      {/* Modal overlay post view (when backgroundLocation exists) */}
      {background && (
        <Routes>
          <Route
            path="p/:postId"
            element={
              <Overlay onClose={() => navigate(-1)}>
                <UserPostPage />
              </Overlay>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* You can wrap this in NODE_ENV check if you want dev-only */}
        <ReactQueryDevtools initialIsOpen={false} />

        <GlobalStyles />

        <BrowserRouter>
          {/* Suspense handles all lazy-loaded pages/components */}
          <Suspense fallback={<FullPageLoader />}>
            <AppRoutes />
          </Suspense>
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
              // If you're using CSS vars, this is more correct:
              // backgroundColor: "var(--color-white-0)",
              // color: "var(--color-white-700)",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}