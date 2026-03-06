import { globbySync } from "globby";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import pkg from "./package.json";

export default defineConfig({
  logLevel: "warn",
  plugins: [
    dts({
      entryRoot: "src",
      staticImport: true,
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: globbySync(["src/**/index.ts"]),
    },
    outDir: "lib",
    rollupOptions: {
      logLevel: "silent",
      external: [
        ...Object.keys(pkg.dependencies ?? {}),
        ...Object.keys(pkg.peerDependencies ?? {}),
        /^@seed-design\/css\/.+/,
        /^@lynx-js\/.+/,
        "react/jsx-runtime",
      ],
      output: [
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
