import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  define: {
    global: "window", // hack for dragula
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("firebase")) {
            return "firebase";
          }
          if (id.includes("crypto-js")) {
            return "crypto-js";
          }
          if (id.includes("moment")) {
            return "moment";
          }
          if (id.includes("svelte-feather-icons")) {
            return "icons";
          }
        },
      },
    },
  },
  server: {
    proxy: {
      // Cloud
      "/boards": "https://retrotools-dev-7kiihsiuqq-nw.a.run.app",
      "/auth": "https://retrotools-dev-7kiihsiuqq-nw.a.run.app",

      // Local
      // "/boards": "http://localhost:8000",
      // "/auth": "http://localhost:8000",
    },
  },
});
