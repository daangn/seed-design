import { useEffect, useMemo, useRef } from "react";
import type { SwipeBackProps } from "./useGlobalInteraction";
import { useGlobalInteractionContext } from "./useGlobalInteractionContext";

export interface UseSwipeBackProps extends SwipeBackProps {}

export function useSwipeBack(props: UseSwipeBackProps) {
  const globalInteraction = useGlobalInteractionContext();
  const events = globalInteraction.getSwipeBackEvents(props);
  const rAFLockRef = useRef(false);

  useEffect(() => {
    return () => {
      events.reset();
    };
  }, [events]);

  return useMemo(
    () => ({
      activityProps: {
        "data-swipe-back": "",
      } as React.HTMLAttributes<HTMLDivElement>,
      layerProps: {} as React.HTMLAttributes<HTMLDivElement>,
      edgeProps: {
        tabIndex: -1,
        onTouchStart: (e: React.TouchEvent) => {
          const x0 = e.touches[0].clientX;
          const t0 = Date.now();
          events.startSwipeBack({ x0, t0 });
        },
        onTouchMove: (e: React.TouchEvent) => {
          // rAF lock: process at most once per animation frame
          if (rAFLockRef.current) return;
          rAFLockRef.current = true;
          const x = e.touches[0].clientX;
          const t = Date.now();
          requestAnimationFrame(() => {
            events.moveSwipeBack({ x, t });
            rAFLockRef.current = false;
          });
        },
        onTouchEnd: () => {
          events.endSwipeBack({});
        },
        onTouchCancel: () => {
          events.endSwipeBack({});
        },
      } as React.HTMLAttributes<HTMLElement>,
    }),
    [events],
  );
}
