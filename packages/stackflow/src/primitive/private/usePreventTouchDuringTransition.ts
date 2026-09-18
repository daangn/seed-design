import type { Stack } from "@stackflow/core";
import { useStack } from "@stackflow/react";
import { useEffect } from "react";

export function usePreventTouchDuringTransition({
  ref,
}: {
  ref: React.RefObject<HTMLElement | null>;
}) {
  const globalTransitionState = (useStack() as Stack | null)?.globalTransitionState;

  useEffect(() => {
    const element = ref.current;
    if (!element || !globalTransitionState || globalTransitionState === "idle") return;

    const preventTouch = (event: TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    // Capture phase, so touches never reach children (the edge swipe area included) mid-transition.
    const events = ["touchstart", "touchmove", "touchend", "touchcancel"] as const;
    for (const type of events) element.addEventListener(type, preventTouch, { capture: true });

    return () => {
      for (const type of events) element.removeEventListener(type, preventTouch, { capture: true });
    };
  }, [ref, globalTransitionState]);
}
