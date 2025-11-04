import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Uni from "./pages/Uni";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import GlobalStyles from "./styles/GlobalStyles";

import { Toaster } from "react-hot-toast";
import AuthCallback from "./pages/AuthCallback"; // ← correct casing
// import AlertsDrawer from ".components/AlertsDrawer"

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 0 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <GlobalStyles />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signup" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/auth/callback" element={<AuthCallback />} />{" "}
          {/* unguarded */}
          <Route element={<AppLayout />}>
          <Route index element={<Navigate replace to="uni" />} />
          <Route path="uni" element={<Uni />} />
          {/* <Route path="alerts" element={<Alerts />} /> */}
          {/* <Route path="/profile" element={<Profile />} /> */}
          {/* <Route path="/more" element={<More />} /> */}
          {/* <Route path="/create" element={<Create />} /> */}
          </Route>          
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
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
    </QueryClientProvider>
  );
}
