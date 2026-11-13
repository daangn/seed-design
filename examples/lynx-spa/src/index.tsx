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

// 호스트 앱이 넣어 주는 global props. 호스트 계약은 SEED가 아니라 앱이 선언한다.
interface HostGlobalProps {
  theme?: string;
  motion?: string;
  safeAreaInsetTop?: number;
  safeAreaInsetRight?: number;
  safeAreaInsetBottom?: number;
  safeAreaInsetLeft?: number;
  // LynxView 위치와 무관한 window 기준 값. 지원하지 않는 host는 null을 주거나 키를 두지 않는다.
  windowSafeAreaInsetTop?: number | null;
  windowSafeAreaInsetRight?: number | null;
  windowSafeAreaInsetBottom?: number | null;
  windowSafeAreaInsetLeft?: number | null;
}

const isValidInset = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

function toInsets(
  top: unknown,
  right: unknown,
  bottom: unknown,
  left: unknown,
): SafeAreaInsets | undefined {
  // 4방향 모두 0 이상의 유한한 숫자일 때만 넘긴다. 값이 없거나 null·음수·NaN이 섞이면 넘기지 않는다.
  if (!isValidInset(top) || !isValidInset(right) || !isValidInset(bottom) || !isValidInset(left)) {
    return undefined;
  }
  return { top, right, bottom, left };
}

function Page() {
  const seedClassName = useSeedClassName();
  return (
    <page className={`${seedClassName} bg-bg-layer-default`}>
      <App />
    </page>
  );
}

function Root() {
  // `globalPropsMode: "reactive"`는 host 값이 바뀌면 전체를 다시 렌더하므로 바로 읽는다.
  const g = lynx.__globalProps as HostGlobalProps;
  return (
    <SeedProvider
      preferredColorScheme={g.theme?.toLowerCase() === "dark" ? "dark" : "light"}
      preferredMotion={g.motion === "reduced" ? "reduced" : "default"}
      safeAreaInsets={toInsets(
        g.safeAreaInsetTop,
        g.safeAreaInsetRight,
        g.safeAreaInsetBottom,
        g.safeAreaInsetLeft,
      )}
      windowSafeAreaInsets={toInsets(
        g.windowSafeAreaInsetTop,
        g.windowSafeAreaInsetRight,
        g.windowSafeAreaInsetBottom,
        g.windowSafeAreaInsetLeft,
      )}
    >
      <Page />
    </SeedProvider>
  );
}

root.render(<Root />);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
