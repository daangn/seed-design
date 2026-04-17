import { createVitestConfig } from "@lynx-js/react/testing-library/vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

const defaultConfig = await createVitestConfig();

export default mergeConfig(
  defaultConfig,
  defineConfig({
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
