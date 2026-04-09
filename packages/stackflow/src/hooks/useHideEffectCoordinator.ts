import { useStack } from "@stackflow/react";
import { useLayoutEffect } from "react";
import { hideRegistry } from "./useHideEffect";

/**
 * Centralized coordinator that computes and applies `display: none`
 * for all registered activities. Called once at the GlobalInteraction level
 * to avoid per-activity re-renders from `useStack()`.
 */
export function useHideEffectCoordinator(): void {
  const stack = useStack();

  useLayoutEffect(() => {
    const hiddenIds = computeHiddenIds(stack.activities);

    for (const [id, entry] of hideRegistry) {
      if (!entry.ref.current) continue;
      entry.ref.current.style.display = hiddenIds.has(id) ? "none" : "";
    }

    return () => {
      for (const [, entry] of hideRegistry) {
        if (entry.ref.current) {
          entry.ref.current.style.display = "";
        }
      }
    };
  }, [stack.activities]);
}

function computeHiddenIds(
  stackActivities: readonly { id: string; zIndex: number; transitionState: string }[],
): Set<string> {
  const activityMap = new Map(stackActivities.map((a) => [a.id, a]));

  const sorted = [...hideRegistry.entries()]
    .filter(([id]) => {
      const sa = activityMap.get(id);
      return sa && sa.transitionState !== "exit-done";
    })
    .sort(([, a], [, b]) => b.zIndex - a.zIndex);

  if (sorted.length === 0) return new Set();

  const [topId] = sorted[0];
  const topActivity = activityMap.get(topId);
  if (!topActivity || topActivity.transitionState !== "enter-done") {
    return new Set();
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

    break;
  }

  if (anchorIndex === -1) return new Set();

  // anchor + 1: keep visible (pop/swipe-back readiness)
  // anchor + 2+: hide
  const hidden = new Set<string>();
  for (let i = anchorIndex + 2; i < sorted.length; i++) {
    hidden.add(sorted[i][0]);
  }

  return hidden;
}
