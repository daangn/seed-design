import { runOnMainThread, useEffect, useMainThreadRef } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { DependencyList, RefObject } from "react";

type IconElement = MainThread.Element & {
  getComputedStyleProperty?: (name: string) => string;
  getComputedCssProperty?: (name: string) => string;
};

// Lynx `<image>` 의 `tint-color` attribute 는 concrete color(hex/rgb) 만 받는다. CSS
// `color: var(--seed-color-...)` 를 slot 에 걸면 `getComputedStyleProperty("color")` 가
// resolved hex 를 돌려주므로 main-thread 에서 한번 읽어 `tint-color` 로 mirror 한다.
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
 * const { ref } = useIconColor([variant, disabled, loading]);
 * return cloneElement(iconChild, { ref });
 * ```
 */
export function useIconColor(deps: DependencyList): {
  ref: RefObject<MainThread.Element>;
} {
  const ref = useMainThreadRef<IconElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: deps 는 caller 가 책임.
  useEffect(() => {
    runOnMainThread(syncTintColor)(ref);
  }, deps);

  return { ref };
}
