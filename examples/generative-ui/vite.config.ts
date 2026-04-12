import { seedDesignPlugin } from "@seed-design/vite-plugin";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), seedDesignPlugin()],
  resolve: {
    alias: {
      "~/registry/ui": path.resolve(__dirname, "../../docs/registry/ui"),
    },
  },
  server: {
    proxy: {
      "/api/anthropic": {
        target: "https://api.anthropic.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ""),
        headers: {
          "anthropic-dangerous-direct-browser-access": "true",
        },
      },
    },
  },
});
