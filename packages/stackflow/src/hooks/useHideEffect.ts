import { useStack } from "@stackflow/react";
import { useNullableActivity } from "@stackflow/react-ui-core";
import { useEffect, useLayoutEffect } from "react";

export type ActivityType = "full-screen" | "overlay";

export const DEFAULT_ACTIVITY_TYPE: ActivityType = "full-screen";

interface HideRegistryEntry {
  ref: React.RefObject<HTMLElement>;
  activityType: ActivityType;
  zIndex: number;
}

const hideRegistry = new Map<string, HideRegistryEntry>();

export interface UseHideEffectParams {
  ref: React.RefObject<HTMLElement>;
  activityType: ActivityType;
}

/**
 * Applies `display: none` to activities hidden behind the topmost full-screen activity.
 *
 * Algorithm (top → bottom):
 * 1. Skip overlay activities (they don't trigger hiding).
 * 2. First full-screen + `enter-done` = "anchor".
 *    - 1 activity below anchor: keep visible (pop/swipe-back readiness).
 *    - All below that: `display: none`.
 * 3. During transitions (no `enter-done` top) or overlay-only stacks: nothing hidden.
 */
export function useHideEffect(params: UseHideEffectParams): void {
  const { ref, activityType } = params;
  const activity = useNullableActivity();
  const stack = useStack();

  const activityId = activity?.id;
  const zIndex = activity?.zIndex ?? 0;

  useEffect(() => {
    if (!activityId) return;

    hideRegistry.set(activityId, { ref, activityType, zIndex });

    return () => {
      hideRegistry.delete(activityId);
    };
  }, [activityId, ref, activityType, zIndex]);

  // useLayoutEffect to apply display before browser paint (prevents flicker)
  useLayoutEffect(() => {
    if (!activityId || !ref.current) return;

    const shouldHide = computeShouldHide(activityId, stack.activities);
    ref.current.style.display = shouldHide ? "none" : "";

    return () => {
      if (ref.current) {
        ref.current.style.display = "";
      }
    };
  }, [activityId, stack.activities, ref]);
}

function computeShouldHide(
  activityId: string,
  stackActivities: readonly { id: string; zIndex: number; transitionState: string }[],
): boolean {
  const activityMap = new Map(stackActivities.map((a) => [a.id, a]));

  const sorted = [...hideRegistry.entries()]
    .filter(([id]) => {
      const sa = activityMap.get(id);
      return sa && sa.transitionState !== "exit-done";
    })
    .sort(([, a], [, b]) => b.zIndex - a.zIndex);

  if (sorted.length === 0) return false;

  const [topId] = sorted[0];
  const topActivity = activityMap.get(topId);
  if (!topActivity || topActivity.transitionState !== "enter-done") {
    return false;
  }

  let anchorIndex = -1;

  for (let i = 0; i < sorted.length; i++) {
    const [id, entry] = sorted[i];

    if (entry.activityType === "overlay") continue;

    const sa = activityMap.get(id);
    if (entry.activityType === "full-screen" && sa?.transitionState === "enter-done") {
      anchorIndex = i;
      break;
    }

    // full-screen but not enter-done — transition in progress
    break;
  }

  if (anchorIndex === -1) return false;

  // anchor + 1: keep visible (pop/swipe-back readiness)
  // anchor + 2+: hide
  for (let i = anchorIndex + 2; i < sorted.length; i++) {
    if (sorted[i][0] === activityId) return true;
  }

  return false;
}
