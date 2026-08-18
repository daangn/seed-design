import { useCallbackRef } from "@radix-ui/react-use-callback-ref";
import { useStack } from "@stackflow/react";
import { useNullableActivity } from "@stackflow/react-ui-core";
import { useEffect, useRef } from "react";
import { cancelAll, waitAll } from "../private/waapi";
import { playSwipeRelease, readSwipeDisplacement } from "./animation";
import { useNextScreenRegistry } from "./registry";
import type { NextAppScreenTransitionStyle, NextScreenState, NextSwipeBackArea } from "./types";

const DEFAULT_DISPLACEMENT_RATIO_THRESHOLD = 0.4;
const DEFAULT_VELOCITY_THRESHOLD = 1;

/** Full mode: distance the finger must travel before the gesture is claimed. */
const CLAIM_SLOP_PX = 10;

/** Full mode: max deviation from horizontal, as tan(10°). */
const CLAIM_MAX_ANGLE_TAN = Math.tan((10 * Math.PI) / 180);

const DISPLACEMENT_VAR = "--seed-swipe-back-displacement";
const RATIO_VAR = "--seed-swipe-back-displacement-ratio";

let cssPropertiesRegistered = false;

/**
 * Registered so the var-driven transforms interpolate as proper types.
 * Guarded — absent in happy-dom and old WebViews, and re-registration throws.
 */
function registerSwipeBackProperties() {
  if (cssPropertiesRegistered) return;

  cssPropertiesRegistered = true;
  if (typeof CSS === "undefined" || typeof CSS.registerProperty !== "function") return;

  try {
    CSS.registerProperty({
      name: DISPLACEMENT_VAR,
      syntax: "<length>",
      inherits: false,
      initialValue: "0px",
    });
    CSS.registerProperty({
      name: RATIO_VAR,
      syntax: "<number>",
      inherits: false,
      initialValue: "0",
    });
  } catch {
    // already registered by another stack — ignore
  }
}

function writeSwipeVars(el: HTMLElement | null, displacement: number, ratio: number) {
  if (!el) return;

  el.style.setProperty(DISPLACEMENT_VAR, `${displacement}px`);
  el.style.setProperty(RATIO_VAR, ratio.toString());
}

function clearSwipeVars(el: HTMLElement | null) {
  if (!el) return;

  el.style.removeProperty(DISPLACEMENT_VAR);
  el.style.removeProperty(RATIO_VAR);
}

/**
 * Full mode yields to content: any ancestor of the touch target (up to the
 * layer) that is horizontally scrollable or carries `data-swipe-back-block`
 * wins over the gesture.
 */
function findBlockingAncestor(target: EventTarget | null, boundary: HTMLElement | null) {
  let el = target instanceof HTMLElement ? target : null;

  while (el) {
    if (el.dataset["swipeBackBlock"] !== undefined) return el;

    const { overflowX } = window.getComputedStyle(el);
    if ((overflowX === "auto" || overflowX === "scroll") && el.scrollWidth > el.clientWidth) {
      return el;
    }

    if (el === boundary) return null;
    el = el.parentElement;
  }

  return null;
}

export interface UseNextSwipeBackProps {
  /**
   * Where the swipe-back gesture can start.
   *
   * - `"edge"`: a 20px-wide strip element (screen-edge part) above the layer
   *   owns the gesture, like the legacy AppScreen.
   * - `"full"`: no overlay element — passive listeners on the screen root
   *   claim the gesture only after a 10px slop within 10° of horizontal,
   *   moving rightward. Taps and scrolls pass through untouched; horizontally
   *   scrollable content and `[data-swipe-back-block]` subtrees win over the
   *   gesture.
   * - `"none"`: nothing rendered, no listeners.
   *
   * Independent of `transitionStyle`: the area decides where the gesture is
   * picked up, the style decides what it looks like. Whichever style the screen
   * runs, the drag scrubs that style's own exit.
   *
   * @default "edge"
   */
  swipeBackArea?: NextSwipeBackArea;

  /**
   * The threshold to determine whether the swipe back is intentional, by displacement ratio.
   * @default 0.4
   */
  swipeBackDisplacementRatioThreshold?: number;

  /**
   * The threshold to determine whether the swipe back is intentional, by velocity (px/ms).
   * @default 1
   */
  swipeBackVelocityThreshold?: number;

  onSwipeBackStart?: () => void;
  onSwipeBackMove?: (props: { displacement: number; displacementRatio: number }) => void;

