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

const INITIAL_SWIPE_CONTEXT: SwipeBackContext = {
  x0: 0,
  t0: 0,
  displacement: 0,
  displacementRatio: 0,
  velocity: 0,
};

interface SwipeElements {
  topActivity: HTMLElement | null;
  behindActivity: HTMLElement | null;
  topLayer: HTMLElement | null;
  topDim: HTMLElement | null;
  behindLayer: HTMLElement | null;
  topAppBar: HTMLElement | null;
}

const EMPTY_SWIPE_ELEMENTS: SwipeElements = {
  topActivity: null,
  behindActivity: null,
  topLayer: null,
  topDim: null,
  behindLayer: null,
  topAppBar: null,
};

export function useGlobalInteraction() {
  const stack = useStack();
  const swipeBackStateRef = useRef<SwipeBackState>("idle");
  const completingActivityIdRef = useRef<string | null>(null);

  const setSwipeBackState = useCallback((state: SwipeBackState) => {
    swipeBackStateRef.current = state;
    if (stackRef.current) {
      stackRef.current.dataset["swipeBackState"] = state;
    }
  }, []);

  const swipeBackContextRef = useRef<SwipeBackContext>({ ...INITIAL_SWIPE_CONTEXT });
  const stackRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const pendingMoveRef = useRef<MoveSwipeBackProps | null>(null);

  const activitiesRef = useRef(stack.activities);
  activitiesRef.current = stack.activities;

  // Cached DOM refs for direct manipulation during swipe.
  // Writing inline styles to specific elements avoids CSS variable cascade
  // on the stack root, which would cause all layers to recalculate transforms
  // and reset scroll positions on iOS WebKit.
  const screenWidthRef = useRef(window.innerWidth);
  const swipeElsRef = useRef<SwipeElements>({ ...EMPTY_SWIPE_ELEMENTS });

  /** Resolve the element that receives --swipe-back-target (activity or stack fallback). */
  const getTargetEl = useCallback(() => swipeElsRef.current.topActivity ?? stackRef.current, []);

  const clearSwipeInlineStyles = useCallback(() => {
    const els = swipeElsRef.current;
    if (els.topLayer) els.topLayer.style.transform = "";
    if (els.topDim) els.topDim.style.opacity = "";
    if (els.behindLayer) els.behindLayer.style.transform = "";
    if (els.topAppBar) {
      els.topAppBar.style.removeProperty("--swipe-back-displacement");
      els.topAppBar.style.removeProperty("--swipe-back-displacement-ratio");
    }
  }, []);

  const resetSwipeState = useCallback(() => {
    clearSwipeInlineStyles();
    swipeElsRef.current = { ...EMPTY_SWIPE_ELEMENTS };
  }, [clearSwipeInlineStyles]);

  /** Compute displacement context from a touch position. */
  const computeDisplacement = useCallback(
    (
      x: number,
      t: number,
    ): Pick<SwipeBackContext, "displacement" | "displacementRatio" | "velocity"> => {
      const ctx = swipeBackContextRef.current;
      const displacement = x - ctx.x0;
      return {
        displacement,
        displacementRatio: displacement / screenWidthRef.current,
        velocity: displacement / (t - ctx.t0 || 1),
      };
    },
    [],
  );

  // Direct DOM writes to specific elements instead of CSS variable cascade.
  // Only sets CSS vars on the appBar (for appBar-specific styling).
  const setSwipeBackContext = useCallback((ctx: SwipeBackContext) => {
    swipeBackContextRef.current = ctx;

    const { displacement, displacementRatio } = ctx;
    const sw = screenWidthRef.current;
    const els = swipeElsRef.current;

    if (els.topLayer) {
      els.topLayer.style.transform = `translate3d(${displacement}px, 0, 0)`;
    }
    if (els.topDim) {
      els.topDim.style.opacity = `${Math.max(0, 1 - displacementRatio)}`;
    }
    if (els.behindLayer) {
      els.behindLayer.style.transform = `translate3d(${-0.3 * sw + displacement * 0.3}px, 0, 0)`;
    }
    if (els.topAppBar) {
      els.topAppBar.style.setProperty("--swipe-back-displacement", `${displacement}px`);
      els.topAppBar.style.setProperty("--swipe-back-displacement-ratio", `${displacementRatio}`);
    }
  }, []);

  const activities = stack.activities;

  useLayoutEffect(() => {
    if (swipeBackStateRef.current === "completing" && completingActivityIdRef.current) {
      const completingActivity = activities.find((a) => a.id === completingActivityIdRef.current);
      if (!completingActivity || completingActivity.transitionState === "exit-done") {
        swipeBackContextRef.current = { ...INITIAL_SWIPE_CONTEXT };
        getTargetEl()?.style.removeProperty("--swipe-back-target");
        resetSwipeState();
        setSwipeBackState("idle");
        completingActivityIdRef.current = null;
      }
    }
  }, [activities, setSwipeBackState, resetSwipeState, getTargetEl]);

  const getSwipeBackEvents = useCallback(
    (props: SwipeBackProps) => {
      const {
        swipeBackDisplacementRatioThreshold: displacementRatioThreshold = 0.4,
        swipeBackVelocityThreshold: velocityThreshold = 1,
        onSwipeBackStart,
        onSwipeBackMove,
        onSwipeBackEnd,
      } = props;

      const cacheSwipeElements = () => {
        screenWidthRef.current = window.innerWidth;

        const root = stackRef.current;
        if (!root) return;

        const topActivity = root.querySelector<HTMLElement>(
          '[data-part="activity"][data-activity-is-top]',
        );
        const behindActivities = root.querySelectorAll<HTMLElement>(
          '[data-part="activity"]:not([data-activity-is-top])',
        );
        const behindActivity = behindActivities[behindActivities.length - 1] ?? null;

        swipeElsRef.current = {
          topActivity,
          behindActivity,
          topLayer: topActivity?.querySelector('[data-part="layer"]') ?? null,
          topDim: topActivity?.querySelector('[data-part="dim"]') ?? null,
          topAppBar: topActivity?.querySelector('[data-part="appBar"]') ?? null,
          behindLayer: behindActivity?.querySelector('[data-part="layer"]') ?? null,
        };
      };

      const startSwipeBack = ({ x0, t0 }: StartSwipeBackProps) => {
        cacheSwipeElements();
        swipeBackContextRef.current = { ...INITIAL_SWIPE_CONTEXT, x0, t0 };
        if (swipeBackStateRef.current !== "swiping") {
          setSwipeBackState("swiping");
        }
        onSwipeBackStart?.();
      };

      const moveSwipeBack = ({ x, t }: MoveSwipeBackProps) => {
        pendingMoveRef.current = { x, t };

        if (rafIdRef.current === null) {
          rafIdRef.current = requestAnimationFrame(() => {
            const pending = pendingMoveRef.current;
            if (pending) {
              const delta = computeDisplacement(pending.x, pending.t);
              setSwipeBackContext({ ...swipeBackContextRef.current, ...delta });
              onSwipeBackMove?.({
                displacement: delta.displacement,
                displacementRatio: delta.displacementRatio,
              });
            }
            rafIdRef.current = null;
          });
        }

        if (swipeBackStateRef.current !== "swiping") {
          setSwipeBackState("swiping");
        }
      };

      const endSwipeBack = (_: EndSwipeBackProps) => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        if (pendingMoveRef.current) {
          const { x, t } = pendingMoveRef.current;
          setSwipeBackContext({ ...swipeBackContextRef.current, ...computeDisplacement(x, t) });
          pendingMoveRef.current = null;
        }

        const { displacementRatio, velocity, displacement } = swipeBackContextRef.current;
        const swiped =
          displacementRatio > displacementRatioThreshold || velocity > velocityThreshold;

        if (swiped) {
          const currentTop = activitiesRef.current.find((a) => a.isTop);
          completingActivityIdRef.current = currentTop?.id ?? null;
        }

        // Two-frame technique: set --swipe-back-target to current displacement first,
        // then animate to final value in the next frame so CSS transition kicks in.
        const topEl = getTargetEl();
        topEl?.style.setProperty("--swipe-back-target", `${displacement}px`);
        clearSwipeInlineStyles();
        setSwipeBackState(swiped ? "completing" : "canceling");

        const finalTarget = swiped ? "100%" : "0";
        rafIdRef.current = requestAnimationFrame(() => {
          getTargetEl()?.style.setProperty("--swipe-back-target", finalTarget);
          rafIdRef.current = null;
        });

        onSwipeBackEnd?.({ swiped });
      };

      const reset = () => {
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
        pendingMoveRef.current = null;

        if (swipeBackStateRef.current === "completing") {
          return;
        }

        swipeBackContextRef.current = { ...INITIAL_SWIPE_CONTEXT };
        resetSwipeState();
        getTargetEl()?.style.setProperty("--swipe-back-target", "0");
        setSwipeBackState("idle");
      };

      return {
        startSwipeBack,
        moveSwipeBack,
        endSwipeBack,
        reset,
      };
    },
    [
      setSwipeBackContext,
      setSwipeBackState,
      clearSwipeInlineStyles,
      resetSwipeState,
      computeDisplacement,
      getTargetEl,
    ],
  );

  const topActivity = useTopActivity();

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
