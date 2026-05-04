import { HStack, NotificationBadge, ChipTabs as SeedChipTabs } from "@seed-design/react";
import { forwardRef } from "react";

export interface ChipTabsRootProps extends SeedChipTabs.RootProps {}

export const ChipTabsRoot = SeedChipTabs.Root;

export interface ChipTabsListProps extends SeedChipTabs.ListProps {}

export const ChipTabsList = SeedChipTabs.List;

export interface ChipTabsTriggerProps extends Omit<SeedChipTabs.TriggerProps, "asChild"> {
  notification?: boolean;
}

export const ChipTabsTrigger = forwardRef<HTMLButtonElement, ChipTabsTriggerProps>((props, ref) => {
  const { children, notification, ...otherProps } = props;
  return (
    <SeedChipTabs.Trigger ref={ref} {...otherProps}>
      {notification ? (
        <HStack as="span" gap="x1_5">
          {children}
          <NotificationBadge size="small" />
        </HStack>
      ) : (
        children
      )}
    </SeedChipTabs.Trigger>
  );
});
ChipTabsTrigger.displayName = "ChipTabsTrigger";

export interface ChipTabsCarouselProps extends Omit<SeedChipTabs.CarouselProps, "asChild"> {}

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
