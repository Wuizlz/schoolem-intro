import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
   build: {
    // Just to stop the noisy "500 kB" warnings now that we're splitting
    chunkSizeWarningLimit: 1000, // in kB (so 1000 = 1 MB)
  },
});