import * as React from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";

import type { LynxViewProps } from "../../types";
import {
  useComposedScaleFeedback,
  type UseScaleFeedbackOptions,
} from "../../hooks/useScaleFeedback";
import { mergeScaleFeedbackProps } from "./mergeScaleFeedbackProps";

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
    const childProps = children.props;
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useComposedScaleFeedback(
      options,
      {
        ref: childProps["main-thread:ref"],
        forwardedRef,
        layoutChange: childProps["main-thread:bindlayoutchange"],
        touchStart: childProps["main-thread:bindtouchstart"],
        touchEnd: childProps["main-thread:bindtouchend"],
        touchCancel: childProps["main-thread:bindtouchcancel"],
      },
    );

    return React.cloneElement(
      children,
      mergeScaleFeedbackProps(childProps, {
        ...scaleFeedbackTriggerProps,
        ...scaleFeedbackTargetProps,
      }),
    );
  },
);

ScaleFeedback.displayName = "ScaleFeedback";
