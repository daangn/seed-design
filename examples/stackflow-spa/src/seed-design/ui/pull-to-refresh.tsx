"use client";

import { PullToRefresh } from "@seed-design/react";
import { forwardRef } from "react";
import { ProgressCircle } from "./progress-circle";

export interface PullToRefreshRootProps extends PullToRefresh.RootProps {}

export const PullToRefreshRoot = PullToRefresh.Root;

export interface PullToRefreshIndicatorProps
  extends Omit<PullToRefresh.IndicatorProps, "children"> {}

export const PullToRefreshIndicator = forwardRef<
  HTMLDivElement,
  PullToRefreshIndicatorProps
>(({ ...otherProps }, ref) => {
  return (
    <PullToRefresh.Indicator ref={ref} {...otherProps}>
      {(props) => <ProgressCircle size="24" tone="brand" {...props} />}
    </PullToRefresh.Indicator>
  );
});

export interface PullToRefreshContentProps extends PullToRefresh.ContentProps {}

export const PullToRefreshContent = PullToRefresh.Content;
