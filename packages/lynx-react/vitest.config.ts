import { fileURLToPath } from "node:url";
import { createVitestConfig } from "@lynx-js/react/testing-library/vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

const defaultConfig = await createVitestConfig();

export default mergeConfig(
  defaultConfig,
  defineConfig({
    resolve: {
      alias: {
        "@seed-design/lynx-button": fileURLToPath(
          new URL("../lynx-headless/button/src/index.ts", import.meta.url),
        ),
        "@seed-design/lynx-checkbox": fileURLToPath(
          new URL("../lynx-headless/checkbox/src/index.ts", import.meta.url),
        ),
        "@seed-design/lynx-switch": fileURLToPath(
          new URL("../lynx-headless/switch/src/index.ts", import.meta.url),
        ),
        "@seed-design/lynx-use-controllable-state": fileURLToPath(
          new URL("../lynx-headless/use-controllable-state/src/index.ts", import.meta.url),
        ),
      },
    },
    test: {
      include: ["src/**/*.test.{ts,tsx}"],
    },
    optimizeDeps: {
      exclude: [
        "@lynx-js/react",
        "@lynx-js/react/testing-library",
        "preact",
        "preact/hooks",
        "preact/compat",
      ],
    },
    ssr: {
      noExternal: ["@lynx-js/react", "preact", "@hongzhiyuan/preact"],
    },
  }),
);
