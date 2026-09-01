import {
  runOnMainThread,
  runOnBackground,
  useEffect,
  useGlobalProps,
  useMainThreadRef,
} from "@lynx-js/react";
import type { RefObject } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";

import type { LynxViewProps } from "../types";
import {
  calculateScaleFeedback,
  isReducedMotion,
} from "../utils/calculate-scale-feedback" with {
  runtime: "shared",
};

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

function resetScaleFeedback(targetRef: RefObject<MainThread.Element | null>) {
  "main thread";

  targetRef.current?.setStyleProperties({
    transform: "scale(1)",
    "transform-origin": "center center",
    transition: "transform 150ms cubic-bezier(0, 0, 0.15, 1)",
  });
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
export function useScaleFeedback(
  options: UseScaleFeedbackOptions = {},
): UseScaleFeedbackReturn {
  const { disabled = false, onPressStart, onPressEnd, onPressCancel } = options;
  const globalProps = useGlobalProps() as SeedMotionGlobalProps | undefined;
  const reducedMotion = isReducedMotion(globalProps?.motion);
  const targetRef = useMainThreadRef<MainThread.Element>(null);
  const scaleRef = useMainThreadRef(1);

  function handleLayoutChange(event: MainThread.LayoutChangeEvent) {
    "main thread";

    const width = event.detail?.width ?? event.params?.width ?? 0;
    const height = event.detail?.height ?? event.params?.height ?? 0;
    scaleRef.current = calculateScaleFeedback(width, height);
  }

  function handleTouchStart() {
    "main thread";

    const scale = disabled || reducedMotion ? 1 : scaleRef.current;
    targetRef.current?.setStyleProperties({
      transform: `scale(${scale})`,
      "transform-origin": "center center",
      transition: "transform 150ms cubic-bezier(0, 0, 0.15, 1)",
    });
    if (onPressStart) runOnBackground(onPressStart)();
  }

  function handleTouchEnd() {
    "main thread";

    resetScaleFeedback(targetRef);
    if (onPressEnd) runOnBackground(onPressEnd)();
  }

  function handleTouchCancel() {
    "main thread";

    resetScaleFeedback(targetRef);
    if (onPressCancel) runOnBackground(onPressCancel)();
  }

  useEffect(() => {
    if (!disabled && !reducedMotion) return;

    runOnMainThread(resetScaleFeedback)(targetRef);
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
