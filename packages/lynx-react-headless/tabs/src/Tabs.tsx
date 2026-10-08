import * as React from "@lynx-js/react";
import type { IntrinsicElements } from "@lynx-js/types";
import { useTabs, type UseTabsProps } from "./useTabs.js";
import { TabsProvider } from "./useTabsContext.js";
import { useTabsList, type UseTabsListProps } from "./useTabsList.js";
import { useTabsTrigger, type UseTabsTriggerProps } from "./useTabsTrigger.js";
import { TabsTriggerProvider } from "./useTabsTriggerContext.js";
import { useTabsIndicator } from "./useTabsIndicator.js";
import { useTabsContent, type UseTabsContentProps } from "./useTabsContent.js";
import { useTabsCarousel, type UseTabsCarouselProps } from "./useTabsCarousel.js";
import { TabsCarouselProvider } from "./useTabsCarouselContext.js";
import { useTabsCarouselCamera, type UseTabsCarouselCameraProps } from "./useTabsCarouselCamera.js";
import { TabsCarouselCameraProvider } from "./TabsCarouselCameraContext.js";
import { mergeNativeProps } from "./Tabs.utils.js";

type ViewProps = IntrinsicElements["view"];
type ScrollViewProps = IntrinsicElements["scroll-view"];
type ViewPagerProps = IntrinsicElements["viewpager"];

export interface TabsRootProps extends UseTabsProps, Omit<ViewProps, keyof UseTabsProps> {}
export const TabsRoot = React.forwardRef<unknown, TabsRootProps>((props, ref) => {
  const { children, value, defaultValue, onValueChange, triggerGap, ...nativeProps } = props;
  const api = useTabs({ value, defaultValue, onValueChange, triggerGap });
  return (
    <TabsProvider value={api}>
      <view {...nativeProps} {...(ref ? { ref: ref as ViewProps["ref"] } : {})}>
        {children}
      </view>
    </TabsProvider>
  );
});
TabsRoot.displayName = "TabsRoot";

export interface TabsListProps
  extends UseTabsListProps,
    Omit<ScrollViewProps, keyof UseTabsListProps> {
  listContentProps?: ViewProps;
}
export const TabsList = React.forwardRef<unknown, TabsListProps>((props, ref) => {
  const { children, scrollAlign, listContentProps, ...nativeProps } = props;
  const api = useTabsList({ children, scrollAlign });
  const mergedRef = React.useMemo(
    () =>
      mergeNativeProps<ScrollViewProps>(
        api.listProps,
        ref ? { ref: ref as ScrollViewProps["ref"] } : {},
      ).ref,
    [api.listProps.ref, ref],
  );
  const { children: contentChildren, ...contentNativeProps } = listContentProps ?? {};
  return (
    <scroll-view
      {...mergeNativeProps<ScrollViewProps>({ ...api.listProps, ref: mergedRef }, nativeProps)}
    >
      <view {...mergeNativeProps<ViewProps>(api.listContentProps, contentNativeProps)}>
        {contentChildren ?? children}
      </view>
    </scroll-view>
  );
});
TabsList.displayName = "TabsList";

export interface TabsTriggerProps
  extends UseTabsTriggerProps,
    Omit<ViewProps, keyof UseTabsTriggerProps> {}
export const TabsTrigger = React.forwardRef<unknown, TabsTriggerProps>((props, ref) => {
  const {
    children,
    value,
    disabled,
    bindtap,
    "accessibility-label": accessibilityLabel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
    ...nativeProps
  } = props;
  const api = useTabsTrigger({
    children,
    value,
    disabled,
    bindtap,
    "accessibility-label": accessibilityLabel,
    "main-thread:bindtap": mainThreadBindtap,
    "main-thread:bindtouchstart": mainThreadBindtouchstart,
    "main-thread:bindtouchend": mainThreadBindtouchend,
    "main-thread:bindtouchcancel": mainThreadBindtouchcancel,
  });
  return (
    <TabsTriggerProvider value={api}>
      <view
        {...mergeNativeProps<ViewProps>(
          { flatten: false },
          {
            ...api.triggerProps,
            bindtouchstart: api.bindtouchstart,
            bindtouchend: api.bindtouchend,
            bindtouchcancel: api.bindtouchcancel,
          },
          ref ? { ref: ref as ViewProps["ref"] } : {},
          nativeProps,
        )}
      >
        {children}
      </view>
    </TabsTriggerProvider>
  );
});
TabsTrigger.displayName = "TabsTrigger";