  /**
   * Called when the gesture is released. `swiped: true` means the gesture
   * crossed the displacement-ratio or velocity threshold and the screen has
   * visually completed the swipe — the component itself never pops.
   *
   * Exit-guard pattern: the consumer decides whether to pop on `swiped: true`.
   * Pop immediately for the default behavior; to guard the exit (e.g. show a
   * confirm dialog first), skip the pop — the screen glides back into place
   * shortly after — and pop later once the guard resolves, which plays the
   * normal exit transition.
   */
  onSwipeBackEnd?: (props: { swiped: boolean }) => void;
}

export interface UseNextSwipeBackArgs extends UseNextSwipeBackProps {
  transitionStyle: NextAppScreenTransitionStyle;
  rootRef: React.RefObject<HTMLElement | null>;
  layerRef: React.RefObject<HTMLElement | null>;
  dimRef: React.RefObject<HTMLElement | null>;
  screenState: NextScreenState;
}

interface SwipeTargets {
  topRoot: HTMLElement;
  topLayer: HTMLElement | null;
  topDim: HTMLElement | null;
  behindRoot: HTMLElement | null;
  behindLayer: HTMLElement | null;
}

interface GestureContext {
  /**
   * Snapshotted at gesture start: a screen that re-renders into another style
   * mid-drag must still finish on the path the finger has been scrubbing.
   */
  transitionStyle: NextAppScreenTransitionStyle;
  x0: number;
  y0: number;
  t0: number;
  /** Rebased starting displacement (non-zero after a re-grab). */
  baseDisplacement: number;
  claimed: boolean;
  rejected: boolean;
  displacement: number;
  displacementRatio: number;
  velocity: number;
  targets: SwipeTargets;
}

type SwipePhase = "idle" | "swiping" | "releasing";

function setSwipeState(targets: SwipeTargets, state: "swiping" | "canceling" | "completing") {
  targets.topRoot.dataset["swipeBackState"] = state;
  if (targets.behindRoot) targets.behindRoot.dataset["swipeBackState"] = state;
}

function clearSwipeState(targets: SwipeTargets) {
  delete targets.topRoot.dataset["swipeBackState"];
  if (targets.behindRoot) delete targets.behindRoot.dataset["swipeBackState"];
}

function clearAllSwipeVars(targets: SwipeTargets) {
  clearSwipeVars(targets.topLayer);
  clearSwipeVars(targets.topDim);
  clearSwipeVars(targets.behindLayer);
}

function applyDisplacement(targets: SwipeTargets, displacement: number, ratio: number) {
  writeSwipeVars(targets.topLayer, displacement, ratio);
  writeSwipeVars(targets.topDim, displacement, ratio);
  writeSwipeVars(targets.behindLayer, displacement, ratio);
}

