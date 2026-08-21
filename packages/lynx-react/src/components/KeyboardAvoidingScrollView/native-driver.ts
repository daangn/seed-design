import type { NodesRef, PlatformType } from "@lynx-js/types";

import type { VerticalRect } from "./geometry";

export type KeyboardAvoidingPlatform = Extract<PlatformType, "Android" | "iOS">;

export interface RawKeyboardState {
  visible: boolean;
  height: number;
}

export interface KeyboardOcclusion {
  visible: boolean;
  topInScreenPx: number;
}

export interface ScrollMetrics {
  offsetY: number;
  maxOffsetY: number;
}

export interface RawScrollInfo {
  scrollY?: number;
  scrollRange?: number;
  maxScrollOffset?: number;
  scrollTop?: number;
  scrollHeight?: number;
}

interface SystemInfoLike {
  pixelHeight?: number;
  pixelRatio?: number;
  platform?: string;
}

export interface KeyboardAvoidingNativeDriver {
  measure(node: NodesRef): Promise<VerticalRect | null>;
  resolveKeyboardOcclusion(state: RawKeyboardState): Promise<KeyboardOcclusion | null>;
  setSpacerHeight(node: NodesRef, height: number): void;
  waitForLayout(): Promise<void>;
  getScrollMetrics(node: NodesRef, viewportHeight: number): Promise<ScrollMetrics | null>;
  scrollTo(node: NodesRef, offset: number, smooth: boolean): void;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function normalizeNonNegative(value: number): number {
  return Math.max(0, value);
}

function normalizeRect(value: unknown): VerticalRect | null {
  if (typeof value !== "object" || value === null) return null;

  const rect = value as { top?: unknown; bottom?: unknown };
  if (!isFiniteNumber(rect.top) || !isFiniteNumber(rect.bottom)) return null;

  return {
    top: rect.top,
    bottom: Math.max(rect.top, rect.bottom),
  };
}

export function normalizeScrollMetrics(
  raw: RawScrollInfo,
  platform: KeyboardAvoidingPlatform,
  viewportHeight: number,
): ScrollMetrics | null {
  const offsetY = isFiniteNumber(raw.scrollY)
    ? raw.scrollY
    : isFiniteNumber(raw.scrollTop)
      ? raw.scrollTop
      : null;

  if (offsetY === null) return null;

  const normalizedViewportHeight = normalizeNonNegative(viewportHeight);
  let maxOffsetY: number | null = null;

  if (isFiniteNumber(raw.maxScrollOffset)) {
    maxOffsetY = raw.maxScrollOffset;
  } else if (isFiniteNumber(raw.scrollRange)) {
    maxOffsetY = platform === "iOS" ? raw.scrollRange - normalizedViewportHeight : raw.scrollRange;
  } else if (isFiniteNumber(raw.scrollHeight)) {
    maxOffsetY =
      platform === "iOS" ? raw.scrollHeight - normalizedViewportHeight : raw.scrollHeight;
  }

  if (maxOffsetY === null) return null;

  return {
    offsetY: normalizeNonNegative(offsetY),
    maxOffsetY: normalizeNonNegative(maxOffsetY),
  };
}

export function resolveKeyboardOcclusionTop(
  state: RawKeyboardState,
  platform: KeyboardAvoidingPlatform,
  screenHeight: number,
  rootRect: VerticalRect | null,
): number | null {
  if (!state.visible || !isFiniteNumber(state.height) || state.height <= 0) return null;

  if (platform === "Android") {
    return rootRect ? rootRect.bottom - state.height : null;
  }

  return isFiniteNumber(screenHeight) && screenHeight > 0 ? screenHeight - state.height : null;
}

function getSystemInfo(): {
  platform: KeyboardAvoidingPlatform;
  screenHeight: number;
} | null {
  const value = (globalThis as typeof globalThis & { SystemInfo?: SystemInfoLike }).SystemInfo;
  if (value?.platform !== "Android" && value?.platform !== "iOS") return null;
  if (!isFiniteNumber(value.pixelHeight) || !isFiniteNumber(value.pixelRatio)) return null;
  if (value.pixelHeight <= 0 || value.pixelRatio <= 0) return null;

  return {
    platform: value.platform,
    screenHeight: value.pixelHeight / value.pixelRatio,
  };
}

function measureNode(node: NodesRef): Promise<VerticalRect | null> {
  "background only";

  return new Promise((resolve) => {
    try {
      node
        .invoke({
          method: "boundingClientRect",
          params: {
            relativeTo: "screen",
            androidEnableTransformProps: true,
          },
          success: (value) => resolve(normalizeRect(value)),
          fail: () => resolve(null),
        })
        .exec();
    } catch {
      resolve(null);
    }
  });
}

function measureRoot(): Promise<VerticalRect | null> {
  "background only";

  try {
    return measureNode(lynx.createSelectorQuery().selectRoot());
  } catch {
    return Promise.resolve(null);
  }
}

function getScrollMetrics(
  node: NodesRef,
  platform: KeyboardAvoidingPlatform,
  viewportHeight: number,
): Promise<ScrollMetrics | null> {
  "background only";

  return new Promise((resolve) => {
    try {
      node
        .invoke({
          method: "getScrollInfo",
          success: (value) => {
            if (typeof value !== "object" || value === null) {
              resolve(null);
              return;
            }

            resolve(normalizeScrollMetrics(value as RawScrollInfo, platform, viewportHeight));
          },
          fail: () => resolve(null),
        })
        .exec();
    } catch {
      resolve(null);
    }
  });
}

export const lynxKeyboardAvoidingNativeDriver: KeyboardAvoidingNativeDriver = {
  measure: measureNode,
  async resolveKeyboardOcclusion(state) {
    "background only";

    const systemInfo = getSystemInfo();
    if (!systemInfo || !state.visible) return null;

    const rootRect = systemInfo.platform === "Android" ? await measureRoot() : null;
    const topInScreenPx = resolveKeyboardOcclusionTop(
      state,
      systemInfo.platform,
      systemInfo.screenHeight,
      rootRect,
    );

    return topInScreenPx === null
      ? null
      : {
          visible: true,
          topInScreenPx,
        };
  },
  setSpacerHeight(node, height) {
    "background only";

    // 동기 실행 실패는 engine까지 전달한다. engine이 transaction을 중단하되
    // 적용 상태를 확정하지 않아 다음 invalidation에서 재시도할 수 있다.
    node.setNativeProps({ height: `${normalizeNonNegative(height)}px` }).exec();
  },
  waitForLayout() {
    "background only";

    return new Promise((resolve) => {
      requestAnimationFrame(() => resolve());
    });
  },
  async getScrollMetrics(node, viewportHeight) {
    "background only";

    const systemInfo = getSystemInfo();
    if (!systemInfo) return null;

    return getScrollMetrics(node, systemInfo.platform, viewportHeight);
  },
  scrollTo(node, offset, smooth) {
    "background only";

    // 동기 실행 실패는 engine의 transaction 경계에서 fail-soft 처리한다.
    node
      .invoke({
        method: "scrollTo",
        params: {
          offset: normalizeNonNegative(offset),
          smooth,
        },
      })
      .exec();
  },
};
