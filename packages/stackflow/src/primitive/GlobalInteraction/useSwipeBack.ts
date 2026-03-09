import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import type { SwipeBackProps } from "./useGlobalInteraction";
import { useGlobalInteractionContext } from "./useGlobalInteractionContext";

export interface UseSwipeBackProps extends SwipeBackProps {}

export function useSwipeBack(props: UseSwipeBackProps) {
  const globalInteraction = useGlobalInteractionContext();
  const {
    swipeBackDisplacementRatioThreshold,
    swipeBackVelocityThreshold,
    onSwipeBackStart,
    onSwipeBackMove,
    onSwipeBackEnd,
  } = props;

  // Store callbacks in refs to stabilize `events` identity across re-renders.
  // Without this, inline callbacks cause `events` to be recreated every render,
  // triggering useEffect cleanup which calls reset() during completing/canceling.
  const onSwipeBackStartRef = useRef(onSwipeBackStart);
  const onSwipeBackMoveRef = useRef(onSwipeBackMove);
  const onSwipeBackEndRef = useRef(onSwipeBackEnd);

  useLayoutEffect(() => {
    onSwipeBackStartRef.current = onSwipeBackStart;
    onSwipeBackMoveRef.current = onSwipeBackMove;
    onSwipeBackEndRef.current = onSwipeBackEnd;
  });

  const { getSwipeBackEvents } = globalInteraction;
  const events = useMemo(
    () =>
      getSwipeBackEvents({
        swipeBackDisplacementRatioThreshold,
        swipeBackVelocityThreshold,
        onSwipeBackStart: (...args: []) => onSwipeBackStartRef.current?.(...args),
        onSwipeBackMove: (...args: [{ displacement: number; displacementRatio: number }]) =>
          onSwipeBackMoveRef.current?.(...args),
        onSwipeBackEnd: (...args: [{ swiped: boolean }]) => onSwipeBackEndRef.current?.(...args),
      }),
    [getSwipeBackEvents, swipeBackDisplacementRatioThreshold, swipeBackVelocityThreshold],
  );

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
