// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace.
import { useMainThreadRef } from "@lynx-js/react";
import type { MainThreadRef } from "@lynx-js/react";

import type { MotionValue } from "@lynx-js/motion/mini";
import type { MainThread } from "@lynx-js/types";

import {
  clamp,
  findNearestSnap,
  getDefaultRubberBand,
  getMainAxisTouchCoordinate,
  getNextMainAxisOffset,
  resolveSheetSide,
  rubberEffect,
} from "../utils";
import { useDrag } from "./useDrag";
import type { SnappingOptions } from "./useSnap";
import type { SheetSide } from "../types";

export interface SnapTouchOptions {
  side?: SheetSide;
  enableRTL?: boolean;
  dragDisabled?: boolean;
  rubberBand?: boolean | number | { coeff?: number; max?: number };
  flingEnabled?: boolean;
  flingDeceleration?: number;
  flingMinVelocity?: number;
  dismissThreshold?: number;
  enableDragToClose?: boolean;
  claimedGestureAngles?: [number, number][];
  yRef: MainThreadRef<MotionValue<number>>;
  viewportSize: number;
  snapOffsets: number[];
  snapPointValues: number[];
  minOffset: number;
  maxOffset: number;
  sheetSizeMTRef: MainThreadRef<number>;
  getResolvedSnapOffsets: () => number[];
  getResolvedSnapPointValues: () => number[];
  // Controller handlers
  onDragStartMT: () => void;
  onDragEndSnapMT: (
    index: number,
    opts?: { animationConfig?: SnappingOptions["animationConfig"] },
  ) => void;
  onDragEndCloseMT: (opts?: { animationConfig?: SnappingOptions["animationConfig"] }) => void;
}

