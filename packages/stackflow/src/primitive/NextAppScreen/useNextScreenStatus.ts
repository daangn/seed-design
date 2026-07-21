import { useStack } from "@stackflow/react";
import { useNullableActivity } from "@stackflow/react-ui-core";
import { useSyncExternalStore } from "react";
import { useNextScreenRegistry } from "./registry";
import type { NextAppScreenTransitionStyle, NextScreenState } from "./types";

type NullableActivity = ReturnType<typeof useNullableActivity>;
type StackActivity = NonNullable<ReturnType<typeof useStack>>["activities"][number];

const noopSubscribe = () => () => {};
const zero = () => 0;

interface DeriveScreenStateArgs {
  activity: NullableActivity;
  isTop: boolean;
  topActivity: StackActivity | undefined;
  topIsNextScreen: boolean;
}

function deriveScreenState({
  activity,
  isTop,
  topActivity,
  topIsNextScreen,
}: DeriveScreenStateArgs): NextScreenState {
  if (!activity) return "idle";

  // Own exit wins over every positional branch: a screen popped while the
  // screen above it is still exiting (pop during pop) must run its own exit
  // in parallel — its unmount timer (own pop + transitionDuration) doesn't
  // wait for the top screen either.
  if (activity.transitionState === "exit-active" || activity.transitionState === "exit-done") {
    return "pop";
  }

  if (isTop) {
    switch (activity.transitionState) {
      case "enter-active":
        return "push";
      default:
        return "idle";
    }
  }

  // A non-Next top (overlay activity, legacy AppScreen, ...) must not trigger
  // behind visuals — this screen keeps its resting position.
  if (!topIsNextScreen) return "idle";

  switch (topActivity?.transitionState) {
    case "enter-active":
      return "push-behind";
    case "exit-active":
    case "exit-done":
      return "pop-behind";
    default:
      return "idle-behind";
  }
}

/**
 * Derives this screen's `data-screen-state` and the transition style its
 * visuals should follow.
 *
 * Behind screens follow the TOP screen's transitionStyle via the per-stack
 * registry: registration happens in a layout effect and notifies subscribers
 * synchronously, so followers re-render before paint — correctness never
 * depends on a one-render-stale DOM read.
 */
export function useNextScreenStatus(ownTransitionStyle: NextAppScreenTransitionStyle) {
  const activity = useNullableActivity();
  const stack = useStack();
  const registry = useNextScreenRegistry();

  useSyncExternalStore(registry?.subscribe ?? noopSubscribe, registry?.getVersion ?? zero, zero);

  const isTop = activity?.isTop ?? true;
  const topActivity = stack?.activities.find((stackActivity) => stackActivity.isTop);
  const topRegistration =
    !isTop && topActivity && registry ? registry.get(topActivity.id) : undefined;

  return {
    activity,
    isTop,
    screenState: deriveScreenState({
      activity,
      isTop,
      topActivity,
      topIsNextScreen: topRegistration !== undefined,
    }),
    effectiveTransitionStyle: isTop
      ? ownTransitionStyle
      : (topRegistration?.transitionStyle ?? ownTransitionStyle),
  };
}
