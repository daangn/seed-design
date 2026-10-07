import { forwardRef, type ComponentRef } from "@lynx-js/react";
import { PullToRefresh } from "@seed-design/lynx-react";
import { ProgressCircle } from "./progress-circle";

export interface PullToRefreshRootProps extends PullToRefresh.RootProps {}

export const PullToRefreshRoot = PullToRefresh.Root;

export interface PullToRefreshIndicatorProps
  extends Omit<PullToRefresh.IndicatorProps, "children"> {}

export const PullToRefreshIndicator = forwardRef<
  ComponentRef<typeof PullToRefresh.Indicator>,
  PullToRefreshIndicatorProps
>((props, ref) => (
  <PullToRefresh.Indicator ref={ref} {...props}>
    {(indicatorProps) => <ProgressCircle size="24" tone="neutral" {...indicatorProps} />}
  </PullToRefresh.Indicator>
));
PullToRefreshIndicator.displayName = "PullToRefreshIndicator";

export interface PullToRefreshContentProps extends PullToRefresh.ContentProps {}

export const PullToRefreshContent = PullToRefresh.Content;
