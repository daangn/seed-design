import type { CSSProperties } from "react";

const SIDES = ["top", "right", "bottom", "left"] as const;

export type SafeAreaInsets = Record<(typeof SIDES)[number], number>;

/**
 * JS는 `env()` 값을 직접 읽지 못해서, 요소에 inset을 custom property로 다시 선언해 두고
 * `readSafeAreaInsets`로 px 값을 읽어요.
 */
export const safeAreaInsetStyle = {
  "--seed-safe-area-top": "env(safe-area-inset-top)",
  "--seed-safe-area-right": "env(safe-area-inset-right)",
  "--seed-safe-area-bottom": "env(safe-area-inset-bottom)",
  "--seed-safe-area-left": "env(safe-area-inset-left)",
} as CSSProperties;

export const readSafeAreaInsets = (element: Element) => {
  const style = getComputedStyle(element);

  return Object.fromEntries(
    SIDES.map((side) => [
      side,
      Number.parseFloat(style.getPropertyValue(`--seed-safe-area-${side}`)) || 0,
    ]),
  ) as SafeAreaInsets;
};

const listeners = new Set<() => void>();
let unmountSentinel: (() => void) | undefined;

function mountSentinel() {
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none";

  const start = document.createElement("div");
  start.style.cssText =
    "position:absolute;width:env(safe-area-inset-left);height:env(safe-area-inset-top)";

  const end = document.createElement("div");
  end.style.cssText =
    "position:absolute;width:env(safe-area-inset-right);height:env(safe-area-inset-bottom)";

  sentinel.append(start, end);
  document.body.append(sentinel);

  // ResizeObserver는 observe 직후 한 번 보고하는데, 이건 inset 변화가 아니에요.
  let initialReport = true;
  const observer = new ResizeObserver(() => {
    if (initialReport) {
      initialReport = false;
      return;
    }

    for (const listener of listeners) listener();
  });
  observer.observe(start);
  observer.observe(end);

  return () => {
    observer.disconnect();
    sentinel.remove();
  };
}

/**
 * safe area inset이 바뀔 때마다 `listener`를 불러요. 웹뷰 위에 iOS 네이티브 바나 툴바가
 * 나타날 때처럼 host는 `resize` 없이 inset을 바꿀 수 있어서, `env()`로 크기를 정한 요소를
 * 관찰해요.
 *
 * @returns 관찰을 멈추는 함수
 */
export function observeSafeAreaInsets(listener: () => void) {
  if (typeof document === "undefined" || typeof ResizeObserver === "undefined") return () => {};

  // 같은 함수로 두 번 구독해도 Set에서 서로 다른 항목으로 남게 감싸요.
  const entry = () => listener();
  listeners.add(entry);
  unmountSentinel ??= mountSentinel();

  return () => {
    listeners.delete(entry);
    if (listeners.size > 0) return;

    unmountSentinel?.();
    unmountSentinel = undefined;
  };
}
