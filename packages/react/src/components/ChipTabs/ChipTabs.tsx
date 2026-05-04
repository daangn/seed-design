import { chipTabs, type ChipTabsVariantProps } from "@seed-design/css/recipes/chip-tabs";
import { Tabs as TabsPrimitive } from "@seed-design/react-tabs";
import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext";
import { forwardRef } from "react";
import clsx from "clsx";

const { ClassNamesProvider, withContext } = createSlotRecipeContext(chipTabs);

////////////////////////////////////////////////////////////////////////////////////

export interface ChipTabsRootProps extends ChipTabsVariantProps, TabsPrimitive.RootProps {}

export const ChipTabsRoot = forwardRef<HTMLDivElement, ChipTabsRootProps>(
  ({ className, ...props }, ref) => {
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
