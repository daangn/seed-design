import * as React from "@lynx-js/react";
import { useScaleFeedback, type UseScaleFeedbackOptions } from "../../hooks/useScaleFeedback";
import type { LynxViewRef } from "../../types";

export interface ScaleFeedbackProps extends UseScaleFeedbackOptions {
  /** Content rendered inside the native element that receives Self Scale Feedback. */
  children: React.ReactNode;
}

/**
 * Applies Self Scale Feedback through a native Lynx view.
 */
export const ScaleFeedback = React.forwardRef<unknown, ScaleFeedbackProps>(
  ({ children, ...options }, ref) => {
    const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback(options);

    return (
      <view
        {...(ref ? { ref: ref as LynxViewRef } : {})}
        {...scaleFeedbackTriggerProps}
        {...scaleFeedbackTargetProps}
      >
        {children}
      </view>
    );
  },
);

ScaleFeedback.displayName = "ScaleFeedback";
