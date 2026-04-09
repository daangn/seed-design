import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTopActivity } from "../private/useTopActivity";
import {
  type SwipeTargets,
  applySwipeStyles,
  clearInlineStyles,
  findSwipeTargets,
} from "./swipe-animation";

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

  // Cached swipe targets — populated once on startSwipeBack, reused during gesture
  const cachedTargetsRef = useRef<SwipeTargets | null>(null);

  const getSwipeBackEvents = useCallback((props: SwipeBackProps) => {
    const {
      swipeBackDisplacementRatioThreshold: displacementRatioThreshold = 0.4,
      swipeBackVelocityThreshold: velocityThreshold = 1,
    } = props;
    const onSwipeStart = useCallbackRef(props.onSwipeBackStart);
    const onSwipeMove = useCallbackRef(props.onSwipeBackMove);
    const onSwipeEnd = useCallbackRef(props.onSwipeBackEnd);

    const startSwipeBack = useCallback(
      ({ x0, t0 }: StartSwipeBackProps) => {
        swipeBackContextRef.current = {
          x0,
          t0,
          displacement: 0,
          displacementRatio: 0,
          velocity: 0,
        };

        // Cache target elements once per gesture
        if (stackRef.current) {
          cachedTargetsRef.current = findSwipeTargets(stackRef.current);
        }

        setSwipeBackState((prev) => (prev === "swiping" ? prev : "swiping"));
        onSwipeStart?.();
      },
      [onSwipeStart],
    );

    const moveSwipeBack = useCallback(
      ({ x, t }: MoveSwipeBackProps) => {
        const displacement = Math.max(0, x - swipeBackContextRef.current.x0);
        const displacementRatio = displacement / window.innerWidth;
        const velocity = displacement / (t - swipeBackContextRef.current.t0);

        swipeBackContextRef.current = {
          ...swipeBackContextRef.current,
          displacement,
          displacementRatio,
          velocity,
        };

        // Direct inline style on each element instead of CSS variables on stack root.
        // Inline style only triggers repaint on that element, not cascading recalc.
        const targets = cachedTargetsRef.current;
        if (targets) {
          applySwipeStyles(targets, displacement, displacementRatio);
        }

        onSwipeMove?.({ displacement, displacementRatio });
      },
      [onSwipeMove],
    );

    const endSwipeBack = useCallback(
      (_: EndSwipeBackProps) => {
        const ctx = swipeBackContextRef.current;
        const swiped =
          ctx.displacementRatio > displacementRatioThreshold || ctx.velocity > velocityThreshold;

        // 1. Remove inline styles so CSS recipe regains control
        if (cachedTargetsRef.current) {
          clearInlineStyles(cachedTargetsRef.current);
          cachedTargetsRef.current = null;
        }

        // 2. Set CSS variables ONCE to current displacement.
        //    This ensures the CSS recipe transition starts from the correct position.
        stackRef.current?.style.setProperty("--swipe-back-displacement", `${ctx.displacement}px`);
        stackRef.current?.style.setProperty(
          "--swipe-back-displacement-ratio",
          ctx.displacementRatio.toString(),
        );

        // 3. Set target and state — CSS recipe transition takes over
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
      // Clear CSS variables
      stackRef.current?.style.setProperty("--swipe-back-displacement", "0px");
      stackRef.current?.style.setProperty("--swipe-back-displacement-ratio", "0");
      stackRef.current?.style.setProperty("--swipe-back-target", "0");
      setSwipeBackState("idle");
      cachedTargetsRef.current = null;
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
  }, []);

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
      getSwipeBackEvents,

      stackProps,
    }),
    [swipeBackState, getSwipeBackEvents, stackProps],
  );
}
