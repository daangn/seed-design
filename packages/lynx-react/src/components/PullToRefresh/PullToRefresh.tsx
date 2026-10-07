import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  PullToRefreshRoot as HeadlessRoot,
  PullToRefreshIndicator as HeadlessIndicator,
  PullToRefreshContent as HeadlessContent,
  type PullToRefreshRootProps as HeadlessRootProps,
  type PullToRefreshIndicatorProps as HeadlessIndicatorProps,
  type PullToRefreshContentProps as HeadlessContentProps,
} from "@seed-design/lynx-react-pull-to-refresh";
import { pullToRefresh } from "@seed-design/lynx-css/recipes/pull-to-refresh";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

const { withProvider, withContext } = createSlotRecipeContext(pullToRefresh);

export interface PullToRefreshRootProps extends HeadlessRootProps {}
export interface PullToRefreshIndicatorProps extends HeadlessIndicatorProps {}
export interface PullToRefreshContentProps extends HeadlessContentProps {}

export const PullToRefreshRoot: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshRootProps> & RefAttributes<NodesRef>
> = withProvider<NodesRef, PullToRefreshRootProps>(HeadlessRoot, "root");
export const PullToRefreshIndicator: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshIndicatorProps> & RefAttributes<NodesRef>
> = withContext<NodesRef, PullToRefreshIndicatorProps>(HeadlessIndicator, "indicator");
export const PullToRefreshContent: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshContentProps> & RefAttributes<NodesRef>
> = withContext<NodesRef, PullToRefreshContentProps>(HeadlessContent, "content");

PullToRefreshRoot.displayName = "PullToRefreshRoot";
PullToRefreshIndicator.displayName = "PullToRefreshIndicator";
PullToRefreshContent.displayName = "PullToRefreshContent";
