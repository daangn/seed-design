import { runOnMainThread, useEffect, useMainThreadRef } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { DependencyList, RefObject } from "react";

type IconElement = MainThread.Element & {
  getComputedStyleProperty?: (name: string) => string;
  getComputedCssProperty?: (name: string) => string;
};

// Lynx `<image>` 의 `tint-color` attribute 에 CSS variable 문자열을 직접 넣는 경로는
// 안정적으로 동작하지 않는다. CSS `color` 는 computed style 로 resolved color 를 읽을 수
// 있으므로 main-thread 에서 한 번 읽어 `tint-color` 로 mirror 한다.
function syncTintColor(ref: RefObject<IconElement>) {
  "main thread";

  const el = ref.current;
  if (!el) return;

  let color: string | undefined;
  if (typeof el.getComputedStyleProperty === "function") {
    color = el.getComputedStyleProperty("color");
  } else if (typeof el.getComputedCssProperty === "function") {
    color = el.getComputedCssProperty("color");
  }

  if (color) {
    el.setAttribute("tint-color", color);
  }
}

/**
 * Lynx `<image>` 의 tint color 를 recipe 의 CSS `color` 로부터 main-thread 에서 읽어
 * `tint-color` attribute 로 mirror. `deps` 가 바뀌면 재동기화.
 *
 * ```tsx
 * const iconColorProps = useIconColor([variant, disabled, loading]);
 * return cloneElement(iconChild, iconColorProps);
 * ```
 */
export function useIconColor(deps: DependencyList): {
  ref: RefObject<MainThread.Element>;
  "main-thread:binduiappear": () => void;
} {
  const ref = useMainThreadRef<IconElement>(null);

  function syncOnUiAppear() {
    "main thread";
    syncTintColor(ref);
  }

  // deps 는 caller 가 책임.
  useEffect(() => {
    runOnMainThread(syncTintColor)(ref);
  }, deps);

  return { ref, "main-thread:binduiappear": syncOnUiAppear };
}
