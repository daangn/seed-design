"use client";

import { composeRefs } from "@radix-ui/react-compose-refs";
import { mergeProps } from "@seed-design/dom-utils";
import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import type * as React from "react";
import { forwardRef, useMemo } from "react";
import { useRenderStrategy, type UseRenderStrategyProps } from "./private/useRenderStrategy";
import {
  RenderStrategyPropsProvider,
  useRenderStrategyPropsContext,
} from "./private/useRenderStrategyPropsContext";
import type { UseTabsContentProps, UseTabsProps, UseTabsTriggerProps } from "./useTabs";
import { useTabs } from "./useTabs";
import { useTabsCarousel, type UseTabsCarouselProps } from "./useTabsCarousel";
import { TabsCarouselProvider, useTabsCarouselContext } from "./useTabsCarouselContext";
import { TabsProvider, useTabsContext } from "./useTabsContext";
import { TabsTriggerProvider } from "./useTabsTriggerContext";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsRootProps
  extends UseTabsProps,
    UseRenderStrategyProps,
    PrimitiveProps,
    Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {}

export const TabsRoot = forwardRef<HTMLDivElement, TabsRootProps>((props, ref) => {
  const {
    defaultValue,
    value,
    onValueChange,
    orientation,
    lazyMount,
    unmountOnExit,
    ...otherProps
  } = props;
  const api = useTabs({
    defaultValue,
    value,
    onValueChange,
    orientation,
  });
  return (
    <TabsProvider value={api}>
      <RenderStrategyPropsProvider
        value={useMemo(() => ({ lazyMount, unmountOnExit }), [lazyMount, unmountOnExit])}
      >
        <Primitive.div ref={ref} {...mergeProps(api.rootProps, otherProps)} />
      </RenderStrategyPropsProvider>
    </TabsProvider>
  );
});
TabsRoot.displayName = "TabsRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsListProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>((props, ref) => {
  const api = useTabsContext();
  return (
    <Primitive.div ref={composeRefs(api.refs.list, ref)} {...mergeProps(api.listProps, props)} />
  );
});
TabsList.displayName = "TabsList";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsTriggerProps
  extends UseTabsTriggerProps,
    PrimitiveProps,
    React.HTMLAttributes<HTMLButtonElement> {}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>((props, ref) => {
  const { value, disabled, ...otherProps } = props;
  const api = useTabsContext();
  const triggerApi = api.getTriggerProps({ value, disabled });
  return (
    <TabsTriggerProvider value={triggerApi}>
      <Primitive.button
        ref={composeRefs(triggerApi.refs.root, ref)}
        {...mergeProps(triggerApi.rootProps, otherProps)}
      />
    </TabsTriggerProvider>
  );
});
TabsTrigger.displayName = "TabsTrigger";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsContentProps
  extends PrimitiveProps,
    UseTabsContentProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>((props, ref) => {
  const { value, ...otherProps } = props;
  const api = useTabsContext();
  const carouselApi = useTabsCarouselContext({ strict: false });
  const renderStrategyProps = useRenderStrategyPropsContext();
  const { unmounted } = useRenderStrategy({
    ...renderStrategyProps,
    present: api.value === value,
  });

  if (unmounted) return null;

  return (
    <Primitive.div
      ref={ref}
      {...mergeProps(api.getContentProps({ value }), carouselApi?.stateProps ?? {}, otherProps)}
    />
  );
});
TabsContent.displayName = "TabsContent";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsIndicatorProps extends PrimitiveProps, React.HTMLAttributes<HTMLDivElement> {}

export const TabsIndicator = forwardRef<HTMLDivElement, TabsIndicatorProps>((props, ref) => {
  const api = useTabsContext();
  return <Primitive.div ref={ref} {...mergeProps(api.indicatorProps, props)} />;
});

////////////////////////////////////////////////////////////////////////////////////

export interface TabsCarouselProps
  extends PrimitiveProps,
    UseTabsCarouselProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const TabsCarousel = forwardRef<HTMLDivElement, TabsCarouselProps>((props, ref) => {
  const { dragThreshold, loop, swipeable, autoHeight, onSettle, ...otherProps } = props;
  const api = useTabsCarousel({ dragThreshold, loop, swipeable, onSettle, autoHeight });

  return (
    <TabsCarouselProvider value={api}>
      <Primitive.div
        ref={composeRefs(api.refs.root, ref)}
        {...mergeProps(api.rootProps, otherProps)}
      >
        {props.children}
      </Primitive.div>
    </TabsCarouselProvider>
  );
});
TabsCarousel.displayName = "TabsCarousel";

////////////////////////////////////////////////////////////////////////////////////

export interface TabsCarouselCameraProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const TabsCarouselCamera = forwardRef<HTMLDivElement, TabsCarouselCameraProps>(
  (props, ref) => {
    const api = useTabsCarouselContext();
    return <Primitive.div ref={ref} {...mergeProps(api.cameraProps, props)} />;
  },
);
TabsCarouselCamera.displayName = "TabsCarouselCamera";
