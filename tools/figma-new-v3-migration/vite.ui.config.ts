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
      "seed-design/*": resolve(__dirname, "src/ui/common/design-system/*"),
      "common/*": resolve(__dirname, "src/ui/common/*"),
      "shared/*": resolve(__dirname, "src/shared/*"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
    rollupOptions: {
      input: resolve(__dirname, "index.html"),
    },
  },
});
