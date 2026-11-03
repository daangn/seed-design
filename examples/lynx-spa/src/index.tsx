// Temporarily disabled due to a getUniqueIdListBySnapshotId runtime error.
// import "@lynx-js/preact-devtools";

import { root } from "@lynx-js/react";
import "@lynx-js/react/debug";
import {
  initLogMonitor,
  initMainThreadConsole,
  initNetworkMonitor,
  initPerformanceMonitor,
} from "lynx-console/setup";

import "./styles/global.css";

import { SeedProvider, useSeedClassName, type SafeAreaInsets } from "@seed-design/lynx-react";

import { App } from "./App.jsx";

// Initialize lynx-console monitors before rendering.
// This must run before the LynxConsole component is rendered.
initLogMonitor();
initMainThreadConsole();
initNetworkMonitor();
initPerformanceMonitor();

// 당근 앱 호스트가 넣어 주는 global props. 호스트 계약은 SEED가 아니라 앱이 선언한다.
interface KarrotGlobalProps {
  theme?: string;
  motion?: string;
  safeAreaInsetTop?: number;
  safeAreaInsetRight?: number;
  safeAreaInsetBottom?: number;
  safeAreaInsetLeft?: number;
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

function toSafeAreaInsets(g: KarrotGlobalProps): SafeAreaInsets | undefined {
  const top = g.safeAreaInsetTop;
  const right = g.safeAreaInsetRight;
  const bottom = g.safeAreaInsetBottom;
  const left = g.safeAreaInsetLeft;
  // 4방향을 모두 받은 호스트만 넘긴다. PlayLynx처럼 값이 없는 호스트는 `env()` fallback을 쓴다.
  if (
    !isFiniteNumber(top) ||
    !isFiniteNumber(right) ||
    !isFiniteNumber(bottom) ||
    !isFiniteNumber(left)
  ) {
    return undefined;
  }
  return { top, right, bottom, left };
}

function Page() {
  const seedClassName = useSeedClassName({ colorMode: "system" });
  return (
    <page className={`${seedClassName} bg-bg-layer-default`}>
      <App />
    </page>
  );
}

function Root() {
  // `globalPropsMode: "reactive"`는 host 값이 바뀌면 전체를 다시 렌더하므로 바로 읽는다.
  const g = lynx.__globalProps as KarrotGlobalProps;
  return (
    <SeedProvider
      preferredColorScheme={g.theme?.toLowerCase() === "dark" ? "dark" : "light"}
      preferredMotion={g.motion === "reduced" ? "reduced" : "default"}
      safeAreaInsets={toSafeAreaInsets(g)}
    >
      <Page />
    </SeedProvider>
  );
}

root.render(<Root />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
