import {
  runOnMainThread,
  useEffect,
  useGlobalProps,
  useMainThreadRef,
  useRef,
} from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { DependencyList, RefObject } from "@lynx-js/react";

type IconElement = MainThread.Element & {
  getComputedStyleProperty?: (name: string) => string;
  getComputedCssProperty?: (name: string) => string;
};

type TintState = { target: IconElement; original: unknown; applied: string };

export interface UseIconColorOptions {
  sourceRef?: RefObject<MainThread.Element>;
  enabled?: boolean;
}

// Lynx `<image>` 의 `tint-color` attribute 에 CSS variable 문자열을 직접 넣는 경로는
// 안정적으로 동작하지 않는다. CSS `color` 는 computed style 로 resolved color 를 읽을 수
// 있으므로 main-thread 에서 한 번 읽어 `tint-color` 로 mirror 한다.
function syncTintColorOnce(
  targetRef: RefObject<IconElement>,
  sourceRef: RefObject<IconElement> | undefined,
  tintRef: RefObject<TintState | null>,
) {
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

  if (!color) return;

  const current = target.getAttribute("tint-color");
  const previous = tintRef.current;
  // Keep the caller's original tint, including an absent attribute. If the
  // caller changed it since our last write, that becomes the new original.
  if (!previous || previous.target !== target || current !== previous.applied) {
    tintRef.current = { target, original: current, applied: color };
  } else {
    previous.applied = color;
  }
  if (current !== color) target.setAttribute("tint-color", color);
}

function scheduleTintColorSync(
  targetRef: RefObject<IconElement>,
  sourceRef: RefObject<IconElement> | undefined,
  frameRef: RefObject<number>,
  tintRef: RefObject<TintState | null>,
) {
  "main thread";

  if (frameRef.current && typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }

  // WebLynx는 effect 시점에 class patch가 반영되어 있으므로 즉시 동기화해
  // 불필요한 한 프레임 지연을 없앤다. Native는 patch flush가 늦을 수 있어
  // 다음 frame에 한 번 더 읽는다.
  syncTintColorOnce(targetRef, sourceRef, tintRef);

  if (typeof requestAnimationFrame === "function") {
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      syncTintColorOnce(targetRef, sourceRef, tintRef);
    });
  }
}

function cancelTintColorSync(frameRef: RefObject<number>) {
  "main thread";

  if (frameRef.current && typeof cancelAnimationFrame === "function") {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
  }
}

function restoreTintColor(tintRef: RefObject<TintState | null>) {
  "main thread";

  const previous = tintRef.current;
  if (!previous) return;
  if (previous.target.getAttribute("tint-color") === previous.applied) {
    previous.target.setAttribute("tint-color", previous.original ?? null);
  }
  tintRef.current = null;
}

/**
 * Lynx `<image>` 의 tint color 를 recipe 의 CSS `color` 로부터 main-thread 에서 읽어
 * `tint-color` attribute 로 mirror. `deps` 또는 시스템 테마가 바뀌면 native class
 * patch가 반영된 다음 frame에 재동기화하고, UI 표시 이벤트에서는 즉시 동기화.
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
  const enabled = options?.enabled ?? true;
  const frameRef = useMainThreadRef<number>(0);
  const tintRef = useMainThreadRef<TintState | null>(null);
  const theme = (useGlobalProps() as { theme?: unknown } | undefined)?.theme;
  const hasMountedRef = useRef(false);

  function syncOnUiAppear() {
    "main thread";
    if (!enabled) return;
    scheduleTintColorSync(ref, sourceRef, frameRef, tintRef);
  }

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (!enabled) {
      runOnMainThread(restoreTintColor)(tintRef);
      return;
    }

    runOnMainThread(scheduleTintColorSync)(ref, sourceRef, frameRef, tintRef);
    return () => {
      runOnMainThread(cancelTintColorSync)(frameRef);
    };
  }, [...deps, enabled, theme]);

  return { ref, "main-thread:binduiappear": syncOnUiAppear };
}
