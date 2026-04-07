'use client';
import { PullToRefresh as PullToRefreshPrimitive } from "@ride-developer/react-pull-to-refresh";
import {
  pullToRefresh,
  type PullToRefreshVariantProps,
} from "@ride-developer/css/recipes/pull-to-refresh";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";

const { withContext, withProvider } = createSlotRecipeContext(pullToRefresh);

export interface PullToRefreshRootProps
  extends PullToRefreshVariantProps,
    PullToRefreshPrimitive.RootProps {}

export const PullToRefreshRoot = withProvider<HTMLDivElement, PullToRefreshRootProps>(
  PullToRefreshPrimitive.Root,
  "root",
);

export interface PullToRefreshIndicatorProps extends PullToRefreshPrimitive.IndicatorProps {}

export const PullToRefreshIndicator = withContext<HTMLDivElement, PullToRefreshIndicatorProps>(
  PullToRefreshPrimitive.Indicator,
  "indicator",
);

export interface PullToRefreshContentProps extends PullToRefreshPrimitive.ContentProps {}

export const PullToRefreshContent = PullToRefreshPrimitive.Content;
