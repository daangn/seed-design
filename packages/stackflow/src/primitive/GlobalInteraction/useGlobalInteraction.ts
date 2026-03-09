import { useStack } from "@stackflow/react";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
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
  const stack = useStack();
  const swipeBackStateRef = useRef<SwipeBackState>("idle");
  const completingActivityIdRef = useRef<string | null>(null);

  // Bypass React for swipe-back state transitions.
  // Direct DOM writes eliminate the async re-render gap that causes jank
  // at swiping→completing/canceling transitions.
  const setSwipeBackState = useCallback((state: SwipeBackState) => {
    swipeBackStateRef.current = state;
    if (stackRef.current) {
      stackRef.current.dataset["swipeBackState"] = state;
    }
  }, []);

  const swipeBackContextRef = useRef<SwipeBackContext>({
    x0: 0,
    t0: 0,
    displacement: 0,
    displacementRatio: 0,
    velocity: 0,
  });
  const stackRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingMoveRef = useRef<MoveSwipeBackProps | null>(null);

  // Keep a ref to latest activities so event closures always see fresh data.
  const activitiesRef = useRef(stack.activities);
  activitiesRef.current = stack.activities;

  // CSS vars are set on the stack element (inherited by all children).
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

  const activities = stack.activities;

  // When completing, keep the completing CSS active (animation: none !important
  // suppresses the exit animation). Transition to idle once the exiting activity
  // reaches exit-done. Note: stackflow never removes exit-done activities from
  // the array, so we must check transitionState instead of array membership.
  useLayoutEffect(() => {
    if (swipeBackStateRef.current === "completing" && completingActivityIdRef.current) {
      const completingActivity = activities.find((a) => a.id === completingActivityIdRef.current);
      if (!completingActivity || completingActivity.transitionState === "exit-done") {
        setSwipeBackContext({
          x0: 0,
          t0: 0,
          displacement: 0,
          displacementRatio: 0,
          velocity: 0,
        });
        stackRef.current?.style.removeProperty("--swipe-back-target");
        setSwipeBackState("idle");
        completingActivityIdRef.current = null;
      }
    }
  }, [activities, setSwipeBackState, setSwipeBackContext]);

  const getSwipeBackEvents = useCallback(
    (props: SwipeBackProps) => {
      const {
        swipeBackDisplacementRatioThreshold: displacementRatioThreshold = 0.4,
        swipeBackVelocityThreshold: velocityThreshold = 1,
        onSwipeBackStart,
        onSwipeBackMove,
        onSwipeBackEnd,
      } = props;

      const startSwipeBack = ({ x0, t0 }: StartSwipeBackProps) => {
        setSwipeBackContext({
          x0,
          t0,
          displacement: 0,
          displacementRatio: 0,
          velocity: 0,
        });
        if (swipeBackStateRef.current !== "swiping") {
          setSwipeBackState("swiping");
        }
        onSwipeBackStart?.();
      };

      const moveSwipeBack = ({ x, t }: MoveSwipeBackProps) => {
        // Store latest touch position; only apply CSS vars once per animation frame
        pendingMoveRef.current = { x, t };

        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(() => {
            const pending = pendingMoveRef.current;
            if (pending) {
              const displacement = pending.x - swipeBackContextRef.current.x0;
              const displacementRatio = displacement / window.innerWidth;
              const velocity = displacement / (pending.t - swipeBackContextRef.current.t0);
              setSwipeBackContext({
                ...swipeBackContextRef.current,
                displacement,
                displacementRatio,
                velocity,
              });
              onSwipeBackMove?.({ displacement, displacementRatio });
            }
            rafIdRef.current = null;
          });
        }

        if (swipeBackStateRef.current !== "swiping") {
          setSwipeBackState("swiping");
        }
      };

      const endSwipeBack = (_: EndSwipeBackProps) => {
        // Cancel any pending rAF and flush the latest position immediately
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        const pending = pendingMoveRef.current;
        if (pending) {
          const displacement = pending.x - swipeBackContextRef.current.x0;
          const displacementRatio = displacement / window.innerWidth;
          const velocity = displacement / (pending.t - swipeBackContextRef.current.t0);
          setSwipeBackContext({
            ...swipeBackContextRef.current,
            displacement,
            displacementRatio,
            velocity,
          });
          pendingMoveRef.current = null;
        }

        const swiped =
          swipeBackContextRef.current.displacementRatio > displacementRatioThreshold ||
          swipeBackContextRef.current.velocity > velocityThreshold;

        // Two-frame technique: set --swipe-back-target to current displacement first,
        // then update to final value in next frame so CSS transition animates smoothly.
        const currentDisplacement = `${swipeBackContextRef.current.displacement}px`;

        if (swiped) {
          // Track which activity is being swiped away (use ref for fresh data).
          const currentTop = activitiesRef.current.find((a) => a.isTop);
          completingActivityIdRef.current = currentTop?.id ?? null;

          stackRef.current?.style.setProperty("--swipe-back-target", currentDisplacement);
          setSwipeBackState("completing");
          rafIdRef.current = requestAnimationFrame(() => {
            stackRef.current?.style.setProperty("--swipe-back-target", "100%");
            rafIdRef.current = null;
          });
        } else {
          stackRef.current?.style.setProperty("--swipe-back-target", currentDisplacement);
          setSwipeBackState("canceling");
          rafIdRef.current = requestAnimationFrame(() => {
            stackRef.current?.style.setProperty("--swipe-back-target", "0");
            rafIdRef.current = null;
          });
        }

        onSwipeBackEnd?.({ swiped });
      };

      const reset = () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        pendingMoveRef.current = null;

        // During completing, don't reset to idle. The completing CSS's
        // animation: none !important suppresses the exit animation.
        // The activities useLayoutEffect handles cleanup when the
        // popped activity is removed from the array.
        if (swipeBackStateRef.current === "completing") {
          return;
        }

        setSwipeBackContext({
          x0: 0,
          t0: 0,
          displacement: 0,
          displacementRatio: 0,
          velocity: 0,
        });
        stackRef.current?.style.setProperty("--swipe-back-target", "0");
        setSwipeBackState("idle");
      };

      return {
        startSwipeBack,
        moveSwipeBack,
        endSwipeBack,
        reset,
      };
    },
    [setSwipeBackContext, setSwipeBackState],
  );

  const topActivity = useTopActivity();

  // Set initial swipe-back state on mount
  useLayoutEffect(() => {
    if (stackRef.current) {
      stackRef.current.dataset["swipeBackState"] = "idle";
    }
  }, []);

  const stackProps = useMemo(
    () => ({
      // data-swipe-back-state is set directly via DOM for zero-latency transitions
      "data-global-transition-state": topActivity.transitionState,
      "data-top-activity-type": topActivity.activityType,
      "data-top-transition-style": topActivity.transitionStyle,
    }),
    [topActivity.transitionState, topActivity.activityType, topActivity.transitionStyle],
  ) as React.HTMLAttributes<HTMLElement>;

  return useMemo(
    () => ({
      stackRef,
      swipeBackContextRef,
      swipeBackState: swipeBackStateRef.current,
      setSwipeBackState,
      setSwipeBackContext,
      getSwipeBackEvents,

      stackProps,
    }),
    [setSwipeBackState, setSwipeBackContext, getSwipeBackEvents, stackProps],
  );
}
