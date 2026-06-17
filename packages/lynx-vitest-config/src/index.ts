import { createVitestConfig } from "@lynx-js/react/testing-library/vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

/**
 * Lynx 패키지(lynx-react, lynx-headless/*)가 공유하는 vitest 설정.
 * `@lynx-js/react/testing-library`의 기본 설정에 preact/lynx 관련
 * optimizeDeps·ssr 예외를 더한다.
 */
export async function createLynxVitestConfig() {
  const defaultConfig = await createVitestConfig();
  return mergeConfig(
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
        noExternal: ["@lynx-js/react", "preact", "@hongzhiyuan/preact"],
      },
    }),
  );
}
