import * as React from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import { useScaleFeedback, type UseScaleFeedbackOptions } from "./useScaleFeedback.js";

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
        {...(ref ? { ref: ref as React.Ref<NodesRef> } : {})}
        {...scaleFeedbackTriggerProps}
        {...scaleFeedbackTargetProps}
      >
        {children}
      </view>
    );
  },
);

ScaleFeedback.displayName = "ScaleFeedback";
