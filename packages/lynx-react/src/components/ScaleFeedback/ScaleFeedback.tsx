import * as React from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";

import type { LynxViewProps } from "../../types";
import { useScaleFeedback, type UseScaleFeedbackOptions } from "../../hooks/useScaleFeedback";
import { mergeScaleFeedbackProps } from "./mergeScaleFeedbackProps";

type MainThreadRef = NonNullable<LynxViewProps["main-thread:ref"]>;
type MainThreadRefCleanup = undefined | (() => void);

function assignMainThreadRef(
  ref: MainThreadRef | null | undefined,
  element: MainThread.Element | null,
): MainThreadRefCleanup {
  "main thread";

  if (typeof ref === "function") {
    const cleanup = ref(element);
    return typeof cleanup === "function" ? cleanup : undefined;
  }
  if (ref) ref.current = element;
}

function releaseMainThreadRef(
  ref: MainThreadRef | null | undefined,
  cleanup: MainThreadRefCleanup,
) {
  "main thread";

  if (cleanup) {
    cleanup();
    return;
  }

  assignMainThreadRef(ref, null);
}

export interface ScaleFeedbackProps extends UseScaleFeedbackOptions {
  /** The single Lynx element that receives Self Scale Feedback. */
  children: React.ReactElement<LynxViewProps>;
}

/**
 * Applies Self Scale Feedback to a single child without adding a wrapper.
 *
 * Existing Main Thread touch, layout, and ref props on the child are composed
 * with SEED's handlers instead of being replaced.
 */
export const ScaleFeedback = React.forwardRef<MainThread.Element, ScaleFeedbackProps>(
  ({ children, ...options }, forwardedRef) => {
    if (!React.isValidElement<LynxViewProps>(children)) {
      throw new Error("ScaleFeedback requires a single Lynx element child.");
    }

    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback(options);
    const childProps = children.props;
    const childRef = childProps["main-thread:ref"];
    const childLayoutChange = childProps["main-thread:bindlayoutchange"];
    const childTouchStart = childProps["main-thread:bindtouchstart"];
    const childTouchEnd = childProps["main-thread:bindtouchend"];
    const childTouchCancel = childProps["main-thread:bindtouchcancel"];
    const feedbackRef = scaleFeedbackTargetProps["main-thread:ref"];
    const feedbackLayoutChange = scaleFeedbackTargetProps["main-thread:bindlayoutchange"];
    const feedbackTouchStart = scaleFeedbackTriggerProps["main-thread:bindtouchstart"];
    const feedbackTouchEnd = scaleFeedbackTriggerProps["main-thread:bindtouchend"];
    const feedbackTouchCancel = scaleFeedbackTriggerProps["main-thread:bindtouchcancel"];

    function handleMainThreadRef(element: MainThread.Element | null) {
      "main thread";

      const childCleanup = assignMainThreadRef(childRef, element);
      const forwardedCleanup = assignMainThreadRef(forwardedRef, element);
      const feedbackCleanup = assignMainThreadRef(feedbackRef, element);

      return () => {
        "main thread";

        releaseMainThreadRef(childRef, childCleanup);
        releaseMainThreadRef(forwardedRef, forwardedCleanup);
        releaseMainThreadRef(feedbackRef, feedbackCleanup);
      };
    }

    function handleLayoutChange(event: MainThread.LayoutChangeEvent) {
      "main thread";

      childLayoutChange?.(event);
      feedbackLayoutChange(event);
    }

    function handleTouchStart(event: MainThread.TouchEvent) {
      "main thread";

      childTouchStart?.(event);
      feedbackTouchStart(event);
    }

    function handleTouchEnd(event: MainThread.TouchEvent) {
      "main thread";

      childTouchEnd?.(event);
      feedbackTouchEnd(event);
    }

    function handleTouchCancel(event: MainThread.TouchEvent) {
      "main thread";

      childTouchCancel?.(event);
      feedbackTouchCancel(event);
    }

    return React.cloneElement(
      children,
      mergeScaleFeedbackProps(childProps, {
        "main-thread:ref": handleMainThreadRef,
        "main-thread:bindlayoutchange": handleLayoutChange,
        "main-thread:bindtouchstart": handleTouchStart,
        "main-thread:bindtouchend": handleTouchEnd,
        "main-thread:bindtouchcancel": handleTouchCancel,
      }),
    );
  },
);

ScaleFeedback.displayName = "ScaleFeedback";
