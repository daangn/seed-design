import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useTopActivity } from "../private/useTopActivity";
import {
  type TransitionStyle,
  type TransitionTargets,
  findTransitionTargets,
  readTransitionStyle,
  applySwipeStyles,
  clearAllStyles,
  setIdlePositions,
  setPostExitPositions,
} from "./dom";
import {
  cancelAll,
  animateTransition,
  animateSwipeComplete,
  animateSwipeCancel,
  scrubAppBarBackground,
} from "./animation";

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
  const swipeBackStateRef = useRef<SwipeBackState>("idle");

  const swipeBackContextRef = useRef<SwipeBackContext>({
    x0: 0,
    t0: 0,
    displacement: 0,
    displacementRatio: 0,
    velocity: 0,
  });
  const stackRef = useRef<HTMLDivElement>(null);

  // Cached transition targets — populated once per gesture/transition
  const cachedTargetsRef = useRef<TransitionTargets | null>(null);

  // Running WAAPI animations — for cancellation on new transitions
  const runningAnimsRef = useRef<Animation[]>([]);

  // Current scrub animation on the top AppBar background element. Retained
  // across touchmoves so setKeyframes can replace it in place — recreating
  // on every move would cancel-then-recreate and flicker.
  const appBarBgScrubAnimRef = useRef<Animation | null>(null);

  // Transition style of the top activity at swipe start. Non-iOS styles
  // (fadeFromBottomAndroid / fadeIn) do not track finger displacement —
  // their exit is driven by stackflow's normal exit-active lifecycle.
  const swipeStyleRef = useRef<TransitionStyle | null>(null);

  /** Update swipe-back-state attribute on the stack DOM element. */
  const setSwipeBackState = useCallback((state: SwipeBackState) => {
    swipeBackStateRef.current = state;
    if (stackRef.current) {
      stackRef.current.dataset["swipeBackState"] = state;
    }
  }, []);

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
        // Cancel pending push rAF and any running animations
        if (pendingPushRAFRef.current !== null) {
          cancelAnimationFrame(pendingPushRAFRef.current);
          pendingPushRAFRef.current = null;
        }
        cancelAll(runningAnimsRef.current);
        runningAnimsRef.current = [];
        appBarBgScrubAnimRef.current?.cancel();
        appBarBgScrubAnimRef.current = null;

        swipeBackContextRef.current = {
          x0,
          t0,
          displacement: 0,
          displacementRatio: 0,
          velocity: 0,
        };

        // Cache target elements and transition style once per gesture
        if (stackRef.current) {
          cachedTargetsRef.current = findTransitionTargets(stackRef.current);
          swipeStyleRef.current = readTransitionStyle(stackRef.current);
        }

        setSwipeBackState("swiping");
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

        // Only iOS slide tracks finger displacement; other styles stay put
        // and let stackflow's own exit transition play on pop.
        const targets = cachedTargetsRef.current;
        if (targets && swipeStyleRef.current === "slideFromRightIOS") {
          applySwipeStyles(targets, displacement, displacementRatio);
          appBarBgScrubAnimRef.current = scrubAppBarBackground(
            targets.topAppBarBackground,
            `translate3d(${displacement}px, 0, 0)`,
            appBarBgScrubAnimRef.current,
          );
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

        const targets = cachedTargetsRef.current;
        if (!targets) {
          setSwipeBackState("idle");
          onSwipeEnd?.({ swiped });
          return;
        }

        // Non-iOS styles do not track finger motion — let stackflow's normal
        // exit-active lifecycle drive the pop animation when `swiped` is true.
        if (swipeStyleRef.current !== "slideFromRightIOS") {
          cachedTargetsRef.current = null;
          swipeStyleRef.current = null;
          setSwipeBackState("idle");
          onSwipeEnd?.({ swiped });
          return;
        }

        // Clear inline styles from swiping — WAAPI will take over from current position
        clearAllStyles(targets);
        appBarBgScrubAnimRef.current?.cancel();
        appBarBgScrubAnimRef.current = null;

        if (swiped) {
          setSwipeBackState("completing");
          // Mark to skip the next exit-active from stackflow
          skipNextExitRef.current = true;
          const { animations, finished } = animateSwipeComplete(
            targets,
            ctx.displacement,
            ctx.velocity,
          );
          runningAnimsRef.current = animations;

          finished.then(() => {
            // Bail out if a newer transition has already claimed the ref —
            // otherwise this stale handler would clobber the new animation's
            // freshly-pinned inline styles.
            // Set inline styles BEFORE cancel to prevent flash
            setPostExitPositions(targets);
            cancelAll(animations);
            runningAnimsRef.current = [];
            cachedTargetsRef.current = null;
            swipeStyleRef.current = null;
            setSwipeBackState("idle");
          });
        } else {
          setSwipeBackState("canceling");
          const { animations, finished } = animateSwipeCancel(
            targets,
            ctx.displacement,
            ctx.velocity,
          );
          runningAnimsRef.current = animations;

          finished.then(() => {
            // Set inline styles BEFORE cancel to prevent flash
            setIdlePositions(targets);
            cancelAll(animations);
            runningAnimsRef.current = [];
            cachedTargetsRef.current = null;
            swipeStyleRef.current = null;
            setSwipeBackState("idle");
          });
        }

        onSwipeEnd?.({ swiped });
      },
      [onSwipeEnd, displacementRatioThreshold, velocityThreshold],
    );

    const reset = useCallback(() => {
      cancelAll(runningAnimsRef.current);
      runningAnimsRef.current = [];
      appBarBgScrubAnimRef.current?.cancel();
      appBarBgScrubAnimRef.current = null;
      if (cachedTargetsRef.current) {
        clearAllStyles(cachedTargetsRef.current);
      }
      cachedTargetsRef.current = null;
      swipeStyleRef.current = null;
      swipeBackContextRef.current = {
        x0: 0,
        t0: 0,
        displacement: 0,
        displacementRatio: 0,
        velocity: 0,
      };
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
  }, []);

  const topActivity = useTopActivity();

  // ── WAAPI push/pop transitions triggered by stackflow state changes ──
  const prevTransitionStateRef = useRef<string>(topActivity.transitionState);

  // Defer push animation one frame so stackflow has committed the new top
  // activity's DOM (data-activity-is-top + layer/appBar subtree) before we
  // query targets. Running sync in useLayoutEffect turned out to race with
  // stackflow's internal subscription updates, leaving targets empty and
  // the enter animation never firing.
  const pendingPushRAFRef = useRef<number | null>(null);

  // Skip the next exit-active transition after swipe completing,
  // because stackflow fires exit-active as part of its normal lifecycle
  // but we've already animated the exit via WAAPI.
  const skipNextExitRef = useRef(false);

  useLayoutEffect(() => {
    const prev = prevTransitionStateRef.current;
    const next = topActivity.transitionState;
    prevTransitionStateRef.current = next;

    const stackEl = stackRef.current;
    if (!stackEl) return;

    const swipeState = swipeBackStateRef.current;

    if (next === "enter-active" && prev !== "enter-active") {
      if (swipeState !== "idle") return;

      cancelAll(runningAnimsRef.current);
      runningAnimsRef.current = [];
      if (pendingPushRAFRef.current !== null) {
        cancelAnimationFrame(pendingPushRAFRef.current);
      }
      // Defer one frame so stackflow's new top activity subtree is reliably
      // observable via data-activity-is-top. Sync dispatch inside
      // useLayoutEffect raced with stackflow subscription updates and left
      // findTransitionTargets empty on push.
      pendingPushRAFRef.current = requestAnimationFrame(() => {
        pendingPushRAFRef.current = null;
        const style = readTransitionStyle(stackEl);
        const targets = findTransitionTargets(stackEl);
        const { animations, finished } = animateTransition(targets, "push", style);
        runningAnimsRef.current = animations;
        finished.then(() => {
          setIdlePositions(targets, style);
          cancelAll(animations);
          runningAnimsRef.current = [];
        });
      });
    }

    if (next === "exit-active" && prev !== "exit-active") {
      if (skipNextExitRef.current) {
        skipNextExitRef.current = false;
        return;
      }

      if (swipeState !== "idle") return;

      if (pendingPushRAFRef.current !== null) {
        cancelAnimationFrame(pendingPushRAFRef.current);
        pendingPushRAFRef.current = null;
      }
      cancelAll(runningAnimsRef.current);
      runningAnimsRef.current = [];
      const style = readTransitionStyle(stackEl);
      const targets = findTransitionTargets(stackEl);
      const { animations, finished } = animateTransition(targets, "pop", style);
      runningAnimsRef.current = animations;
      finished.then(() => {
        setPostExitPositions(targets, style);
        cancelAll(animations);
        runningAnimsRef.current = [];
      });
    }
  }, [topActivity.transitionState]);

  const stackProps = useMemo(
    () => ({
      "data-swipe-back-state": swipeBackStateRef.current,
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
      getSwipeBackEvents,

      stackProps,
    }),
    [setSwipeBackState, getSwipeBackEvents, stackProps],
  );
}
