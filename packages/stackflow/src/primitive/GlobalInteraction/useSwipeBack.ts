import { useEffect, useMemo, useRef } from "react";
import type { SwipeBackProps } from "./useGlobalInteraction";
import { useGlobalInteractionContext } from "./useGlobalInteractionContext";

export interface UseSwipeBackProps extends SwipeBackProps {}

export function useSwipeBack(props: UseSwipeBackProps) {
  const globalInteraction = useGlobalInteractionContext();
  const events = globalInteraction.getSwipeBackEvents(props);
  const edgeRef = useRef<HTMLElement>(null);
  const rAFLockRef = useRef(false);

  useEffect(() => {
    return () => {
      events.reset();
    };
  }, [events]);

  // Passive native touchmove listener — avoids compositor blocking
  useEffect(() => {
    const edge = edgeRef.current;
    if (!edge) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (rAFLockRef.current) return;
      rAFLockRef.current = true;
      requestAnimationFrame(() => {
        const touch = e.touches[0];
        if (touch) {
          events.moveSwipeBack({ x: touch.clientX, t: Date.now() });
        }
        rAFLockRef.current = false;
      });
    };

    edge.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => edge.removeEventListener("touchmove", handleTouchMove);
  }, [events]);

  return useMemo(
    () => ({
      activityProps: {
        "data-swipe-back": "",
      } as React.HTMLAttributes<HTMLDivElement>,
      layerProps: {
        onAnimationEnd: (e: React.AnimationEvent) => {
          if (e.target === e.currentTarget) {
            events.reset();
          }
        },
        onTransitionEnd: (e: React.TransitionEvent) => {
          if (e.target === e.currentTarget) {
            events.reset();
          }
        },
      } as React.HTMLAttributes<HTMLDivElement>,
      edgeProps: {
        ref: edgeRef,
        tabIndex: -1,
        onTouchStart: (e: React.TouchEvent) => {
          const x0 = e.touches[0].clientX;
          const t0 = Date.now();
          events.startSwipeBack({ x0, t0 });
        },
        // onTouchMove handled by passive native listener above
        onTouchEnd: () => {
          events.endSwipeBack({});
        },
        onTouchCancel: () => {
          events.endSwipeBack({});
        },
      } as React.HTMLAttributes<HTMLElement> & { ref: React.RefObject<HTMLElement | null> },
    }),
    [events],
  );
}
