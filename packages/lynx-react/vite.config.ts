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
      external: [
        /^@lynx-js\/.+/,
        /^@seed-design\/lynx-css(\/.*)?$/,
        /^@seed-design\/lynx-react-accordion$/,
        /^@seed-design\/lynx-react-action-button$/,
        /^@seed-design\/lynx-react-app-bar$/,
        /^@seed-design\/lynx-react-attachment-display$/,
        /^@seed-design\/lynx-react-bottom-sheet$/,
        /^@seed-design\/lynx-react-callout$/,
        /^@seed-design\/lynx-react-checkbox$/,
        /^@seed-design\/lynx-react-collapsible$/,
        /^@seed-design\/lynx-react-dialog$/,
        /^@seed-design\/lynx-react-field$/,
        /^@seed-design\/lynx-react-field-button$/,
        /^@seed-design\/lynx-react-file-upload$/,
        /^@seed-design\/lynx-react-floating$/,
        /^@seed-design\/lynx-react-image$/,
        /^@seed-design\/lynx-react-keyboard-avoiding-scroll-view$/,
        /^@seed-design\/lynx-react-menu$/,
        /^@seed-design\/lynx-react-page-banner$/,
        /^@seed-design\/lynx-react-popover$/,
        /^@seed-design\/lynx-react-progress$/,
        /^@seed-design\/lynx-react-pull-to-refresh$/,
        /^@seed-design\/lynx-react-quantity-picker$/,
        /^@seed-design\/lynx-react-radio-group$/,
        /^@seed-design\/lynx-react-scale-feedback$/,
        /^@seed-design\/lynx-react-select$/,
        /^@seed-design\/lynx-react-segmented-control$/,
        /^@seed-design\/lynx-react-slider$/,
        /^@seed-design\/lynx-react-switch$/,
        /^@seed-design\/lynx-react-tabs$/,
        /^@seed-design\/lynx-react-text-field$/,
        /^@seed-design\/lynx-react-use-safe-area$/,
        "clsx",
      ],
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
