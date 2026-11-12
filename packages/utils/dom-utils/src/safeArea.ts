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
let sentinel: HTMLElement | undefined;
let stopObserving: (() => void) | undefined;

function createSentinel() {
  const element = document.createElement("div");
  element.setAttribute("aria-hidden", "true");
  element.style.cssText =
    "position:fixed;top:0;left:0;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none";

  const start = document.createElement("div");
  start.style.cssText =
    "position:absolute;width:env(safe-area-inset-left);height:env(safe-area-inset-top)";

  const end = document.createElement("div");
  end.style.cssText =
    "position:absolute;width:env(safe-area-inset-right);height:env(safe-area-inset-bottom)";

  element.append(start, end);

  return element;
}

function startObserving() {
  sentinel ??= createSentinel();
  // 앱이 body를 다시 그리면 남겨 둔 sentinel이 떨어져 나갈 수 있어요.
  if (!sentinel.isConnected) document.body.append(sentinel);

  const targets = Array.from(sentinel.children);
  // observe 직후 첫 보고가 오기 전에 inset이 바뀔 수 있어서, 첫 보고도 버리지 않고 지금 크기와 비교해요.
  const sizes = new Map(
    targets.map((target) => {
      const { width, height } = target.getBoundingClientRect();
      return [target, { width, height }];
    }),
  );

  const observer = new ResizeObserver((entries) => {
    let changed = false;
    for (const { target, contentRect } of entries) {
      const { width, height } = contentRect;
      const size = sizes.get(target);
      if (size?.width === width && size.height === height) continue;

      sizes.set(target, { width, height });
      changed = true;
    }
    if (!changed) return;

    for (const listener of listeners) listener();
  });
  for (const target of targets) observer.observe(target);

  return () => observer.disconnect();
}

/**
 * safe area inset이 바뀔 때마다 `listener`를 불러요. 웹뷰 위에 iOS 네이티브 바나 툴바가
 * 나타날 때처럼 host는 `resize` 없이 inset을 바꿀 수 있어서, `env()`로 크기를 정한 요소를
 * 관찰해요. 이 요소는 처음 구독할 때 `document.body`에 붙고, 구독이 모두 끝나도 남아요.
 *
 * @returns 관찰을 멈추는 함수
 */
export function observeSafeAreaInsets(listener: () => void) {
  if (typeof document === "undefined" || typeof ResizeObserver === "undefined") return () => {};

  // 같은 함수로 두 번 구독해도 Set에서 서로 다른 항목으로 남게 감싸요.
  const entry = () => listener();
  listeners.add(entry);
  stopObserving ??= startObserving();

  return () => {
    listeners.delete(entry);
    if (listeners.size > 0) return;

    // 다음 구독 때 다시 만들지 않도록 sentinel은 남기고 관찰만 멈춰요.
    stopObserving?.();
    stopObserving = undefined;
  };
}
