import {
  runOnMainThread,
  runOnBackground,
  useEffect,
  useGlobalProps,
  useMainThreadRef,
  useRef,
} from "@lynx-js/react";
import { runWorkletCtx } from "@lynx-js/react/worklet-runtime/bindings" with { runtime: "shared" };
import type { RefObject } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import {
  feedbackScaleDuration,
  feedbackScaleTimingFunction,
} from "@seed-design/lynx-css/scale-feedback";

import type { LynxViewProps } from "../types";
import { calculateScaleFeedback, isReducedMotion } from "../utils/calculate-scale-feedback";

type MainThreadLayoutChangeHandler = NonNullable<LynxViewProps["main-thread:bindlayoutchange"]>;
type MainThreadTouchHandler = NonNullable<LynxViewProps["main-thread:bindtouchstart"]>;
type MainThreadRef = NonNullable<LynxViewProps["main-thread:ref"]>;
type MainThreadRefCleanup = undefined | (() => void);
type RunWorklet = (worklet: unknown, params: unknown[]) => unknown;

interface SeedMotionGlobalProps {
  motion?: unknown;
}

interface ScaleFeedbackElement extends MainThread.Element {
  getComputedStyleProperty(styleName: string): string;
}

export interface UseScaleFeedbackOptions {
  /** Disables Scale Feedback while the target is not interactive. */
  disabled?: boolean;
  /** Runs on the Background Thread immediately after Main Thread touchstart. */
  onTouchStart?: () => void;
  /** Runs on the Background Thread immediately after Main Thread touchend. */
  onTouchEnd?: () => void;
  /** Runs on the Background Thread immediately after Main Thread touchcancel. */
  onTouchCancel?: () => void;
}

export interface ScaleFeedbackTriggerProps {
  "main-thread:bindtouchstart": MainThreadTouchHandler;
  "main-thread:bindtouchend": MainThreadTouchHandler;
  "main-thread:bindtouchcancel": MainThreadTouchHandler;
}

export interface ScaleFeedbackTargetProps {
  flatten: false;
  "main-thread:ref": NonNullable<LynxViewProps["main-thread:ref"]>;
  "main-thread:bindlayoutchange": MainThreadLayoutChangeHandler;
}

export interface UseScaleFeedbackReturn {
  /** Spread onto the element that receives touch events. */
  scaleFeedbackTriggerProps: ScaleFeedbackTriggerProps;
  /** Spread onto the element that is measured and scaled. */
  scaleFeedbackTargetProps: ScaleFeedbackTargetProps;
}

export interface ScaleFeedbackComposition {
  ref?: MainThreadRef | null;
  forwardedRef?: MainThreadRef | null;
  layoutChange?: MainThreadLayoutChangeHandler;
  touchStart?: MainThreadTouchHandler;
  touchEnd?: MainThreadTouchHandler;
  touchCancel?: MainThreadTouchHandler;
}

function runScaleFeedback(
  targetRef: RefObject<ScaleFeedbackElement | null>,
  animationRef: RefObject<MainThread.Animation | null>,
  scale: number,
  duration: number,
) {
  "main thread";

  const target = targetRef.current;
  if (!target) return;

  let currentTransform = "scale(1)";
  try {
    currentTransform = target.getComputedStyleProperty("transform") || currentTransform;
  } catch {
    // Some non-native runtimes expose the method but cannot evaluate it.
  }

  animationRef.current?.cancel();
  animationRef.current = target.animate(
    [{ transform: currentTransform }, { transform: `scale(${scale})` }],
    {
      duration,
      easing: feedbackScaleTimingFunction,
      fill: "forwards",
    },
  );
}

/**
 * Applies SEED Scale Feedback on the Lynx Main Thread.
 *
 * Spread `scaleFeedbackTriggerProps` onto the element that receives touch
 * events and `scaleFeedbackTargetProps` onto the element that should scale.
 * Applying both objects to one element creates Self Scale; applying them to
 * separate elements creates Content Scale.
 *
 * Supported on Lynx Engine 3.9 and later. Missing or unknown
 * `GlobalProps.motion` values preserve the default motion; only the exact
 * `"reduced"` value disables scaling.
 */
