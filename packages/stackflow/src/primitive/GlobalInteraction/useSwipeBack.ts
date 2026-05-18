import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useEffect, useMemo, useRef } from "react";
import { useGlobalInteractionContext } from "./useGlobalInteractionContext";

export interface UseSwipeBackProps {
  /**
   * The threshold to determine whether the swipe back is intentional, by displacement ratio.
   * @default 0.4
   */
  swipeBackDisplacementRatioThreshold?: number;

  /**
   * The threshold to determine whether the swipe back is intentional, by velocity.
   * @default 1
   */
  swipeBackVelocityThreshold?: number;

  onSwipeBackStart?: () => void;
  onSwipeBackMove?: (props: { displacement: number; displacementRatio: number }) => void;
  onSwipeBackEnd?: (props: { swiped: boolean }) => void;
}

export function useSwipeBack(props: UseSwipeBackProps) {
  const {
    swipeBackDisplacementRatioThreshold: displacementRatioThreshold,
    swipeBackVelocityThreshold: velocityThreshold,
  } = props;

  const onSwipeStart = useCallbackRef(props.onSwipeBackStart);
  const onSwipeMove = useCallbackRef(props.onSwipeBackMove);
  const onSwipeEnd = useCallbackRef(props.onSwipeBackEnd);

  const { startSwipeBack, moveSwipeBack, endSwipeBack, resetSwipeBack } =
    useGlobalInteractionContext();

  const rAFLockRef = useRef(false);

  useEffect(() => {
    return () => {
      resetSwipeBack();
    };
  }, [resetSwipeBack]);

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
          startSwipeBack({ x0, t0 });
          onSwipeStart();
        },
        onTouchMove: (e: React.TouchEvent) => {
          // rAF lock: process at most once per animation frame
          if (rAFLockRef.current) return;
          rAFLockRef.current = true;
          const x = e.touches[0].clientX;
          const t = Date.now();
          requestAnimationFrame(() => {
            const ctx = moveSwipeBack({ x, t });
            rAFLockRef.current = false;
            onSwipeMove({
              displacement: ctx.displacement,
              displacementRatio: ctx.displacementRatio,
            });
          });
        },
        onTouchEnd: () => {
          const swiped = endSwipeBack({ displacementRatioThreshold, velocityThreshold });
          onSwipeEnd({ swiped });
        },
        onTouchCancel: () => {
          const swiped = endSwipeBack({ displacementRatioThreshold, velocityThreshold });
          onSwipeEnd({ swiped });
        },
      } as React.HTMLAttributes<HTMLElement>,
    }),
    [
      startSwipeBack,
      moveSwipeBack,
      endSwipeBack,
      onSwipeStart,
      onSwipeMove,
      onSwipeEnd,
      displacementRatioThreshold,
      velocityThreshold,
    ],
  );
}
