import type { ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from "@lynx-js/react";
import type { NodesRef } from "@lynx-js/types";
import {
  PullToRefreshRoot as HeadlessRoot,
  PullToRefreshIndicator as HeadlessIndicator,
  PullToRefreshContent as HeadlessContent,
  PullToRefreshListContent as HeadlessListContent,
  type PullToRefreshRootProps as HeadlessRootProps,
  type PullToRefreshIndicatorProps as HeadlessIndicatorProps,
  type PullToRefreshContentProps as HeadlessContentProps,
  type PullToRefreshListContentProps as HeadlessListContentProps,
} from "@seed-design/lynx-react-pull-to-refresh";
import { pullToRefresh } from "@seed-design/lynx-css/recipes/pull-to-refresh";
import type { LynxHostProps } from "../../types";
import { createSlotRecipeContext } from "../../utils/create-slot-recipe-context";

const { withProvider, withContext } = createSlotRecipeContext(pullToRefresh);

export interface PullToRefreshRootProps
  extends Omit<HeadlessRootProps, keyof LynxHostProps<"view">>,
    LynxHostProps<"view"> {}
export interface PullToRefreshIndicatorProps
  extends Pick<HeadlessIndicatorProps, "children">,
    Omit<LynxHostProps<"view">, "children"> {}
export interface PullToRefreshContentProps
  extends Omit<HeadlessContentProps, keyof LynxHostProps<"scroll-view">>,
    LynxHostProps<"scroll-view"> {}
export interface PullToRefreshListContentProps
  extends Omit<HeadlessListContentProps, keyof LynxHostProps<"list">>,
    LynxHostProps<"list"> {}

export const PullToRefreshRoot: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshRootProps> & RefAttributes<NodesRef>
> = withProvider<NodesRef, PullToRefreshRootProps>(HeadlessRoot, "root");
export const PullToRefreshIndicator: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshIndicatorProps> & RefAttributes<NodesRef>
> = withContext<NodesRef, PullToRefreshIndicatorProps>(HeadlessIndicator, "indicator");
export const PullToRefreshContent: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshContentProps> & RefAttributes<NodesRef>
> = withContext<NodesRef, PullToRefreshContentProps>(HeadlessContent, "content");
export const PullToRefreshListContent: ForwardRefExoticComponent<
  PropsWithoutRef<PullToRefreshListContentProps> & RefAttributes<NodesRef>
> = withContext<NodesRef, PullToRefreshListContentProps>(HeadlessListContent, "content");

PullToRefreshRoot.displayName = "PullToRefreshRoot";
PullToRefreshIndicator.displayName = "PullToRefreshIndicator";
PullToRefreshContent.displayName = "PullToRefreshContent";
PullToRefreshListContent.displayName = "PullToRefreshListContent";
