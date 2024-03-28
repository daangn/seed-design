import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  root: "./ui",
  plugins: [reactRefresh(), viteSingleFile()],
  build: {
    target: "esnext",
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    brotliSize: false,
    outDir: "../dist",
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
