import { createLynxVitestConfig } from "@seed-design/lynx-vitest-config";
import { defineConfig, mergeConfig } from "vitest/config";

// `useSafeArea`가 `globalPropsMode: "event"`에서 inset 변경을 구독하는지 검증한다.
export default mergeConfig(
  await createLynxVitestConfig(),
  defineConfig({ define: { __GLOBAL_PROPS_MODE__: JSON.stringify("event") } }),
);
