export {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsCarouselCamera,
  TabsCarousel,
  TabsTrigger,
  type TabsContentProps,
  type TabsIndicatorProps,
  type TabsListProps,
  type TabsRootProps,
  type TabsCarouselCameraProps,
  type TabsCarouselProps,
  type TabsTriggerProps,
} from "./Tabs";

export * as Tabs from "./Tabs.namespace";

export { useTabsContext, type UseTabsContext } from "./useTabsContext";
export {
  useTabsCarouselContext,
  type UseTabsCarouselContext,
} from "./useTabsCarouselContext";
export { useTabsTriggerContext, type UseTabsTriggerContext } from "./useTabsTriggerContext";

export { tabsCarouselPreventDrag } from "./dom";
