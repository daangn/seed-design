import { getRectByRef } from "@lynx-js/lynx-ui-common";
import type { SafeAreaInsets } from "@seed-design/lynx-react-use-safe-area";

import type { Rect } from "./computePosition.js";

function toRect(left: number, top: number, right: number, bottom: number): Rect {
  return { left, top, right, bottom, width: right - left, height: bottom - top };
}

let pendingRootRect: Promise<Rect> | null = null;

/**
 * Lynx root를 `relativeTo: "screen"` 기준으로 측정합니다.
 *
 * 여러 floating 레이어가 같은 frame에 root를 측정하면 진행 중인 측정 하나를 함께 씁니다. root 측정은
 * selector identifier가 같아, 레이어마다 호출하면 DevTool의 InvokeUIMethod 빈도 경고 기준을 함께 채웁니다.
 */
export function measureRootRect(): Promise<Rect> {
  "background only";
  if (pendingRootRect) return pendingRootRect;
  const measurement = getRectByRef({ current: lynx.createSelectorQuery().selectRoot() }, true);
  const clear = () => {
    pendingRootRect = null;
  };
  measurement.then(clear, clear);
  pendingRootRect = measurement;
  return measurement;
}

/**
 * 위치 계산 경계를 반환합니다. `container`에서 `insets`를 뺀 안전 영역과 `root`의 교집합입니다.
 *
 * `container`는 inset이 가리키는 가장자리를 가진 rect입니다. 화면을 덮는 레이어 안이면 레이어 rect, 그런
 * 레이어 없이 페이지 안이면 `root`를 넘깁니다. 레이어가 Lynx view 밖까지 덮을 수 있으므로 root와 교집합을
 * 씁니다. `insets`가 없으면(`SafeAreaProvider`가 없으면) 0으로 봅니다.
 */
export function getSafeAreaBoundary(
  root: Rect,
  container: Rect,
  insets: SafeAreaInsets | undefined,
): Rect {
  const left = Math.max(root.left, container.left + (insets?.left ?? 0));
  const top = Math.max(root.top, container.top + (insets?.top ?? 0));
  const right = Math.max(left, Math.min(root.right, container.right - (insets?.right ?? 0)));
  const bottom = Math.max(top, Math.min(root.bottom, container.bottom - (insets?.bottom ?? 0)));
  return toRect(left, top, right, bottom);
}
