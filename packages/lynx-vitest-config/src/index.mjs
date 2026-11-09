import path from "node:path";

import { defineConfig, mergeConfig } from "vitest/config";

// peer 하한(0.117)에는 testing-library/plugins export가 없어 deprecated된 vitest-config를 쓴다.
async function createTestingLibraryConfig() {
  try {
    const { vitestTestingLibraryPlugin } = await import("@lynx-js/react/testing-library/plugins");
    return { plugins: [vitestTestingLibraryPlugin()] };
  } catch (error) {
    if (error?.code !== "ERR_PACKAGE_PATH_NOT_EXPORTED") throw error;

    const { createVitestConfig } = await import("@lynx-js/react/testing-library/vitest-config");
    return createVitestConfig();
  }
}

export async function createLynxVitestConfig() {
  return mergeConfig(
    await createTestingLibraryConfig(),
    defineConfig({
      test: {
        include: ["src/**/*.test.{ts,tsx}"],
        // 기본 module cache는 workspace 루트 하나를 공유해 패키지를 병렬 실행하면 서로 지운다.
        fsModuleCachePath: path.resolve("node_modules/.vitest-cache"),
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
        noExternal: [
          "@lynx-js/react",
          "@lynx-js/gesture-runtime",
          "preact",
          "@lynx-js/internal-preact",
        ],
      },
    }),
  );
}
