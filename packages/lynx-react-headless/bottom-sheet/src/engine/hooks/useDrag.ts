// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace.
import { useMainThreadRef } from "@lynx-js/react";

import type { MainThread } from "@lynx-js/types";

import type { SheetSide } from "../types";
import { getDefaultClaimedGestureAngles, resolveSheetSide } from "../utils";

const GESTURE_THRESHOLD = 8;

export interface UseDragOptions {
  side?: SheetSide;
  enableRTL?: boolean;
  claimedGestureAngles?: [number, number][];
  onStartMT?: (e: MainThread.TouchEvent) => void;
  onFirstMoveMT?: (e: MainThread.TouchEvent) => void;
  onMoveMT: (e: MainThread.TouchEvent) => void;
  onEndMT: (e: MainThread.TouchEvent) => void;
}

function isAngleInRanges(angle: number, ranges: [number, number][]) {
  "main thread";
  return ranges.some(([start, end]) => {
    if (start <= end) {
      return angle >= start && angle <= end;
    }
    return angle >= start || angle <= end;
  });
}

export function useDrag({
  side = "bottom",
  enableRTL = false,
  claimedGestureAngles = getDefaultClaimedGestureAngles(resolveSheetSide(side, enableRTL)),
  onStartMT,
  onFirstMoveMT,
  onMoveMT,
  onEndMT,
}: UseDragOptions) {
  const gestureLockedMTRef = useMainThreadRef<boolean>(false);
  const isMainAxisLockedMTRef = useMainThreadRef<boolean>(false);
  const touchStartMTRef = useMainThreadRef<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  function handleTouchStartMT(event: MainThread.TouchEvent) {
    "main thread";
    touchStartMTRef.current = {
      x: event.detail.x,
      y: event.detail.y,
    };
    gestureLockedMTRef.current = false;
    isMainAxisLockedMTRef.current = false;
    onStartMT?.(event);
  }

  function handleTouchMoveMT(event: MainThread.TouchEvent) {
    "main thread";

    if (isMainAxisLockedMTRef.current) {
      return;
    }

    const deltaX = event.detail.x - touchStartMTRef.current.x;
    const deltaY = event.detail.y - touchStartMTRef.current.y;
    const displacement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (!gestureLockedMTRef.current && displacement > GESTURE_THRESHOLD) {
      const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

      if (isAngleInRanges(angle, claimedGestureAngles)) {
        gestureLockedMTRef.current = true;
        onFirstMoveMT?.(event);
      } else {
        isMainAxisLockedMTRef.current = true;
        gestureLockedMTRef.current = true;
        return;
      }
    }

    if (gestureLockedMTRef.current && !isMainAxisLockedMTRef.current) {
      onMoveMT(event);
    }
  }

  function handleTouchEndMT(event: MainThread.TouchEvent) {
    "main thread";
    if (!isMainAxisLockedMTRef.current) {
      onEndMT(event);
    }
    gestureLockedMTRef.current = false;
    isMainAxisLockedMTRef.current = false;
  }

  return {
    handleTouchStartMT,
    handleTouchMoveMT,
    handleTouchEndMT,
  };
}
