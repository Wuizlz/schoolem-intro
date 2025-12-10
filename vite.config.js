import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
   build: {
    // Just to stop the noisy "500 kB" warnings now that we're splitting
    chunkSizeWarningLimit: 1000, // in kB (so 1000 = 1 MB)

    rollupOptions: {
      output: {
        manualChunks(id) {
          // Put all node_modules into logical chunks
          if (id.includes("node_modules")) {
            // React + router core stuff
            if (
              id.includes("react-router-dom") ||
              id.includes("react-dom") ||
              // keep this last so it doesn't override the more specific ones above
              (id.includes("react") && !id.includes("react-refresh"))
            ) {
              return "vendor-react";
            }

            // Supabase client libraries
            if (id.includes("@supabase")) {
              return "vendor-supabase";
            }

            // UI libraries (styled-components, headlessui, etc.)
            if (
              id.includes("styled-components") ||
              id.includes("@headlessui") ||
              id.includes("@radix-ui")
            ) {
              return "vendor-ui";
            }

            // Everything else from node_modules
            return "vendor";
          }
        },
      },
    },
  },
});