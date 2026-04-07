'use client';
import { chipTabs, type ChipTabsVariantProps } from "@ride-developer/css/recipes/chip-tabs";
import { Tabs as TabsPrimitive } from "@ride-developer/react-tabs";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { forwardRef } from "react";
import clsx from "clsx";

const { ClassNamesProvider, withContext } = createSlotRecipeContext(chipTabs);

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsRootProps extends ChipTabsVariantProps, TabsPrimitive.RootProps {}

export const ChipTabsRoot = forwardRef<HTMLDivElement, ChipTabsRootProps>(
  ({ className, ...props }, ref) => {
    if (process.env.NODE_ENV !== "production" && props.variant === "brandSolid") {
      console.warn(
        "[Ride Design System] ChipTabs variant='brandSolid' is deprecated and will be removed in @ride-developer/react@2.0.0. Use variant='neutralSolid' or variant='neutralOutline' instead.",
      );
    }

    const [variantProps, otherProps] = chipTabs.splitVariantProps(props);
    const classNames = chipTabs(variantProps);

    return (
      <ClassNamesProvider value={classNames}>
        <TabsPrimitive.Root
          ref={ref}
          className={clsx(classNames.root, className)}
          {...otherProps}
        />
      </ClassNamesProvider>
    );
  },
);
ChipTabsRoot.displayName = "ChipTabsRoot";

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsListProps extends TabsPrimitive.ListProps {}

export const ChipTabsList = withContext<HTMLDivElement, ChipTabsListProps>(
  TabsPrimitive.List,
  "list",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsTriggerProps extends TabsPrimitive.TriggerProps {}

export const ChipTabsTrigger = withContext<HTMLButtonElement, ChipTabsTriggerProps>(
  TabsPrimitive.Trigger,
  "trigger",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsContentProps extends TabsPrimitive.ContentProps {}

export const ChipTabsContent = withContext<HTMLSpanElement, ChipTabsContentProps>(
  TabsPrimitive.Content,
  "content",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsCarouselProps extends TabsPrimitive.CarouselProps {}

export const ChipTabsCarousel = withContext<HTMLDivElement, ChipTabsCarouselProps>(
  TabsPrimitive.Carousel,
  "carousel",
);

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsCarouselCameraProps extends TabsPrimitive.CarouselCameraProps {}

export const ChipTabsCarouselCamera = withContext<HTMLDivElement, ChipTabsCarouselCameraProps>(
  TabsPrimitive.CarouselCamera,
  "carouselCamera",
);