export interface TabsIndicatorProps extends ViewProps {}
export const TabsIndicator = React.forwardRef<unknown, TabsIndicatorProps>((props, ref) => {
  const { children, style, ...nativeProps } = props;
  const api = useTabsIndicator();
  const indicatorStyle =
    typeof style === "string"
      ? `--tabs-indicator-x:${api.indicatorProps.style["--tabs-indicator-x"]};--tabs-indicator-width:${api.indicatorProps.style["--tabs-indicator-width"]};${style}`
      : { ...api.indicatorProps.style, ...style };
  return (
    <view
      {...mergeNativeProps<ViewProps>(
        { "accessibility-elements-hidden": true },
        api.indicatorProps,
        ref ? { ref: ref as ViewProps["ref"] } : {},
        nativeProps,
      )}
      style={indicatorStyle}
    >
      {children}
    </view>
  );
});
TabsIndicator.displayName = "TabsIndicator";

export interface TabsContentProps
  extends UseTabsContentProps,
    Omit<ViewProps, keyof UseTabsContentProps> {}
export const TabsContent = React.forwardRef<unknown, TabsContentProps>((props, ref) => {
  const { children, value, ...nativeProps } = props;
  const api = useTabsContent({ value });
  const content = (
    <view
      {...mergeNativeProps<ViewProps>(
        api.contentProps,
        nativeProps,
        ref ? { ref: ref as ViewProps["ref"] } : {},
      )}
    >
      {children}
    </view>
  );
  if (api.inCarousel) {
    if (api.isDisabled) return null;
    return <viewpager-item>{content}</viewpager-item>;
  }
  return content;
});
TabsContent.displayName = "TabsContent";

export interface TabsCarouselProps
  extends UseTabsCarouselProps,
    Omit<ViewProps, keyof UseTabsCarouselProps> {}
export const TabsCarousel = React.forwardRef<unknown, TabsCarouselProps>((props, ref) => {
  const {
    children,
    swipeable,
    iosBackGestureEdgeWidth,
    onSettle,
    onSwipeStart,
    onSwipeEnd,
    ...nativeProps
  } = props;
  const api = useTabsCarousel({
    swipeable,
    iosBackGestureEdgeWidth,
    onSettle,
    onSwipeStart,
    onSwipeEnd,
  });
  return (
    <TabsCarouselProvider value={api}>
      <view {...nativeProps} {...(ref ? { ref: ref as ViewProps["ref"] } : {})}>
        {children}
      </view>
    </TabsCarouselProvider>
  );
});
TabsCarousel.displayName = "TabsCarousel";

export interface TabsCarouselCameraProps
  extends UseTabsCarouselCameraProps,
    Omit<ViewPagerProps, keyof UseTabsCarouselCameraProps> {}
export const TabsCarouselCamera = React.forwardRef<unknown, TabsCarouselCameraProps>(
  (props, ref) => {
    const { children, bindchange, bindwillchange, bindoffsetchange, ...nativeProps } = props;
    const api = useTabsCarouselCamera({ bindchange, bindwillchange, bindoffsetchange });
    const mergedRef = React.useMemo(
      () =>
        mergeNativeProps<ViewPagerProps>(
          { ref: api.cameraProps.ref },
          ref ? { ref: ref as ViewPagerProps["ref"] } : {},
        ).ref,
      [api.cameraProps.ref, ref],
    );
    return (
      <viewpager
        {...mergeNativeProps<ViewPagerProps>({ ...api.cameraProps, ref: mergedRef }, nativeProps)}
      >
        <TabsCarouselCameraProvider value={true}>{children}</TabsCarouselCameraProvider>
      </viewpager>
    );
  },
);
TabsCarouselCamera.displayName = "TabsCarouselCamera";
