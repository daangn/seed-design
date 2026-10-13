import * as React from "@lynx-js/react";
import { getRectByRef } from "@lynx-js/lynx-ui-common";
import type { CSSProperties, IntrinsicElements, NodesRef } from "@lynx-js/types";
import { useSafeArea } from "@seed-design/lynx-react-use-safe-area";

import type { Rect } from "./computePosition.js";

type ViewProps = IntrinsicElements["view"];

/** 안전 영역의 왼쪽 위·오른쪽 아래 모서리에 놓인 측정용 node입니다. */
export interface SafeAreaProbeNodes {
  start: NodesRef | null;
  end: NodesRef | null;
}

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

function getRootRect() {
  "background only";
  return getRectByRef({ current: lynx.createSelectorQuery().selectRoot() }, true);
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
 */
export async function measureFloatingBoundary(
  probes: SafeAreaProbeNodes,
  previous?: FloatingBoundary | null,
): Promise<FloatingBoundary> {
  "background only";
  const cached = previous?.safeArea ? previous : null;
  const [root, measured] = await Promise.all([
    getRootRect(),
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
