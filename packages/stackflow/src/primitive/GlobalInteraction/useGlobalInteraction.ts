import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTopActivity } from "../private/useTopActivity";

export type SwipeBackState = "idle" | "swiping" | "canceling" | "completing";

export type UseGlobalInteractionReturn = ReturnType<typeof useGlobalInteraction>;

export interface SwipeBackContext {
  x0: number;
  t0: number;
  displacement: number;
  displacementRatio: number;
  velocity: number;
}

export interface SwipeBackProps {
  /**
   * The threshold to determine whether the swipe back is intentional.
   * @default 0.4
   */
  swipeBackDisplacementRatioThreshold?: number;

  /**
   * The threshold to determine whether the swipe back is intentional.
   * @default 1
   */
  swipeBackVelocityThreshold?: number;

  onSwipeBackStart?: () => void;
  onSwipeBackMove?: (props: { displacement: number; displacementRatio: number }) => void;
  onSwipeBackEnd?: (props: { swiped: boolean }) => void;
}

export interface StartSwipeBackProps {
  x0: number;
  t0: number;
}

export interface MoveSwipeBackProps {
  x: number;
  t: number;
}

// biome-ignore lint/suspicious/noEmptyInterface: intentionally empty for future extension
export interface EndSwipeBackProps {}

export function useGlobalInteraction() {
  const [swipeBackState, setSwipeBackState] = useState<SwipeBackState>("idle");

  const swipeBackContextRef = useRef<SwipeBackContext>({
    x0: 0,
    t0: 0,
    displacement: 0,
    displacementRatio: 0,
    velocity: 0,
  });
  const stackRef = useRef<HTMLDivElement>(null);

  const setSwipeBackContext = useCallback((ctx: SwipeBackContext) => {
    swipeBackContextRef.current = ctx;
    stackRef.current?.style.setProperty(
      "--swipe-back-displacement",
      `${ctx.displacement.toString()}px`,
    );
    stackRef.current?.style.setProperty(
      "--swipe-back-displacement-ratio",
      ctx.displacementRatio.toString(),
    );
  }, []);

  const getSwipeBackEvents = useCallback(
    (props: SwipeBackProps) => {
      const {
        swipeBackDisplacementRatioThreshold: displacementRatioThreshold = 0.4,
        swipeBackVelocityThreshold: velocityThreshold = 1,
      } = props;
      const onSwipeStart = useCallbackRef(props.onSwipeBackStart);
      const onSwipeMove = useCallbackRef(props.onSwipeBackMove);
      const onSwipeEnd = useCallbackRef(props.onSwipeBackEnd);

      const startSwipeBack = useCallback(
        ({ x0, t0 }: StartSwipeBackProps) => {
          setSwipeBackContext({
            x0,
            t0,
            displacement: 0,
            displacementRatio: 0,
            velocity: 0,
          });
          setSwipeBackState((prev) => (prev === "swiping" ? prev : "swiping"));
          onSwipeStart?.();
        },
        [onSwipeStart],
      );

      const moveSwipeBack = useCallback(
        ({ x, t }: MoveSwipeBackProps) => {
          const displacement = x - swipeBackContextRef.current.x0;
          const displacementRatio = displacement / window.innerWidth;
          const velocity = displacement / (t - swipeBackContextRef.current.t0);
          setSwipeBackContext({
            ...swipeBackContextRef.current,
            displacement,
            displacementRatio,
            velocity,
          });
          setSwipeBackState((prev) => (prev === "swiping" ? prev : "swiping"));
          onSwipeMove?.({ displacement, displacementRatio });
        },
        [onSwipeMove],
      );

      const endSwipeBack = useCallback(
        (_: EndSwipeBackProps) => {
          const swiped =
            swipeBackContextRef.current.displacementRatio > displacementRatioThreshold ||
            swipeBackContextRef.current.velocity > velocityThreshold;

          if (swiped) {
            stackRef.current?.style.setProperty("--swipe-back-target", "100%");
            setSwipeBackState("completing");
          } else {
            stackRef.current?.style.setProperty("--swipe-back-target", "0");
            setSwipeBackState("canceling");
          }

          onSwipeEnd?.({ swiped });
        },
        [onSwipeEnd, displacementRatioThreshold, velocityThreshold],
      );

      const reset = useCallback(() => {
        setSwipeBackContext({
          x0: 0,
          t0: 0,
          displacement: 0,
          displacementRatio: 0,
          velocity: 0,
        });
        stackRef.current?.style.setProperty("--swipe-back-target", "0");
        setSwipeBackState("idle");
      }, []);

      return useMemo(
        () => ({
          startSwipeBack,
          moveSwipeBack,
          endSwipeBack,
          reset,
        }),
        [startSwipeBack, moveSwipeBack, endSwipeBack, reset],
      );
    },
    [setSwipeBackContext],
  );

  const topActivity = useTopActivity();

  const stackProps = useMemo(
    () => ({
      "data-swipe-back-state": swipeBackState,
      "data-global-transition-state": topActivity.transitionState,
      "data-top-activity-type": topActivity.activityType,
      "data-top-transition-style": topActivity.transitionStyle,
    }),
    [
      swipeBackState,
      topActivity.transitionState,
      topActivity.activityType,
      topActivity.transitionStyle,
    ],
  ) as React.HTMLAttributes<HTMLElement>;

  return useMemo(
    () => ({
      stackRef,
      swipeBackContextRef,
      swipeBackState,
      setSwipeBackState,
      setSwipeBackContext,
      getSwipeBackEvents,

      stackProps,
    }),
    [swipeBackState, setSwipeBackContext, getSwipeBackEvents, stackProps],
  );
}
