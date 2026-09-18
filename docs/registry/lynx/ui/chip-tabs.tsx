import { NotificationBadge, ChipTabs as SeedChipTabs } from "@seed-design/lynx-react";
import { forwardRef } from "@lynx-js/react";

export interface ChipTabsRootProps extends SeedChipTabs.RootProps {}

/**
 * @see https://seed-design.io/lynx/components/chip-tabs
 */
export const ChipTabsRoot = SeedChipTabs.Root;

export interface ChipTabsListProps extends SeedChipTabs.ListProps {}

export const ChipTabsList = SeedChipTabs.List;

export interface ChipTabsTriggerProps extends Omit<SeedChipTabs.TriggerProps, "notification"> {
  notification?: boolean;
}

export const ChipTabsTrigger = forwardRef<unknown, ChipTabsTriggerProps>((props, ref) => {
  const { children, notification, ...otherProps } = props;

  return (
    <SeedChipTabs.Trigger
      ref={ref}
      {...otherProps}
      notification={
        notification ? (
          <NotificationBadge size="small" accessibility-elements-hidden={true} />
        ) : undefined
      }
    >
      {children}
    </SeedChipTabs.Trigger>
  );
});
ChipTabsTrigger.displayName = "ChipTabsTrigger";

export interface ChipTabsCarouselProps extends SeedChipTabs.CarouselProps {}

export const ChipTabsCarousel = forwardRef<unknown, ChipTabsCarouselProps>((props, ref) => {
  const { children, ...otherProps } = props;

  return (
    <SeedChipTabs.Carousel ref={ref} {...otherProps}>
      <SeedChipTabs.CarouselCamera>{children}</SeedChipTabs.CarouselCamera>
    </SeedChipTabs.Carousel>
  );
});
ChipTabsCarousel.displayName = "ChipTabsCarousel";

export interface ChipTabsContentProps extends SeedChipTabs.ContentProps {}

export const ChipTabsContent = SeedChipTabs.Content;
