import {
  runOnMainThread,
  runOnBackground,
  useEffect,
  useGlobalProps,
  useMainThreadRef,
  useRef,
} from "@lynx-js/react";
import type { RefObject } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import {
  feedbackScaleDuration,
  feedbackScaleTimingFunction,
} from "@seed-design/lynx-css/scale-feedback" with { runtime: "shared" };

import type { LynxViewProps } from "../types";
import { calculateScaleFeedback, isReducedMotion } from "../utils/calculate-scale-feedback" with {
  runtime: "shared",
};
import type { ScaleFeedbackElement } from "../utils/animate-scale-feedback";

type MainThreadLayoutChangeHandler = NonNullable<LynxViewProps["main-thread:bindlayoutchange"]>;
type MainThreadTouchHandler = NonNullable<LynxViewProps["main-thread:bindtouchstart"]>;

interface SeedMotionGlobalProps {
  motion?: unknown;
}

export interface UseScaleFeedbackOptions {
  /** Disables Scale Feedback while the target is not interactive. */
  disabled?: boolean;
  /** Runs on the Background Thread immediately after Main Thread touchstart. */
  onPressStart?: () => void;
  /** Runs on the Background Thread immediately after Main Thread touchend or touchcancel. */
  onPressEnd?: () => void;
  /** Runs on the Background Thread immediately after Main Thread touchcancel. */
  onPressCancel?: () => void;
}

export interface ScaleFeedbackTriggerProps {
  "main-thread:bindtouchstart": MainThreadTouchHandler;
  "main-thread:bindtouchend": MainThreadTouchHandler;
  "main-thread:bindtouchcancel": MainThreadTouchHandler;
}

export interface ScaleFeedbackTargetProps {
  "main-thread:ref": NonNullable<LynxViewProps["main-thread:ref"]>;
  "main-thread:bindlayoutchange": MainThreadLayoutChangeHandler;
}

export interface UseScaleFeedbackReturn {
  /** Spread onto the element that receives touch events. */
  scaleFeedbackTriggerProps: ScaleFeedbackTriggerProps;
  /** Spread onto the element that is measured and scaled. */
  scaleFeedbackTargetProps: ScaleFeedbackTargetProps;
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
export function useScaleFeedback(options: UseScaleFeedbackOptions = {}): UseScaleFeedbackReturn {
  const { disabled = false, onPressStart, onPressEnd, onPressCancel } = options;
  const globalProps = useGlobalProps() as SeedMotionGlobalProps | undefined;
  const reducedMotion = isReducedMotion(globalProps?.motion);
  const targetRef = useMainThreadRef<ScaleFeedbackElement>(null);
  const animationRef = useMainThreadRef<MainThread.Animation>(null);
  const scaleRef = useMainThreadRef(1);
  const hasMountedRef = useRef(false);

  function handleLayoutChange(event: MainThread.LayoutChangeEvent) {
    "main thread";

    const width = event.detail?.width ?? event.params?.width ?? 0;
    const height = event.detail?.height ?? event.params?.height ?? 0;
    scaleRef.current = calculateScaleFeedback(width, height);
    targetRef.current?.setStyleProperty("transform-origin", "center center");
  }

  function handleTouchStart() {
    "main thread";

    if (!disabled && !reducedMotion) {
      runScaleFeedback(targetRef, animationRef, scaleRef.current, feedbackScaleDuration);
    }
    if (onPressStart) runOnBackground(onPressStart)();
  }

  function handleTouchEnd() {
    "main thread";

    runScaleFeedback(targetRef, animationRef, 1, feedbackScaleDuration);
    if (onPressEnd) runOnBackground(onPressEnd)();
  }

  function handleTouchCancel() {
    "main thread";

    runScaleFeedback(targetRef, animationRef, 1, feedbackScaleDuration);
    if (onPressCancel) runOnBackground(onPressCancel)();
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
      "main-thread:ref": targetRef,
      "main-thread:bindlayoutchange": handleLayoutChange,
    },
  };
}
