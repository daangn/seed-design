import {
  LoadingIndicator as SeedLoadingIndicator,
  type LoadingIndicatorProps as SeedLoadingIndicatorProps,
} from "@ride-developer/react";
import * as React from "react";
import { ProgressCircle } from "./progress-circle";

export interface LoadingIndicatorProps extends Omit<SeedLoadingIndicatorProps, "indicator"> {
  indicator?: React.ReactNode;
}

/**
 * @see https://seed-design.io/react/components/loading-indicator
 */
export const LoadingIndicator = React.forwardRef<
  React.ElementRef<typeof SeedLoadingIndicator>,
  LoadingIndicatorProps
>(
  (
    { children, indicator = <ProgressCircle size="inherit" tone="inherit" />, ...otherProps },
    ref,
  ) => {
    return (
      <SeedLoadingIndicator ref={ref} indicator={indicator} {...otherProps}>
        {children}
      </SeedLoadingIndicator>
    );
  },
);
LoadingIndicator.displayName = "LoadingIndicator";
