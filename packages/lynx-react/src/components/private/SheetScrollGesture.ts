import { useMainThreadRef } from "@lynx-js/react";
import type { IntrinsicElements, MainThread } from "@lynx-js/types";

type ScrollEvent = Parameters<NonNullable<IntrinsicElements["scroll-view"]["bindscroll"]>>[0];

// Below lynx-ui-sheet's 8px drag threshold, so the owner is settled before the sheet can claim a move.
const GESTURE_DECISION_DISTANCE = 4;

/**
 * Main thread handlers for a vertical `scroll-view` inside a lynx-ui sheet. The sheet drags on every
 * vertical move that bubbles up to it, whatever the scroll position, so these stop the moves of a
 * gesture the scroll-view owns. The sheet owns a gesture only when it starts at the top and moves
 * down.
 */
export function useSheetScrollGestureProps(): Record<string, unknown> {
  const scrollTopRef = useMainThreadRef(0);
  const gestureRef = useMainThreadRef<{ startY: number; owner: "undecided" | "scroll" | "sheet" }>({
    startY: 0,
    owner: "undecided",
  });

  function handleScroll(event: ScrollEvent) {
    "main thread";

    scrollTopRef.current = event.detail.scrollTop;
  }

  function handleTouchStart(event: MainThread.TouchEvent) {
    "main thread";

    gestureRef.current = {
      startY: event.detail.y,
      owner: scrollTopRef.current > 0 ? "scroll" : "undecided",
    };
  }

  function handleTouchMove(event: MainThread.TouchEvent) {
    "main thread";

    const gesture = gestureRef.current;
    if (gesture.owner === "undecided") {
      const deltaY = event.detail.y - gesture.startY;
      if (Math.abs(deltaY) < GESTURE_DECISION_DISTANCE) {
        event.stopPropagation();
        return;
      }

      gesture.owner = deltaY > 0 ? "sheet" : "scroll";
    }
    if (gesture.owner === "scroll") event.stopPropagation();
  }

  return {
    "main-thread:bindscroll": handleScroll,
    "main-thread:bindtouchstart": handleTouchStart,
    "main-thread:bindtouchmove": handleTouchMove,
  };
}
