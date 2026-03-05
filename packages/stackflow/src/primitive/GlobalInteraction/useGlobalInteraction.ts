import { useStack } from "@stackflow/react";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
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
  const [swipeBackState, setSwipeBackState] = useState<SwipeBackState>("idle");

  const swipeBackContextRef = useRef<SwipeBackContext>({
    x0: 0,
    t0: 0,
    displacement: 0,
    displacementRatio: 0,
    velocity: 0,
  });
  const stackRef = useRef<HTMLDivElement>(null);
  const swipeBackTargetsRef = useRef<HTMLElement[]>([]);
  const rafIdRef = useRef<number | null>(null);
  const pendingMoveRef = useRef<MoveSwipeBackProps | null>(null);

  const resetSwipeBackVars = useCallback((element: HTMLElement) => {
    element.style.removeProperty("--swipe-back-displacement");
    element.style.removeProperty("--swipe-back-displacement-ratio");
    element.style.removeProperty("--swipe-back-target");
  }, []);

  const setSwipeBackVar = useCallback((name: string, value: string) => {
    swipeBackTargetsRef.current.forEach((element) => {
      element.style.setProperty(name, value);
    });
  }, []);

  const applySwipeBackContext = useCallback(
    (ctx: SwipeBackContext) => {
      setSwipeBackVar("--swipe-back-displacement", `${ctx.displacement.toString()}px`);
      setSwipeBackVar("--swipe-back-displacement-ratio", ctx.displacementRatio.toString());
    },
    [setSwipeBackVar],
  );

  const activities = stack.activities;

  const updateSwipeBackTargets = useCallback(
    (nextActivities: typeof activities) => {
      const stackElement = stackRef.current;
      if (!stackElement) {
        swipeBackTargetsRef.current.forEach(resetSwipeBackVars);
        swipeBackTargetsRef.current = [];
        return;
      }

      const topIndex = nextActivities.findIndex((activity) => activity.isTop);
      const targets: HTMLElement[] = [];

      if (topIndex >= 0) {
        const topId = nextActivities[topIndex].id;
        const topElement = stackElement.querySelector<HTMLElement>(`[data-activity-id="${topId}"]`);

        if (topElement?.dataset["activityType"] === "full-screen") {
          targets.push(topElement);
        }

        for (let index = topIndex - 1; index >= 0; index -= 1) {
          const behindElement = stackElement.querySelector<HTMLElement>(
            `[data-activity-id="${nextActivities[index].id}"]`,
          );

          if (behindElement?.dataset["activityType"] === "full-screen") {
            targets.push(behindElement);
            break;
          }
        }
      }

      const previousTargets = swipeBackTargetsRef.current;
      previousTargets.forEach((previousTarget) => {
        if (!targets.includes(previousTarget)) {
          resetSwipeBackVars(previousTarget);
        }
      });

      swipeBackTargetsRef.current = targets;
      applySwipeBackContext(swipeBackContextRef.current);
    },
    [applySwipeBackContext, resetSwipeBackVars],
  );

  useLayoutEffect(() => {
    updateSwipeBackTargets(activities);
  }, [activities, updateSwipeBackTargets]);

  const setSwipeBackContext = useCallback(
    (ctx: SwipeBackContext) => {
      swipeBackContextRef.current = ctx;
      applySwipeBackContext(ctx);
    },
    [applySwipeBackContext],
  );

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
        setSwipeBackState((prev) => (prev === "swiping" ? prev : "swiping"));
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

        setSwipeBackState((prev) => (prev === "swiping" ? prev : "swiping"));
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

        if (swiped) {
          setSwipeBackVar("--swipe-back-target", "100%");
          setSwipeBackState("completing");
        } else {
          setSwipeBackVar("--swipe-back-target", "0");
          setSwipeBackState("canceling");
        }

        onSwipeBackEnd?.({ swiped });
      };

      const reset = () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        pendingMoveRef.current = null;
        setSwipeBackContext({
          x0: 0,
          t0: 0,
          displacement: 0,
          displacementRatio: 0,
          velocity: 0,
        });
        setSwipeBackVar("--swipe-back-target", "0");
        setSwipeBackState("idle");
      };

      return {
        startSwipeBack,
        moveSwipeBack,
        endSwipeBack,
        reset,
      };
    },
    [setSwipeBackContext, setSwipeBackVar],
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