export function useSnapTouches({
  side = "bottom",
  enableRTL = false,
  dragDisabled = false,
  rubberBand,
  flingEnabled = true,
  flingDeceleration = 2000,
  flingMinVelocity = 200,
  dismissThreshold = 0.15,
  enableDragToClose = true,
  yRef,
  viewportSize,
  sheetSizeMTRef,
  getResolvedSnapOffsets,
  claimedGestureAngles,
  // Controller handlers
  onDragStartMT,
  onDragEndSnapMT,
  onDragEndCloseMT,
}: SnapTouchOptions) {
  const resolvedSide = resolveSheetSide(side, enableRTL);
  const effectiveRubberBand = rubberBand ?? getDefaultRubberBand(resolvedSide);
  const startTouchMainAxisRef = useMainThreadRef<number>(0);
  const startOffsetRef = useMainThreadRef<number>(0);
  const isDraggingMTRef = useMainThreadRef<boolean>(false);

  function handleTouchStartMT(e: MainThread.TouchEvent) {
    "main thread";
    if (dragDisabled) return;
    const offsets = getResolvedSnapOffsets();
    if (offsets.length === 0) return;

    // Only record start position - don't stop animation or change state yet
    // Wait for handleFirstMoveMT to confirm this is a sheet drag
    startTouchMainAxisRef.current = getMainAxisTouchCoordinate(resolvedSide, e.detail);
    startOffsetRef.current = yRef.current.get();
  }

  function handleFirstMoveMT() {
    "main thread";
    if (dragDisabled) return;
    const offsets = getResolvedSnapOffsets();
    if (offsets.length === 0) return;

    isDraggingMTRef.current = true;

    // Delegate to controller - handles resurrection and stopping animations
    onDragStartMT();
  }

  function handleTouchMoveMT(e: MainThread.TouchEvent) {
    "main thread";
    if (dragDisabled) return;
    const offsets = getResolvedSnapOffsets();
    if (offsets.length === 0) return;
    const delta =
      getMainAxisTouchCoordinate(resolvedSide, e.detail) - startTouchMainAxisRef.current;
    let next = getNextMainAxisOffset(resolvedSide, startOffsetRef.current, delta);

    const validOffsets = offsets.filter((o) => o !== -1);
    const min = validOffsets.length > 0 ? Math.min(...validOffsets) : 0;
    // Use the actual max snap point, not clamped to sheet height yet
    const maxSnap = validOffsets.length > 0 ? Math.max(...validOffsets) : 0;
    const max = clamp(maxSnap, Math.max(sheetSizeMTRef.current, maxSnap));

    // Use max snap offset (not DOM height) for rubber band calculation
    const {
      enabled,
      coeff,
      max: rubberMax,
    } = getRubberBandConfig(effectiveRubberBand, viewportSize, max);

    if (next > max) {
      next = enabled ? max + rubberEffect(next - max, rubberMax, coeff) : max;
    }
    if (next < min && !enableDragToClose) {
      next = enabled ? min + rubberEffect(next - min, rubberMax, coeff) : min;
    }

    yRef.current.set(next);
  }

  function handleTouchEndMT() {
    "main thread";
    // Only process if we started a real vertical drag
    if (!isDraggingMTRef.current) return;
    isDraggingMTRef.current = false;

    if (dragDisabled) return;
    const offsets = getResolvedSnapOffsets();
    if (offsets.length === 0) return;
    const current = yRef.current.get();
    const velocity = yRef.current.getVelocity();

    const validOffsets = offsets.filter((o) => o !== -1);
    const min = validOffsets.length > 0 ? Math.min(...validOffsets) : 0;
    const closed = 0;
    const dismissLine = Math.max(min - dismissThreshold * viewportSize, closed);

    if (enableDragToClose && current <= dismissLine) {
      onDragEndCloseMT();
      return;
    }

    const { index } = findNearestSnap(
      current,
      offsets,
      Math.max(sheetSizeMTRef.current, Math.max(...validOffsets, 0)),
    );
    if (flingEnabled && Math.abs(velocity) >= flingMinVelocity) {
      const travel = (Math.abs(velocity) * Math.abs(velocity)) / (2 * flingDeceleration);
      let projected = current + Math.sign(velocity) * travel;
      const min2 = 0;
      const maxSnap = validOffsets.length > 0 ? Math.max(...validOffsets) : 0;
      const max2 = clamp(maxSnap, Math.max(sheetSizeMTRef.current, maxSnap));

      if (projected < min2) projected = min2;
      if (projected > max2) projected = max2;

      const candidates = enableDragToClose ? [...offsets, closed] : offsets;

      const n = findNearestSnap(projected, candidates, Math.max(sheetSizeMTRef.current, maxSnap));
      if (n.value === closed) {
        onDragEndCloseMT();
      } else {
        onDragEndSnapMT(n.index);
      }
    } else {
      onDragEndSnapMT(index);
    }
  }

  const {
    handleTouchStartMT: handleTouchStartW,
    handleTouchMoveMT: handleTouchMoveW,
    handleTouchEndMT: handleTouchEndW,
  } = useDrag({
    side,
    enableRTL,
    claimedGestureAngles,
    onStartMT: handleTouchStartMT,
    onFirstMoveMT: handleFirstMoveMT,
    onMoveMT: handleTouchMoveMT,
    onEndMT: handleTouchEndMT,
  });

  return {
    handleTouchStartMT: handleTouchStartW,
    handleTouchMoveMT: handleTouchMoveW,
    handleTouchEndMT: handleTouchEndW,
  };
}

function getRubberBandConfig(
  rubberBand: SnapTouchOptions["rubberBand"],
  viewportSize: number,
  sheetSize: number,
) {
  "main thread";
  const enabled = rubberBand !== false;
  if (!enabled) {
    return { enabled, coeff: 0, max: 0 };
  }

  const coeff =
    typeof rubberBand === "number"
      ? rubberBand
      : typeof rubberBand === "object"
        ? (rubberBand.coeff ?? 0.5)
        : 0.5;

  const defaultMax = Math.max(0, Math.min(80, viewportSize - sheetSize));

  const max = typeof rubberBand === "object" ? (rubberBand.max ?? defaultMax) : defaultMax;

  return { enabled, coeff, max };
}
