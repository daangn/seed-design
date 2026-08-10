import { createRequire } from "node:module";
import path from "node:path";

import { createVitestConfig } from "@lynx-js/react/testing-library/vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

const defaultConfig = await createVitestConfig();
const require = createRequire(import.meta.url);
const aliases = defaultConfig.test?.alias;

if (!Array.isArray(aliases)) {
  throw new Error("Expected ReactLynx Vitest aliases to be an array.");
}

const runtimePreactPackageAlias = aliases.find(
  (alias) =>
    alias.find instanceof RegExp && alias.find.source === String.raw`^preact\/package.json$`,
);

if (!runtimePreactPackageAlias) {
  throw new Error("Expected ReactLynx Vitest config to include a Preact package alias.");
}

const runtimePreactDirectory = path.dirname(runtimePreactPackageAlias.replacement);
const internalPreactDirectory = path.dirname(require.resolve("preact/package.json"));

defaultConfig.test = {
  ...defaultConfig.test,
  alias: aliases.map((alias) =>
    alias.find instanceof RegExp && alias.find.source.startsWith("^preact")
      ? {
          ...alias,
          replacement: alias.replacement.replace(runtimePreactDirectory, internalPreactDirectory),
        }
      : alias,
  ),
};

export default mergeConfig(
  defaultConfig,
  defineConfig({
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
      noExternal: ["@lynx-js/react", "preact", "@lynx-js/internal-preact"],
    },
  }),
);
