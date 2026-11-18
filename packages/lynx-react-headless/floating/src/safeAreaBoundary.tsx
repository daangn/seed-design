import * as React from "@lynx-js/react";
import { getRectByRef } from "@lynx-js/lynx-ui-common";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";
import { type SafeAreaInsets, useSafeArea } from "@seed-design/lynx-react-use-safe-area";

/** @internal overlay 레이어의 window 기준 inset. floating 레이어 패키지가 이 패키지를 통해 쓴다. */
export { OverlaySafeAreaProvider } from "@seed-design/lynx-react-use-safe-area";

import type { Rect } from "./computePosition.js";

type ViewProps = IntrinsicElements["view"];

/**
 * 안전 영역의 왼쪽 위·오른쪽 아래 모서리에 놓인 측정용 node입니다.
 *
 * @deprecated `SafeAreaProvider`(또는 `SeedProvider`)의 숫자 inset과 `getSafeAreaBoundary`를 쓰세요. 다음
 * 메이저 버전에서 제거합니다.
 */
export interface SafeAreaProbeNodes {
  start: NodesRef | null;
  end: NodesRef | null;
}

/** @deprecated `SafeAreaProbe`와 함께 다음 메이저 버전에서 제거합니다. */
export interface SafeAreaProbeProps {
  /** `measureFloatingBoundary`에 넘길 node를 받습니다. */
  nodesRef: React.MutableRefObject<SafeAreaProbeNodes>;
  /**
   * 화면 전체를 덮는 레이어 안에서는 `absolute`, 그런 레이어 없이 페이지 안에 둘 때는 `fixed`를 씁니다.
   */
  position: "absolute" | "fixed";
}

/**
 * 안전 영역의 두 모서리에 놓는 0×0 측정용 `<view>`입니다.
 *
 * host safe area 값은 `env(safe-area-inset-*)` CSS 문자열일 수 있어 JS에서 숫자로 뺄 수 없습니다. 위치를 그
 * 값으로 정하고 native layout 결과를 측정합니다. 크기가 있는 view를 화면에 깔면 iOS에서 아래 `scroll-view`의
 * native 스크롤을 막으므로 크기를 0으로 둡니다.
 *
 * @deprecated `SafeAreaProvider`(또는 `SeedProvider`)가 있으면 inset을 숫자로 알 수 있으므로 probe 없이
 * `measureRootRect`와 `getSafeAreaBoundary`로 경계를 계산하세요. 다음 메이저 버전에서 제거합니다.
 */
export function SafeAreaProbe({ nodesRef, position }: SafeAreaProbeProps): React.ReactElement {
  const { safeAreaInsetTop, safeAreaInsetRight, safeAreaInsetBottom, safeAreaInsetLeft } =
    useSafeArea();
  const handleStartRef = React.useCallback(
    (node: NodesRef | null) => {
      nodesRef.current.start = node;
    },
    [nodesRef],
  );
  const handleEndRef = React.useCallback(
    (node: NodesRef | null) => {
      nodesRef.current.end = node;
    },
    [nodesRef],
  );
  const size: CSSProperties = { position, width: "0px", height: "0px" };
  return (
    <>
      <view
        ref={handleStartRef as ViewProps["ref"]}
        style={{ ...size, top: safeAreaInsetTop, left: safeAreaInsetLeft }}
        accessibility-element={false}
      />
      <view
        ref={handleEndRef as ViewProps["ref"]}
        style={{ ...size, right: safeAreaInsetRight, bottom: safeAreaInsetBottom }}
        accessibility-element={false}
      />
    </>
  );
}

/** @deprecated `measureFloatingBoundary`와 함께 다음 메이저 버전에서 제거합니다. */
export interface FloatingBoundary {
  /** Lynx root rect입니다. */
  root: Rect;
  /** root에서 안전 영역을 뺀 위치 계산 경계입니다. probe가 없으면 root와 같습니다. */
  boundary: Rect;
  /** probe로 측정한 안전 영역입니다. probe가 없으면 `null`입니다. */
  safeArea: Rect | null;
}

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

async function measureSafeArea({ start, end }: SafeAreaProbeNodes): Promise<Rect | null> {
  "background only";
  if (!start || !end) return null;
  const [startRect, endRect] = await Promise.all([
    getRectByRef({ current: start }, true),
    getRectByRef({ current: end }, true),
  ]);
  return toRect(startRect.left, startRect.top, endRect.left, endRect.top);
}

/**
 * Lynx root와 `SafeAreaProbe`를 `relativeTo: "screen"` 기준으로 측정해 위치 계산 경계를 반환합니다.
 * 레이어가 Lynx view 밖까지 덮을 수 있으므로 root와 안전 영역의 교집합을 경계로 씁니다.
 *
 * 매 frame 위치를 추적한다면 직전 결과를 `previous`로 넘깁니다. root 크기가 같으면 안전 영역을 다시 측정하지
 * 않습니다. 화면 회전처럼 inset이 바뀌는 경우에는 root 크기도 바뀝니다.
 *
 * @deprecated `SafeAreaProvider`(또는 `SeedProvider`)의 inset으로 `getSafeAreaBoundary(await
 * measureRootRect(), container, insets)`를 쓰세요. 다음 메이저 버전에서 제거합니다.
 */
export async function measureFloatingBoundary(
  probes: SafeAreaProbeNodes,
  previous?: FloatingBoundary | null,
): Promise<FloatingBoundary> {
  "background only";
  const cached = previous?.safeArea ? previous : null;
  const [root, measured] = await Promise.all([
    measureRootRect(),
    cached ? null : measureSafeArea(probes),
  ]);
  const safeArea =
    cached && root.width === cached.root.width && root.height === cached.root.height
      ? cached.safeArea
      : (measured ?? (await measureSafeArea(probes)));
  if (!safeArea) return { root, boundary: root, safeArea: null };
  const left = Math.max(root.left, safeArea.left);
  const top = Math.max(root.top, safeArea.top);
  const right = Math.max(left, Math.min(root.right, safeArea.right));
  const bottom = Math.max(top, Math.min(root.bottom, safeArea.bottom));
  return { root, boundary: toRect(left, top, right, bottom), safeArea };
}

/**
 * 위치 계산 경계를 반환합니다. `container`에서 `insets`를 뺀 안전 영역과 `root`의 교집합입니다.
 *
 * `container`는 inset이 가리키는 가장자리를 가진 rect입니다. 화면을 덮는 레이어 안이면 레이어 rect, 그런
 * 레이어 없이 페이지 안이면 `root`를 넘깁니다. `relativeTo: "screen"` 기준이 플랫폼마다 달라도 같은 기준으로
 * 측정한 rect끼리 계산합니다. 레이어가 Lynx view 밖까지 덮을 수 있으므로 root와 교집합을 씁니다. `insets`가
 * 없으면 0으로 봅니다.
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
