import { globSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// Each component's `define/*` entry must be its own build entry so it ships as a
// side-effectful registration module consumers can import directly
// (`@seed-design/elements/define/action-button`).
const entries = ["src/index.ts", ...globSync("src/define/*.ts")];

export default defineConfig({
  logLevel: "warn",
  resolve: {
    // The demo's snippets import "@seed-design/elements" (a self-reference in this
    // package). Map it to source so `bunx vite` can serve the demo. No effect on
    // the library build (src never imports the package name).
    alias: {
      "@seed-design/elements": fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    },
  },
  plugins: [
    dts({
      entryRoot: "src",
      staticImport: true,
      tsconfigPath: "tsconfig.json",
      exclude: ["src/**/*.test.ts"],
    }),
  ],
  build: {
    target: "esnext",
    minify: false,
    outDir: "lib",
    lib: {
      entry: entries,
      formats: ["es"],
    },
    rolldownOptions: {
      // lit and @seed-design/css are consumed externally (peer/runtime); never bundled.
      external: [/^lit(\/.*)?$/, /^@lit\/.+/, /^@seed-design\/css(\/.*)?$/],
      output: {
        format: "es",
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        exports: "named",
      },
    },
  },
});
