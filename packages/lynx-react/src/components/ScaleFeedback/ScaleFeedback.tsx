import * as React from "@lynx-js/react";
import { useScaleFeedback, type UseScaleFeedbackOptions } from "../../hooks/useScaleFeedback";

export interface ScaleFeedbackProps extends UseScaleFeedbackOptions {
  /** Content rendered inside the native element that receives Self Scale Feedback. */
  children: React.ReactNode;
}

/**
 * Applies Self Scale Feedback through a native Lynx view.
 */
export function ScaleFeedback({ children, ...options }: ScaleFeedbackProps) {
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback(options);

  return (
    <view {...scaleFeedbackTriggerProps} {...scaleFeedbackTargetProps}>
      {children}
    </view>
  );
}
