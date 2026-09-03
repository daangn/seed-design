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
} from "@seed-design/lynx-css/scale-feedback";

import type { LynxViewProps } from "../types";
import { calculateScaleFeedback, isReducedMotion } from "../utils/calculate-scale-feedback";

type MainThreadLayoutChangeHandler = NonNullable<LynxViewProps["main-thread:bindlayoutchange"]>;
type MainThreadTouchHandler = NonNullable<LynxViewProps["main-thread:bindtouchstart"]>;

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

function readScaleFeedbackScale(target: ScaleFeedbackElement | null): number | null {
  "main thread";

  if (!target) return null;

  let width = 0;
  let height = 0;
  try {
    // Hidden targets may first report a 0x0 layout. Read their current size again
    // at touchstart so the scale always uses the interactive layout.
    width = Number.parseFloat(target.getComputedStyleProperty("width"));
    height = Number.parseFloat(target.getComputedStyleProperty("height"));
  } catch {
    return null;
  }

  if (width <= 0 || height <= 0 || Number.isNaN(width) || Number.isNaN(height)) return null;

  return calculateScaleFeedback(width, height);
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
  const { disabled = false, onTouchStart, onTouchEnd, onTouchCancel } = options;
  const globalProps = useGlobalProps() as SeedMotionGlobalProps | undefined;
  const reducedMotion = isReducedMotion(globalProps?.motion);
  const targetRef = useMainThreadRef<ScaleFeedbackElement | null>(null);
  const animationRef = useMainThreadRef<MainThread.Animation>(null);
  const scaleRef = useMainThreadRef<number | null>(null);
  const hasMountedRef = useRef(false);

  function handleLayoutChange(event: MainThread.LayoutChangeEvent) {
    "main thread";

    targetRef.current = event.currentTarget as ScaleFeedbackElement;
    const width = event.detail?.width ?? event.params?.width ?? 0;
    const height = event.detail?.height ?? event.params?.height ?? 0;
    if (width > 0 && height > 0) {
      scaleRef.current = calculateScaleFeedback(width, height);
    } else {
      scaleRef.current = null;
    }
    targetRef.current?.setStyleProperty("transform-origin", "center center");
  }

  function handleTouchStart() {
    "main thread";

    if (!disabled && !reducedMotion) {
      const scale = scaleRef.current ?? readScaleFeedbackScale(targetRef.current);
      if (scale !== null) {
        scaleRef.current = scale;
        runScaleFeedback(targetRef, animationRef, scale, feedbackScaleDuration);
      }
    }
    if (onTouchStart) runOnBackground(onTouchStart)();
  }

  function handleTouchEnd() {
    "main thread";

    runScaleFeedback(targetRef, animationRef, 1, feedbackScaleDuration);
    if (onTouchEnd) runOnBackground(onTouchEnd)();
  }

  function handleTouchCancel() {
    "main thread";

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
      // Preserve a native view for transform animations instead of allowing Lynx to flatten it.
      flatten: false,
      "main-thread:ref": targetRef,
      "main-thread:bindlayoutchange": handleLayoutChange,
    },
  };
}
