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
  // Physics
  snapPoints?: Array<number | string>;
  initialSnap?: number;
  onSnapChange?: (index: number, value: number) => void;
  side: SheetSide;
  enableRTL: boolean;
  resolvedSide: SheetResolvedSide;
  screenHeight?: number;
  screenWidth?: number;
  // Gesture
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

// @ts-expect-error MT initialize is useless
export const SheetContext: Context<SheetContextValue> = createContext<SheetContextValue>({
  show: false,
  forceMount: false,
  mounted: false,
  side: "bottom",
  enableRTL: false,
  resolvedSide: "bottom",
  onUnmount: noop,
  setUncontrolledShow: noop,
  registerMethods: noop,
});

export function useSheetContext() {
  const context = useContext(SheetContext);
  // Context is optional for some components, but mandatory for Handle
  // If we want to allow SheetHandle to be used without context (safe fallback), we can return null or empty handlers.
  // But typically it should be inside a SheetContent.
  if (!context) {
    throw new Error("SheetRoot should be placed at the root of the component tree");
  }
  return context;
}

export const SheetDragContext: Context<SheetDragContextValue> =
  // @ts-expect-error MT initialize is useless
  createContext<SheetDragContextValue>({});

export function useSheetDragContext() {
  return useContext(SheetDragContext);
}
