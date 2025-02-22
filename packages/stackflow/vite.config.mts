import react from "@vitejs/plugin-react";
import { globbySync } from "globby";
import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";
import pkg from "./package.json";

export default defineConfig({
  logLevel: "warn",
  plugins: [
    dts({
      entryRoot: "src",
      staticImport: true,
    }),
    react(),
  ],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: globbySync(["src/**/index.ts", "src/plugin.tsx"]),
    },
    outDir: "lib",
    rollupOptions: {
      logLevel: "silent",
      external: [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
        "react/jsx-runtime",
      ],
      output: [
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          exports: "named",
          entryFileNames: "[name].cjs",
        },
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
          exports: "named",
          entryFileNames: "[name].js",
        },
      ],
    },
  },
});
