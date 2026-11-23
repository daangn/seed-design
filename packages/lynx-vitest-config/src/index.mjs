import { createRequire } from "node:module";
import path from "node:path";

import { configDefaults, defineConfig, mergeConfig } from "vitest/config";

// commit 수는 peer 하한(0.117)에서 잰 값으로 고정한다. 0.126부터 Preact 11로 올라가 commit 수가 달라지므로
// 그 이상에서는 commit 테스트를 돌리지 않는다. 테스트를 실행하는 패키지(cwd)에 설치된 버전을 읽는다.
function runsCommitTests() {
  const { version } = createRequire(path.resolve("package.json"))("@lynx-js/react/package.json");
  const [major, minor] = version.split(".").map(Number);
  return major === 0 && minor < 126;
}

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
        exclude: runsCommitTests()
          ? configDefaults.exclude
          : [...configDefaults.exclude, "**/*.commits.test.tsx"],
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
