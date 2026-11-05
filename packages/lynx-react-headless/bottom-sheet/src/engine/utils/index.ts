// Copyright 2026 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
// Modified by SEED Design: internalized and adapted to the SEED workspace.
import { PresenceState } from "@lynx-js/lynx-ui-presence";

export {
  getDefaultClaimedGestureAngles,
  getDefaultRubberBand,
  getMainAxisLayoutSize,
  getMainAxisSize,
  getMaxSnapSize,
  getMainAxisTouchCoordinate,
  getNextMainAxisOffset,
  getSheetTransform,
  isHorizontalSide,
  resolveSheetSide,
  toPxJS,
} from "./direction";
export type { SheetResolvedSide } from "./direction";

export function rubberEffect(original: number, max: number, coeff = 0.3): number {
  "main thread";
  if (original === 0 || max === 0) return 0;
  const abs = Math.abs(original);
  const target = (1.0 - 1.0 / ((abs * coeff) / max + 1.0)) * max;
  return Math.sign(original) * target;
}

export function clamp(targetY: number, sheetHeight: number) {
  "main thread";
  if (sheetHeight <= 0) return Math.max(0, targetY);
  return Math.min(Math.max(targetY, 0), sheetHeight);
}

export function findNearestSnap(value: number, snapOffsets: number[], sheetHeight: number) {
  "main thread";
  if (snapOffsets.length === 0) return { index: 0, value: 0 };
  let idx = 0;
  let best = Number.POSITIVE_INFINITY;
  for (let i = 0; i < snapOffsets.length; i++) {
    const target = clamp(snapOffsets[i], sheetHeight);
    const d = Math.abs(target - value);
    if (d < best) {
      best = d;
      idx = i;
    }
  }
  return {
    index: idx,
    value: clamp(snapOffsets[idx], sheetHeight),
  };
}

export const resolveBusyState = (state: PresenceState) => {
  switch (state) {
    case PresenceState.Entering:
    case PresenceState.DelayedEntering:
    case PresenceState.Leaving:
      return true;
    default:
      return false;
  }
};
