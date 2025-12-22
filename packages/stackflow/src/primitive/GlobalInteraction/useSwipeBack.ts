import { useEffect, useMemo } from "react";
import type { SwipeBackProps } from "./useGlobalInteraction";
import { useGlobalInteractionContext } from "./useGlobalInteractionContext";

export interface UseSwipeBackProps extends SwipeBackProps {}

export function useSwipeBack(props: UseSwipeBackProps) {
  const globalInteraction = useGlobalInteractionContext();
  const events = globalInteraction.getSwipeBackEvents(props);

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
      layerProps: {
        onAnimationEnd: (e) => {
          if (e.target === e.currentTarget) {
            events.reset();
          }
        },
        onTransitionEnd: (e) => {
          if (e.target === e.currentTarget) {
            events.reset();
          }
        },
      } as React.HTMLAttributes<HTMLDivElement>,
      edgeProps: {
        tabIndex: -1,
        onTouchStart: (e) => {
          const x0 = e.touches[0].clientX;
          const t0 = Date.now();
          events.startSwipeBack({ x0, t0 });
        },
        onTouchMove: (e) => {
          const x = e.touches[0].clientX;
          const t = Date.now();
          events.moveSwipeBack({ x, t });
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
