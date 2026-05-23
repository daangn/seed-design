import { runOnMainThread, useEffect, useMainThreadRef } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { DependencyList, RefObject } from "react";

type IconElement = MainThread.Element & {
  getComputedStyleProperty?: (name: string) => string;
  getComputedCssProperty?: (name: string) => string;
};

export interface UseIconColorOptions {
  sourceRef?: RefObject<MainThread.Element>;
}

// Lynx `<image>` 의 `tint-color` attribute 에 CSS variable 문자열을 직접 넣는 경로는
// 안정적으로 동작하지 않는다. CSS `color` 는 computed style 로 resolved color 를 읽을 수
// 있으므로 main-thread 에서 한 번 읽어 `tint-color` 로 mirror 한다.
function syncTintColor(targetRef: RefObject<IconElement>, sourceRef?: RefObject<IconElement>) {
  "main thread";

  const target = targetRef.current;
  if (!target) return;

  const source = sourceRef?.current ?? target;

  let color: string | undefined;
  if (typeof source.getComputedStyleProperty === "function") {
    color = source.getComputedStyleProperty("color");
  } else if (typeof source.getComputedCssProperty === "function") {
    color = source.getComputedCssProperty("color");
  }

  if (color) {
    target.setAttribute("tint-color", color);
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
export function useIconColor(
  deps: DependencyList,
  options?: UseIconColorOptions,
): {
  ref: RefObject<MainThread.Element>;
  "main-thread:binduiappear": () => void;
} {
  const ref = useMainThreadRef<IconElement>(null);
  const sourceRef = options?.sourceRef as RefObject<IconElement> | undefined;

  function syncOnUiAppear() {
    "main thread";
    syncTintColor(ref, sourceRef);
  }

  // deps 는 caller 가 책임.
  useEffect(() => {
    runOnMainThread(syncTintColor)(ref, sourceRef);
  }, deps);

  return { ref, "main-thread:binduiappear": syncOnUiAppear };
}
