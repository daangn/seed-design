import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
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

export interface SwipeBackThresholds {
  /**
   * The threshold to determine whether the swipe back is intentional, by displacement ratio.
   * @default 0.4
   */
  displacementRatioThreshold?: number;

  /**
   * The threshold to determine whether the swipe back is intentional, by velocity.
   * @default 1
   */
  velocityThreshold?: number;
}

export interface StartSwipeBackProps {
  x0: number;
  t0: number;
}

export interface MoveSwipeBackProps {
  x: number;
  t: number;
}

const IDLE_CONTEXT: SwipeBackContext = Object.freeze({
  x0: 0,
  t0: 0,
  displacement: 0,
  displacementRatio: 0,
  velocity: 0,
});

const DEFAULT_DISPLACEMENT_RATIO_THRESHOLD = 0.4;
const DEFAULT_VELOCITY_THRESHOLD = 1;

export function useGlobalInteraction() {
  const swipeBackStateRef = useRef<SwipeBackState>("idle");

  const swipeBackContextRef = useRef<SwipeBackContext>({ ...IDLE_CONTEXT });
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

  /** Cancel any running WAAPI animations and clear the ref. */
  const stopRunningAnims = useCallback(() => {
    cancelAll(runningAnimsRef.current);
    runningAnimsRef.current = [];
  }, []);

  /** Cancel the in-place scrub animation on the AppBar background. */
  const stopAppBarBgScrub = useCallback(() => {
    appBarBgScrubAnimRef.current?.cancel();
    appBarBgScrubAnimRef.current = null;
  }, []);

  /** Cancel a pending deferred push animation, if any. */
  const cancelPendingPushRAF = useCallback(() => {
    if (pendingPushRAFRef.current !== null) {
      cancelAnimationFrame(pendingPushRAFRef.current);
      pendingPushRAFRef.current = null;
    }
  }, []);

  /** Update swipe-back-state attribute on the stack DOM element. */
  const setSwipeBackState = useCallback((state: SwipeBackState) => {
    swipeBackStateRef.current = state;
    if (stackRef.current) {
      stackRef.current.dataset["swipeBackState"] = state;
    }
  }, []);

  const startSwipeBack = useCallback(
    ({ x0, t0 }: StartSwipeBackProps) => {
      // Cancel pending push rAF and any running animations
      cancelPendingPushRAF();
      stopRunningAnims();
      stopAppBarBgScrub();

      swipeBackContextRef.current = { ...IDLE_CONTEXT, x0, t0 };

      // Cache target elements and transition style once per gesture
      if (stackRef.current) {
        cachedTargetsRef.current = findTransitionTargets(stackRef.current);
        swipeStyleRef.current = readTransitionStyle(stackRef.current);
      }

      setSwipeBackState("swiping");
    },
    [cancelPendingPushRAF, stopRunningAnims, stopAppBarBgScrub, setSwipeBackState],
  );

  const moveSwipeBack = useCallback(({ x, t }: MoveSwipeBackProps): SwipeBackContext => {
    const ctx = swipeBackContextRef.current;
    const displacement = Math.max(0, x - ctx.x0);
    const displacementRatio = displacement / window.innerWidth;
    const velocity = displacement / (t - ctx.t0);

    // Mutate in place — this runs at 60fps inside touchmove rAF.
    ctx.displacement = displacement;
    ctx.displacementRatio = displacementRatio;
    ctx.velocity = velocity;

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

    return ctx;
  }, []);

  const endSwipeBack = useCallback(
    (thresholds: SwipeBackThresholds = {}): boolean => {
      const {
        displacementRatioThreshold = DEFAULT_DISPLACEMENT_RATIO_THRESHOLD,
        velocityThreshold = DEFAULT_VELOCITY_THRESHOLD,
      } = thresholds;

      const ctx = swipeBackContextRef.current;
      const swiped =
        ctx.displacementRatio > displacementRatioThreshold || ctx.velocity > velocityThreshold;

      const targets = cachedTargetsRef.current;
      if (!targets) {
        setSwipeBackState("idle");
        return swiped;
      }

      // Non-iOS styles do not track finger motion — let stackflow's normal
      // exit-active lifecycle drive the pop animation when `swiped` is true.
      if (swipeStyleRef.current !== "slideFromRightIOS") {
        cachedTargetsRef.current = null;
        swipeStyleRef.current = null;
        setSwipeBackState("idle");
        return swiped;
      }

      // Clear inline styles from swiping — WAAPI will take over from current position
      clearAllStyles(targets);
      stopAppBarBgScrub();

      const onFinish = (animations: Animation[], pin: () => void) => {
        // Bail out if a newer transition has already claimed the ref —
        // otherwise this stale handler would clobber the new animation's
        // freshly-pinned inline styles.
        if (runningAnimsRef.current !== animations) return;
        // Set inline styles BEFORE cancel to prevent flash
        pin();
        cancelAll(animations);
        runningAnimsRef.current = [];
        cachedTargetsRef.current = null;
        swipeStyleRef.current = null;
        setSwipeBackState("idle");
      };

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
        finished.then(() => onFinish(animations, () => setPostExitPositions(targets)));
      } else {
        setSwipeBackState("canceling");
        const { animations, finished } = animateSwipeCancel(
          targets,
          ctx.displacement,
          ctx.velocity,
        );
        runningAnimsRef.current = animations;
        finished.then(() => onFinish(animations, () => setIdlePositions(targets)));
      }

      return swiped;
    },
    [setSwipeBackState, stopAppBarBgScrub],
  );

  const resetSwipeBack = useCallback(() => {
    stopRunningAnims();
    stopAppBarBgScrub();
    if (cachedTargetsRef.current) {
      clearAllStyles(cachedTargetsRef.current);
    }
    cachedTargetsRef.current = null;
    swipeStyleRef.current = null;
    swipeBackContextRef.current = { ...IDLE_CONTEXT };
    setSwipeBackState("idle");
  }, [stopRunningAnims, stopAppBarBgScrub, setSwipeBackState]);

  const topActivity = useTopActivity();

  // ── WAAPI push/pop transitions triggered by stackflow state changes ──
  const prevTransitionStateRef = useRef<string>(topActivity.transitionState);

  useLayoutEffect(() => {
    const prev = prevTransitionStateRef.current;
    const next = topActivity.transitionState;
    prevTransitionStateRef.current = next;

    const stackEl = stackRef.current;
    if (!stackEl) return;

    const swipeState = swipeBackStateRef.current;

    if (next === "enter-active" && prev !== "enter-active") {
      if (swipeState !== "idle") return;

      stopRunningAnims();
      cancelPendingPushRAF();
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
          if (runningAnimsRef.current !== animations) return;
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

      cancelPendingPushRAF();
      stopRunningAnims();
      const style = readTransitionStyle(stackEl);
      const targets = findTransitionTargets(stackEl);
      const { animations, finished } = animateTransition(targets, "pop", style);
      runningAnimsRef.current = animations;
      finished.then(() => {
        if (runningAnimsRef.current !== animations) return;
        setPostExitPositions(targets, style);
        cancelAll(animations);
        runningAnimsRef.current = [];
      });
    }
  }, [topActivity.transitionState, stopRunningAnims, cancelPendingPushRAF]);

  // Cancel any pending push rAF and running animations on unmount so
  // late-firing finished handlers can't run against a torn-down stack.
  useEffect(() => {
    return () => {
      cancelPendingPushRAF();
      stopRunningAnims();
      stopAppBarBgScrub();
    };
  }, [cancelPendingPushRAF, stopRunningAnims, stopAppBarBgScrub]);

  const stackProps = useMemo(
    () =>
      ({
        "data-swipe-back-state": swipeBackStateRef.current,
        "data-global-transition-state": topActivity.transitionState,
        "data-top-activity-type": topActivity.activityType,
        "data-top-transition-style": topActivity.transitionStyle,
      }) as React.HTMLAttributes<HTMLElement>,
    [topActivity.transitionState, topActivity.activityType, topActivity.transitionStyle],
  );

  return useMemo(
    () => ({
      stackRef,
      startSwipeBack,
      moveSwipeBack,
      endSwipeBack,
      resetSwipeBack,
      stackProps,
    }),
    [startSwipeBack, moveSwipeBack, endSwipeBack, resetSwipeBack, stackProps],
  );
}
