import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const jsOrJsxFileName = (chunkInfo: { facadeModuleId?: string | null }) => {
  return chunkInfo.facadeModuleId?.endsWith(".tsx") ? "[name].jsx" : "[name].js";
};

export default defineConfig({
  logLevel: "warn",
  plugins: [
    dts({
      entryRoot: "src",
      staticImport: true,
      tsconfigPath: "tsconfig.json",
      exclude: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    }),
  ],
  oxc: false,
  build: {
    target: "esnext",
    minify: false,
    outDir: "lib",
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
    },
    rolldownOptions: {
      external: [/^@lynx-js\/.+/, /^@seed-design\/lynx-css(\/.*)?$/, "clsx"],
      output: {
        format: "es",
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: jsOrJsxFileName,
        chunkFileNames: jsOrJsxFileName,
        exports: "named",
      },
    },
  },
});
