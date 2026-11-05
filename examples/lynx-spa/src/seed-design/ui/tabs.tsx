import {
  Tabs as SeedTabs,
  type TabsCarouselProps as SeedTabsCarouselProps,
  type TabsContentProps as SeedTabsContentProps,
  type TabsListProps as SeedTabsListProps,
  type TabsRootProps as SeedTabsRootProps,
  type TabsTriggerProps as SeedTabsTriggerProps,
} from "@seed-design/lynx-react";
import { forwardRef } from "@lynx-js/react";

export interface TabsRootProps extends SeedTabsRootProps {}

/**
 * @see https://seed-design.io/lynx/components/tabs
 */
export const TabsRoot = forwardRef<unknown, TabsRootProps>((props, ref) => {
  return <SeedTabs.Root ref={ref} {...props} />;
});
TabsRoot.displayName = "TabsRoot";

export interface TabsListProps extends SeedTabsListProps {}

export const TabsList = forwardRef<unknown, TabsListProps>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <SeedTabs.List ref={ref} {...otherProps}>
      {children}
      <SeedTabs.Indicator />
    </SeedTabs.List>
  );
});
TabsList.displayName = "TabsList";

export interface TabsTriggerProps extends SeedTabsTriggerProps {}

export const TabsTrigger = SeedTabs.Trigger;

export interface TabsCarouselProps extends SeedTabsCarouselProps {}

export const TabsCarousel = forwardRef<unknown, TabsCarouselProps>((props, ref) => {
  const { children, ...otherProps } = props;
  return (
    <SeedTabs.Carousel ref={ref} {...otherProps}>
      <SeedTabs.CarouselCamera>{children}</SeedTabs.CarouselCamera>
    </SeedTabs.Carousel>
  );
});
TabsCarousel.displayName = "TabsCarousel";

export interface TabsContentProps extends SeedTabsContentProps {}

export const TabsContent = SeedTabs.Content;