function useScaleFeedbackImpl(
  options: UseScaleFeedbackOptions,
  composition?: ScaleFeedbackComposition,
): UseScaleFeedbackReturn {
  const { disabled = false, onTouchStart, onTouchEnd, onTouchCancel } = options;
  const composedRef = composition?.ref;
  const composedForwardedRef = composition?.forwardedRef;
  const composedLayoutChange = composition?.layoutChange;
  const composedTouchStart = composition?.touchStart;
  const composedTouchEnd = composition?.touchEnd;
  const composedTouchCancel = composition?.touchCancel;
  const hasComposition = composition !== undefined;
  const globalProps = useGlobalProps() as SeedMotionGlobalProps | undefined;
  const reducedMotion = isReducedMotion(globalProps?.motion);
  const targetRef = useMainThreadRef<ScaleFeedbackElement | null>(null);
  const animationRef = useMainThreadRef<MainThread.Animation>(null);
  const scaleRef = useMainThreadRef(1);
  const hasMountedRef = useRef(false);

  function handleTargetRef(element: MainThread.Element | null) {
    "main thread";

    targetRef.current = element as ScaleFeedbackElement | null;
    const childRef = composedRef;
    const forwardedRef = composedForwardedRef;
    let childCleanup: MainThreadRefCleanup;
    let forwardedCleanup: MainThreadRefCleanup;

    if (typeof childRef === "function") {
      const cleanup = childRef(element);
      if (typeof cleanup === "function") childCleanup = cleanup;
    } else if (childRef && "current" in childRef) {
      childRef.current = element;
    } else if (childRef) {
      childCleanup = (runWorkletCtx as RunWorklet)(childRef, [element]) as MainThreadRefCleanup;
    }

    if (typeof forwardedRef === "function") {
      const cleanup = forwardedRef(element);
      if (typeof cleanup === "function") forwardedCleanup = cleanup;
    } else if (forwardedRef && "current" in forwardedRef) {
      forwardedRef.current = element;
    } else if (forwardedRef) {
      forwardedCleanup = (runWorkletCtx as RunWorklet)(forwardedRef, [
        element,
      ]) as MainThreadRefCleanup;
    }

    return () => {
      "main thread";

      if (typeof childCleanup === "function") childCleanup();
      else if (childCleanup) (runWorkletCtx as RunWorklet)(childCleanup, []);
      else if (typeof childRef === "function") childRef(null);
      else if (childRef && "current" in childRef) childRef.current = null;
      else if (childRef) (runWorkletCtx as RunWorklet)(childRef, [null]);

      if (typeof forwardedCleanup === "function") forwardedCleanup();
      else if (forwardedCleanup) (runWorkletCtx as RunWorklet)(forwardedCleanup, []);
      else if (typeof forwardedRef === "function") forwardedRef(null);
      else if (forwardedRef && "current" in forwardedRef) forwardedRef.current = null;
      else if (forwardedRef) (runWorkletCtx as RunWorklet)(forwardedRef, [null]);

      targetRef.current = null;
    };
  }

  function handleLayoutChange(event: MainThread.LayoutChangeEvent) {
    "main thread";

    const childLayoutChange = composedLayoutChange;
    if (typeof childLayoutChange === "function") childLayoutChange(event);
    else if (childLayoutChange) (runWorkletCtx as RunWorklet)(childLayoutChange, [event]);
    const width = event.detail?.width ?? event.params?.width ?? 0;
    const height = event.detail?.height ?? event.params?.height ?? 0;
    scaleRef.current = calculateScaleFeedback(width, height);
    targetRef.current?.setStyleProperty("transform-origin", "center center");
  }

  function handleTouchStart(event: MainThread.TouchEvent) {
    "main thread";

    const childTouchStart = composedTouchStart;
    if (typeof childTouchStart === "function") childTouchStart(event);
    else if (childTouchStart) (runWorkletCtx as RunWorklet)(childTouchStart, [event]);
    if (!disabled && !reducedMotion) {
      runScaleFeedback(targetRef, animationRef, scaleRef.current, feedbackScaleDuration);
    }
    if (onTouchStart) runOnBackground(onTouchStart)();
  }

  function handleTouchEnd(event: MainThread.TouchEvent) {
    "main thread";

    const childTouchEnd = composedTouchEnd;
    if (typeof childTouchEnd === "function") childTouchEnd(event);
    else if (childTouchEnd) (runWorkletCtx as RunWorklet)(childTouchEnd, [event]);
    runScaleFeedback(targetRef, animationRef, 1, feedbackScaleDuration);
    if (onTouchEnd) runOnBackground(onTouchEnd)();
  }

  function handleTouchCancel(event: MainThread.TouchEvent) {
    "main thread";

    const childTouchCancel = composedTouchCancel;
    if (typeof childTouchCancel === "function") childTouchCancel(event);
    else if (childTouchCancel) (runWorkletCtx as RunWorklet)(childTouchCancel, [event]);
    runScaleFeedback(targetRef, animationRef, 1, feedbackScaleDuration);
    if (onTouchCancel) runOnBackground(onTouchCancel)();
  }

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (!disabled && !reducedMotion) return;

    runOnMainThread(runScaleFeedback)(targetRef, animationRef, 1, 0);
  }, [disabled, reducedMotion]);

  return {
    scaleFeedbackTriggerProps: {
      "main-thread:bindtouchstart": handleTouchStart,
      "main-thread:bindtouchend": handleTouchEnd,
      "main-thread:bindtouchcancel": handleTouchCancel,
    },
    scaleFeedbackTargetProps: {
      flatten: false,
      "main-thread:ref": hasComposition ? handleTargetRef : targetRef,
      "main-thread:bindlayoutchange": handleLayoutChange,
    },
  };
}

export function useScaleFeedback(options: UseScaleFeedbackOptions = {}): UseScaleFeedbackReturn {
  return useScaleFeedbackImpl(options);
}

export function useComposedScaleFeedback(
  options: UseScaleFeedbackOptions,
  composition: ScaleFeedbackComposition,
): UseScaleFeedbackReturn {
  return useScaleFeedbackImpl(options, composition);
}
