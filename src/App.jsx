import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import GlobalStyles from "./styles/GlobalStyles";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Uni from "./pages/Uni";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000,
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          {/* Default  -> /signin */}
          <Route path="/" element={<Navigate to="signup" replace />} />
          {/* Auth routes */}
          <Route path="signin" element={<SignIn />} />
          <Route path="signup" element={<SignUp />} />
          {/* Example app route */}
          <Route path="uni" element={<Uni />} />
          {/* Catch-all -> /signin */}
          <Route path="*" element={<Navigate to="signin" replace />} />
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
            backgroundColor: "var(--color-white-0)",
            color: "var(--color-white-700)",
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
