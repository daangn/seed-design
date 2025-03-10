import { Primitive, type PrimitiveProps } from "@seed-design/react-primitive";
import {
  Tabs as TabsPrimitive,
  useTabsContext,
  useTabsTriggerContext,
} from "@seed-design/react-tabs";
import { tabs, type TabsVariantProps } from "@seed-design/css/recipes/tabs";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { createWithStateProps } from "../../utils/createWithStateProps";
import type React from "react";

const { withProvider, withContext } = createSlotRecipeContext(tabs);
const withStateProps = createWithStateProps([useTabsContext, useTabsTriggerContext], {
  strict: false,
});

////////////////////////////////////////////////////////////////////////////////////

export interface TabsRootProps extends TabsVariantProps, TabsPrimitive.RootProps {}

export const TabsRoot = withProvider<HTMLDivElement, TabsRootProps>(TabsPrimitive.Root, "root");

////////////////////////////////////////////////////////////////////////////////////

export interface TabsListProps extends TabsPrimitive.ListProps {}

export const TabsList = withContext<HTMLDivElement, TabsListProps>(TabsPrimitive.List, "list");

////////////////////////////////////////////////////////////////////////////////////

export interface TabsTriggerProps extends TabsPrimitive.TriggerProps {}

export const TabsTrigger = withContext<HTMLButtonElement, TabsTriggerProps>(
  TabsPrimitive.Trigger,
  "trigger",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TabsTriggerNotificationProps
  extends PrimitiveProps,
    React.HTMLAttributes<HTMLDivElement> {}

export const TabsTriggerNotification = withContext<HTMLDivElement, TabsTriggerNotificationProps>(
  withStateProps(Primitive.div),
  "triggerNotification",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TabsIndicatorProps extends TabsPrimitive.IndicatorProps {}

export const TabsIndicator = withContext<HTMLSpanElement, TabsIndicatorProps>(
  TabsPrimitive.Indicator,
  "indicator",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TabsContentProps extends TabsPrimitive.ContentProps {}

export const TabsContent = withContext<HTMLSpanElement, TabsContentProps>(
  TabsPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TabsCarouselProps extends TabsPrimitive.CarouselProps {}

export const TabsCarousel = withContext<HTMLDivElement, TabsCarouselProps>(
  TabsPrimitive.Carousel,
  "carousel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface TabsCarouselCameraProps extends TabsPrimitive.CarouselCameraProps {}

export const TabsCarouselCamera = withContext<HTMLDivElement, TabsCarouselCameraProps>(
  TabsPrimitive.CarouselCamera,
  "carouselCamera",
);
