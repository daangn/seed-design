"use client";

import { ChipTabs as SeedChipTabs } from "@seed-design/react";

export interface ChipTabsRootProps extends SeedChipTabs.RootProps {}

export const ChipTabsRoot = SeedChipTabs.Root;

export interface ChipTabsListProps extends SeedChipTabs.ListProps {}

export const ChipTabsList = SeedChipTabs.List;

export interface ChipTabsTriggerProps extends SeedChipTabs.TriggerProps {}

export const ChipTabsTrigger = SeedChipTabs.Trigger;

export interface ChipTabsCarouselProps
  extends Omit<SeedChipTabs.CarouselProps, "asChild"> {}

export const ChipTabsCarousel = (props: ChipTabsCarouselProps) => {
  const { children, ...otherProps } = props;
  return (
    <SeedChipTabs.Carousel {...otherProps}>
      <SeedChipTabs.CarouselCamera>{children}</SeedChipTabs.CarouselCamera>
    </SeedChipTabs.Carousel>
  );
};
ChipTabsCarousel.displayName = "ChipTabsCarousel";

export interface ChipTabsContentProps extends SeedChipTabs.ContentProps {}

export const ChipTabsContent = SeedChipTabs.Content;