export function useNextSwipeBack(args: UseNextSwipeBackArgs) {
  const {
    swipeBackArea = "edge",
    swipeBackDisplacementRatioThreshold = DEFAULT_DISPLACEMENT_RATIO_THRESHOLD,
    swipeBackVelocityThreshold = DEFAULT_VELOCITY_THRESHOLD,
    transitionStyle,
    rootRef,
    layerRef,
    dimRef,
    screenState,
  } = args;

  const onSwipeStart = useCallbackRef(args.onSwipeBackStart);
  const onSwipeMove = useCallbackRef(args.onSwipeBackMove);
  const onSwipeEnd = useCallbackRef(args.onSwipeBackEnd);

  const stack = useStack();
  const activity = useNullableActivity();
  const registry = useNextScreenRegistry();

  const phaseRef = useRef<SwipePhase>("idle");
  const contextRef = useRef<GestureContext | null>(null);
  const pendingMoveRef = useRef<{ x: number; t: number } | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const releaseAnimsRef = useRef<Animation[]>([]);

  useEffect(() => {
    if (swipeBackArea === "none") return;

    registerSwipeBackProperties();
  }, [swipeBackArea]);

  function resolveBehind(): { rootEl: HTMLElement | null; layerEl: HTMLElement | null } {
    if (!stack || !activity || !registry) return { rootEl: null, layerEl: null };

    const candidates = stack.activities
      .filter(
        (candidate) =>
          candidate.id !== activity.id &&
          candidate.zIndex < activity.zIndex &&
          candidate.transitionState !== "exit-active" &&
          candidate.transitionState !== "exit-done",
      )
      .sort((a, b) => b.zIndex - a.zIndex);

    for (const candidate of candidates) {
      const registration = registry.get(candidate.id);
      if (registration) return { rootEl: registration.rootEl, layerEl: registration.layerEl };
    }

    return { rootEl: null, layerEl: null };
  }

  function cancelPendingMove() {
    pendingMoveRef.current = null;
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }

  /**
   * Abandon a release in flight. Nothing has to be restored: the animations
   * are `fill: "none"`, so cancelling drops every element onto the position
   * its `data-swipe-back-state` already declares in CSS.
   */
  function stopRelease() {
    cancelAll(releaseAnimsRef.current);
    releaseAnimsRef.current = [];
  }

  /**
   * Animate the released gesture to its resting position and settle once it
   * lands. `waitAll` races the animations against a timeout so a browser that
   * never reports completion still cleans up; with no animations at all (no
   * WAAPI) the settle is delayed by hand, because consumers rely on the pause
   * to decide the pop before the exit-guard branch reads the screen state.
   *
   * Claiming `releaseAnimsRef` invalidates any settle still pending, so a
   * re-grab or a newer gesture can never be finished by the old one.
   */
  function playRelease(
    context: GestureContext,
    displacement: number,
    mode: "cancel" | "complete",
    onSettle: () => void,
  ) {
    stopRelease();

    const { targets } = context;
    const { animations, duration } = playSwipeRelease(
      { layer: targets.topLayer, dim: targets.topDim, behindLayer: targets.behindLayer },
      context.transitionStyle,
      displacement,
      mode,
    );
    releaseAnimsRef.current = animations;

    const settled =
      animations.length > 0
        ? waitAll(animations, duration)
        : new Promise<void>((resolve) => setTimeout(resolve, duration));

    settled.then(() => {
      if (releaseAnimsRef.current !== animations) return;

      releaseAnimsRef.current = [];
      onSettle();
    });
  }

  function finishGesture(targets: SwipeTargets) {
    clearSwipeState(targets);
    clearAllSwipeVars(targets);
    phaseRef.current = "idle";
    contextRef.current = null;
  }

  function beginInteraction(context: GestureContext) {
    phaseRef.current = "swiping";
    setSwipeState(context.targets, "swiping");
    applyDisplacement(
      context.targets,
      context.baseDisplacement,
      context.baseDisplacement / window.innerWidth,
    );
    onSwipeStart();
  }

  function handleTouchStart(event: React.TouchEvent, options: { claimImmediately: boolean }) {
    const touch = event.touches[0];
    if (!touch) return;
    if (phaseRef.current === "swiping") return;

    const rootEl = rootRef.current;
    if (!rootEl) return;

    // Gate: only the resting top screen is draggable. Every transitionStyle
    // takes the gesture — each one scrubs its own exit.
    if (rootEl.dataset["screenIsTop"] === undefined) return;
    if (rootEl.dataset["screenState"] !== "idle") return;

    // Re-grab during release: rebase the origin from the current position.
    if (phaseRef.current === "releasing" && contextRef.current) {
      const context = contextRef.current;
      const currentDisplacement =
        readSwipeDisplacement(context.transitionStyle, context.targets.topLayer) ??
        context.displacement;
      stopRelease();

      context.x0 = touch.clientX;
      context.y0 = touch.clientY;
      context.t0 = Date.now();
      context.baseDisplacement = Math.max(0, currentDisplacement);
      context.displacement = context.baseDisplacement;
      context.displacementRatio = context.baseDisplacement / window.innerWidth;
      context.velocity = 0;
      context.claimed = true;
      context.rejected = false;
      beginInteraction(context);
      return;
    }

    if (swipeBackArea === "full") {
      const blocker = findBlockingAncestor(event.target, layerRef.current);
      if (blocker) return;
    }

    const behind = resolveBehind();
    const context: GestureContext = {
      transitionStyle,
      x0: touch.clientX,
      y0: touch.clientY,
      t0: Date.now(),
      baseDisplacement: 0,
      claimed: false,
      rejected: false,
      displacement: 0,
      displacementRatio: 0,
      velocity: 0,
      targets: {
        topRoot: rootEl,
        topLayer: layerRef.current,
        topDim: dimRef.current,
        behindRoot: behind.rootEl,
        behindLayer: behind.layerEl,
      },
    };
    contextRef.current = context;

    if (options.claimImmediately) {
      context.claimed = true;
      beginInteraction(context);
    }
  }

  function handleTouchMove(event: React.TouchEvent) {
    const context = contextRef.current;
    const touch = event.touches[0];
    if (!context || !touch || context.rejected) return;
    if (phaseRef.current === "releasing") return;

    const x = touch.clientX;
    const y = touch.clientY;
    const t = Date.now();

    if (!context.claimed) {
      const dx = x - context.x0;
      const dy = y - context.y0;
      if (dx * dx + dy * dy < CLAIM_SLOP_PX * CLAIM_SLOP_PX) return;

      if (dx <= 0 || Math.abs(dy) > dx * CLAIM_MAX_ANGLE_TAN) {
        context.rejected = true;
        return;
      }

      // Claim: rebase the origin to the claim point so there is no 10px jump.
      context.x0 = x;
      context.y0 = y;
      context.t0 = t;
      context.claimed = true;
      beginInteraction(context);
      return;
    }

    // rAF throttle: coalesce moves into at most one style write per frame.
    pendingMoveRef.current = { x, t };
    if (rafIdRef.current !== null) return;

    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null;
      const pending = pendingMoveRef.current;
      const currentContext = contextRef.current;
      if (!pending || !currentContext || phaseRef.current !== "swiping") return;

      pendingMoveRef.current = null;
      const displacement = Math.max(
        0,
        pending.x - currentContext.x0 + currentContext.baseDisplacement,
      );
      const displacementRatio = displacement / window.innerWidth;
      const elapsed = Math.max(1, pending.t - currentContext.t0);

      currentContext.displacement = displacement;
      currentContext.displacementRatio = displacementRatio;
      currentContext.velocity = displacement / elapsed;

      applyDisplacement(currentContext.targets, displacement, displacementRatio);
      onSwipeMove({ displacement, displacementRatio });
    });
  }

  function handleTouchEnd() {
    const context = contextRef.current;
    if (!context || phaseRef.current === "releasing") return;

    if (!context.claimed) {
      // Tap or rejected gesture — pass through untouched, no callbacks.
      contextRef.current = null;
      return;
    }

    cancelPendingMove();
    phaseRef.current = "releasing";

    const swiped =
      context.displacementRatio > swipeBackDisplacementRatioThreshold ||
      context.velocity > swipeBackVelocityThreshold;

    setSwipeState(context.targets, swiped ? "completing" : "canceling");

    if (swiped) {
      playRelease(context, context.displacement, "complete", () => {
        const currentContext = contextRef.current;
        if (!currentContext) return;

        const { targets } = currentContext;
        if (targets.topRoot.dataset["screenState"] === "idle") {
          // Exit-guard: the consumer decided not to pop — glide back from the
          // completed position, then clean up like a canceled gesture. A full
          // screen width is where every style's exit has finished (ratio 1).
          setSwipeState(targets, "canceling");
          playRelease(currentContext, window.innerWidth, "cancel", () => finishGesture(targets));
          return;
        }

        // The consumer popped. Keep `completing` on both roots so the
        // redundant exit animation stays suppressed: the exiting top unmounts
        // with the attribute, and the behind screen self-cleans once idle.
        phaseRef.current = "idle";
        contextRef.current = null;
      });
    } else {
      playRelease(context, context.displacement, "cancel", () => {
        const currentContext = contextRef.current;
        if (!currentContext) return;

        finishGesture(currentContext.targets);
      });
    }

    onSwipeEnd({ swiped });
  }

  // Self-clean: a screen resting as top must carry no leftover swipe state
  // (e.g. the former behind screen after a completed swipe + pop).
  useEffect(() => {
    if (screenState !== "idle") return;
    if (phaseRef.current !== "idle") return;

    const rootEl = rootRef.current;
    if (!rootEl || rootEl.dataset["swipeBackState"] === undefined) return;

    delete rootEl.dataset["swipeBackState"];
    clearSwipeVars(rootEl);
    clearSwipeVars(layerRef.current);
    clearSwipeVars(dimRef.current);
  }, [screenState, rootRef, layerRef, dimRef]);

  // Abort on unmount: never leave attributes on the (still mounted) behind
  // screen or timers running against a torn-down screen. Touches only stable
  // refs and module-level helpers, so the empty dependency list is exact.
  useEffect(() => {
    return () => {
      cancelAll(releaseAnimsRef.current);
      releaseAnimsRef.current = [];
      pendingMoveRef.current = null;
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      const context = contextRef.current;
      if (context && phaseRef.current !== "idle") {
        clearSwipeState(context.targets);
        clearAllSwipeVars(context.targets);
      }
      phaseRef.current = "idle";
      contextRef.current = null;
    };
  }, []);

  const interactionProps: React.HTMLAttributes<HTMLElement> = {
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
  };

  return {
    rootProps:
      swipeBackArea === "full"
        ? ({
            onTouchStart: (event: React.TouchEvent) =>
              handleTouchStart(event, { claimImmediately: false }),
            ...interactionProps,
          } as React.HTMLAttributes<HTMLElement>)
        : ({} as React.HTMLAttributes<HTMLElement>),
    edgeProps:
      swipeBackArea === "edge"
        ? ({
            onTouchStart: (event: React.TouchEvent) =>
              handleTouchStart(event, { claimImmediately: true }),
            ...interactionProps,
          } as React.HTMLAttributes<HTMLElement>)
        : ({} as React.HTMLAttributes<HTMLElement>),
  };
}
