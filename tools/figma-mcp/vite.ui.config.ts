import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "node:path";
import { seedDesignPlugin } from "@seed-design/vite-plugin";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile(), seedDesignPlugin(), tsconfigPaths()],
  resolve: {
    alias: {
      "@/*": resolve(__dirname, "src/*"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
      external: ["tabbable"],
    },
  },
});
