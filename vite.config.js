import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  define: {
    global: "window", // hack for dragula
  },
  server: {
    proxy: {
      "/boards": "http://localhost:8000",
      "/auth": "http://localhost:8000",
    },
  },
});
