// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace.

import { createContext, useContext } from "@lynx-js/react";
import type { MainThreadRef, Context } from "@lynx-js/react";

import { noop } from "@lynx-js/lynx-ui-common";
import type { PresenceState } from "@lynx-js/lynx-ui-presence";
import type { MotionValue } from "@lynx-js/motion/mini";
import type { MainThread } from "@lynx-js/types";

import type { SheetSide, SheetTransition } from "../types";
import type { SheetResolvedSide } from "../utils";

export interface SheetMethods {
  snapTo: (
    index: number,
    opts?: {
      animate?: boolean;
      snapAnimation?: SheetTransition;
      isEntry?: boolean;
    },
  ) => void;
  expand: (opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
  collapse: (opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
  close: (opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
  show: (opts?: { animate?: boolean; snapAnimation?: SheetTransition }) => void;
}

/** Positioner 레이어를 측정한 크기(px)다. 측정 전이나 레이어가 mount되지 않은 동안 축 값이 비어 있다. */
export interface SheetLayerSize {
  width?: number;
  height?: number;
}

export interface SheetContextValue {
  show: boolean;
  forceMount: boolean;
  mounted: boolean;
  onUnmount: () => void;
  setUncontrolledShow: (prop: boolean) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onShowChange?: (show: boolean) => void;
  sheetProgress: MainThreadRef<MotionValue<number>>;
  registerMethods: (methods: SheetMethods | null) => void;
  snapPoints?: Array<number | string>;
  initialSnap?: number;
  onSnapChange?: (index: number, value: number) => void;
  side: SheetSide;
  enableRTL: boolean;
  resolvedSide: SheetResolvedSide;
  /** 사용자가 넘긴 값, 없으면 측정한 레이어 크기다. */
  screenHeight?: number;
  screenWidth?: number;
  layerSize: SheetLayerSize;
  /** SheetView가 레이어의 한 축 측정값을 알린다. `undefined`이면 그 축의 값을 지운다. */
  setLayerSize: (axis: keyof SheetLayerSize, size: number | undefined) => void;
  rubberBand?: boolean | number | { coeff?: number; max?: number };
  dragDisabled?: boolean;
  dismissThreshold?: number;
  handleOnly?: boolean;
  enableDragToClose?: boolean;
  claimedGestureAngles?: [number, number][];
  presenceStateMTRef?: MainThreadRef<PresenceState>;
}

export interface SheetDragContextValue {
  dragHandlers: {
    handleTouchStartMT: (e: MainThread.TouchEvent) => void;
    handleTouchMoveMT: (e: MainThread.TouchEvent) => void;
    handleTouchEndMT: (e: MainThread.TouchEvent) => void;
  };
}

// @ts-expect-error TS2345: upstream 기본값에는 sheetProgress가 없으며 실제 MotionValue ref는 SheetRoot의 Provider에서 제공한다.
export const SheetContext: Context<SheetContextValue> = createContext<SheetContextValue>({
  show: false,
  forceMount: false,
  mounted: false,
  side: "bottom",
  enableRTL: false,
  resolvedSide: "bottom",
  layerSize: {},
  setLayerSize: noop,
  onUnmount: noop,
  setUncontrolledShow: noop,
  registerMethods: noop,
});

export function useSheetContext() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("SheetRoot should be placed at the root of the component tree");
  }
  return context;
}

export const SheetDragContext: Context<SheetDragContextValue> =
  // @ts-expect-error TS2345: upstream의 빈 기본값을 유지한다. 필수 dragHandlers는 SheetContent의 Provider에서 제공한다.
  createContext<SheetDragContextValue>({});

export function useSheetDragContext() {
  return useContext(SheetDragContext);
}
