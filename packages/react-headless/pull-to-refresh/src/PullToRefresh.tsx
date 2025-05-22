"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import { forwardRef } from "react";
import {
  usePullToRefresh,
  type PullToRefreshIndicatorRenderProps,
  type UsePullToRefreshProps,
} from "./usePullToRefresh";
import { PullToRefreshProvider, usePullToRefreshContext } from "./usePullToRefreshContext";

export interface PullToRefreshRootProps
  extends UsePullToRefreshProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const PullToRefreshRoot = forwardRef<HTMLDivElement, PullToRefreshRootProps>(
  (props, ref) => {
    const {
      displacementMultiplier,
      threshold,
      onPtrPullStart,
      onPtrPullMove,
      onPtrPullEnd,
      onPtrReady,
      onPtrRefresh,
      ...otherProps
    } = props;
    const api = usePullToRefresh({
      displacementMultiplier,
      threshold,
      onPtrPullStart,
      onPtrPullMove,
      onPtrPullEnd,
      onPtrReady,
      onPtrRefresh,
    });

    return (
      <PullToRefreshProvider value={api}>
        <Primitive.div
          ref={composeRefs(api.refs.root, ref)}
          {...mergeProps(api.rootProps, otherProps)}
        />
      </PullToRefreshProvider>
    );
  },
);
PullToRefreshRoot.displayName = "PullToRefreshRoot";

export interface PullToRefreshIndicatorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  children: (props: PullToRefreshIndicatorRenderProps) => React.ReactNode;
}

export const PullToRefreshIndicator = (props: PullToRefreshIndicatorProps) => {
  const { children, ...otherProps } = props;
  const { indicatorProps, getIndicatorRenderProps } = usePullToRefreshContext();
  return (
    <div {...mergeProps(indicatorProps, otherProps)}>{children(getIndicatorRenderProps())}</div>
  );
};

export interface PullToRefreshContentProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const PullToRefreshContent = forwardRef<HTMLDivElement, PullToRefreshContentProps>(
  (props, ref) => {
    const { contentProps } = usePullToRefreshContext();
    return <Primitive.div ref={ref} {...mergeProps(contentProps, props)} />;
  },
);
PullToRefreshContent.displayName = "PullToRefreshContent";
