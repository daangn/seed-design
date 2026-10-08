import { tabs, type TabsSlotName, type TabsVariantProps } from "@seed-design/lynx-css/recipes/tabs";
import * as React from "@lynx-js/react";
import {
  Tabs as HeadlessTabs,
  TabsProvider,
  useTabs,
  useTabsContext,
  useTabsTrigger,
  useTabsIndicator,
  useTabsContent,
} from "@seed-design/lynx-react-tabs";
import clsx from "clsx";
import { useScaleFeedback } from "../../hooks/useScaleFeedback";
import type { LynxHostProps, LynxViewRef } from "../../types";
import { mergeProps } from "../../utils/merge-props";
import { Box } from "../Box";
type TabsRecipeState = Pick<
  TabsVariantProps,
  "selected" | "disabled" | "inCarousel" | "transitionEnabled"
>;
type TabsPublicVariantProps = Omit<TabsVariantProps, keyof TabsRecipeState>;
type TabsClassNames = Record<TabsSlotName, string>;

interface TabsStyleContextValue {
  classNames: TabsClassNames;
  getClassNames: (state?: TabsRecipeState) => TabsClassNames;
}

const TabsStyleContext = React.createContext<TabsStyleContextValue | null>(null);

function useTabsStyleContext() {
  const context = React.useContext(TabsStyleContext);
  if (!context) throw new Error("Tabs must be rendered inside a styled TabsRoot");
  return context;
}

/**
 * @platform Lynx
 *
 * 웹 대비 미지원 기능:
 * - `orientation`: Lynx Tabs는 수평 방향만 지원
 * - `lazyMount`, `unmountOnExit`: native viewpager가 모든 page slot을 유지해야 함
 * - 키보드 포커스와 roving tabindex
 */
export interface TabsRootProps extends TabsPublicVariantProps, LynxHostProps<"view"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const TabsRoot = React.forwardRef<unknown, TabsRootProps>((props, ref) => {
  const [variantProps, rootProps] = tabs.splitVariantProps(props);
  const getClassNames = React.useCallback(
    (state: TabsRecipeState = {}) =>
      tabs({
        ...variantProps,
        selected: state.selected,
        disabled: state.disabled,
        inCarousel: state.inCarousel,
        transitionEnabled: state.transitionEnabled,
      }),
    [variantProps],
  );
  const { children, className, style, value, defaultValue, onValueChange, ...nativeProps } =
    rootProps;
  const api = useTabs({ value, defaultValue, onValueChange });
  const classNames = getClassNames({ transitionEnabled: api.transitionsEnabled });
  const styleContext = React.useMemo(
    () => ({ classNames, getClassNames }),
    [classNames, getClassNames],
  );
  return (
    <TabsProvider value={api}>
      <TabsStyleContext.Provider value={styleContext}>
        <view
          {...mergeProps(ref ? { ref: ref as LynxViewRef } : {}, nativeProps)}
          className={clsx(classNames.root, className)}
          style={style}
        >
          {children}
        </view>
      </TabsStyleContext.Provider>
    </TabsProvider>
  );
});
TabsRoot.displayName = "TabsRoot";
export interface TabsListProps extends LynxHostProps<"scroll-view"> {
  /** 선택한 tab을 목록 안에서 정렬할 방식입니다. @defaultValue "start" */
  scrollAlign?: "nearest" | "start" | "center" | "end";
}

export const TabsList = React.forwardRef<unknown, TabsListProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { classNames } = useTabsStyleContext();
  return (
    <HeadlessTabs.List
      {...nativeProps}
      {...(ref ? { ref } : {})}
      className={clsx(classNames.list, className)}
      listContentProps={{ className: classNames.listContent }}
    >
      {children}
    </HeadlessTabs.List>
  );
});
TabsList.displayName = "TabsList";
export interface TabsTriggerProps extends Omit<LynxHostProps<"view">, "children"> {
  children: string | number;
  value: string;
  disabled?: boolean;
  notification?: React.ReactNode;
}

export const TabsTrigger = React.forwardRef<unknown, TabsTriggerProps>((props, ref) => {
  const {
    children,
    notification,
    className,
    style,
    value: triggerValue,
    disabled = false,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    "accessibility-label": accessibilityLabel,
    ...nativeProps
  } = props;

  const context = useTabsStyleContext();
  const { transitionsEnabled } = useTabsContext();
  const api = useTabsTrigger({
    value: triggerValue,
    disabled,
    bindtap,
    "main-thread:bindtap": mainThreadBindtap,
    children,
    "accessibility-label": accessibilityLabel,
  });
  const { scaleFeedbackTriggerProps, scaleFeedbackTargetProps } = useScaleFeedback({
    disabled,
    onTouchStart: api.bindtouchstart,
    onTouchEnd: api.bindtouchend,
    onTouchCancel: api.bindtouchcancel,
  });
  const triggerClasses = context.getClassNames({
    selected: api.isVisuallySelected,
    disabled: api.isDisabled,
    transitionEnabled: transitionsEnabled,
  });
  return (
    <view
      {...mergeProps(
        { flatten: false },
        api.triggerProps,
        ref ? { ref: ref as LynxViewRef } : {},
        scaleFeedbackTargetProps,
        scaleFeedbackTriggerProps,
        nativeProps,
      )}
      className={clsx(triggerClasses.trigger, className)}
      style={style}
    >
      {notification ? (
        <Box position="relative">
          <text className={triggerClasses.triggerLabel}>{children}</text>
          {notification}
        </Box>
      ) : (
        <text className={triggerClasses.triggerLabel}>{children}</text>
      )}
    </view>
  );
});
TabsTrigger.displayName = "TabsTrigger";
export interface TabsIndicatorProps extends LynxHostProps<"view"> {}

export const TabsIndicator = React.forwardRef<unknown, TabsIndicatorProps>((props, ref) => {
  const { children, className, style, ...nativeProps } = props;
  const { getClassNames } = useTabsStyleContext();
  const api = useTabsIndicator();
  return (
    <view
      {...mergeProps(
        { "accessibility-elements-hidden": true },
        api.indicatorProps,
        ref ? { ref: ref as LynxViewRef } : {},
        nativeProps,
      )}
      className={clsx(
        getClassNames({ transitionEnabled: api.transitionsEnabled }).indicator,
        className,
      )}
      style={{ ...api.indicatorProps.style, ...style }}
    >
      {children}
    </view>
  );
});
TabsIndicator.displayName = "TabsIndicator";
export interface TabsContentProps extends LynxHostProps<"view"> {
  value: string;
}

export const TabsContent = React.forwardRef<unknown, TabsContentProps>((props, ref) => {
  const { children, className, style, value: contentValue, ...nativeProps } = props;

  const context = useTabsStyleContext();
  const api = useTabsContent({ value: contentValue });
  const contentClasses = context.getClassNames({
    selected: api.isSelected,
    inCarousel: api.inCarousel,
  });
  const content = (
    <view
      {...mergeProps(api.contentProps, nativeProps, ref ? { ref: ref as LynxViewRef } : {})}
      className={clsx(contentClasses.content, className)}
      style={style}
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
/**
 * @platform Lynx
 *
 * native viewpager를 사용하므로 웹의 `loop`, `autoHeight`, `dragThreshold`,
 * `carouselPreventDrag`는 지원하지 않습니다.
 */
export interface TabsCarouselProps extends LynxHostProps<"view"> {
  swipeable?: boolean;
  /** iOS 뒤로가기 제스처를 우선하는 화면 왼쪽 가장자리 너비입니다. */
  iosBackGestureEdgeWidth?: number;
  onSettle?: () => void;
  /** 네이티브 pager가 drag를 감지했을 때 호출합니다. */
  onSwipeStart?: () => void;
  /** 시작된 스와이프가 끝나거나 취소되면 호출합니다. */
  onSwipeEnd?: () => void;
}

export const TabsCarousel = React.forwardRef<unknown, TabsCarouselProps>((props, ref) => {
  const { children, className, ...nativeProps } = props;
  const { classNames } = useTabsStyleContext();
  return (
    <HeadlessTabs.Carousel
      {...nativeProps}
      {...(ref ? { ref } : {})}
      className={clsx(classNames.carousel, className)}
    >
      {children}
    </HeadlessTabs.Carousel>
  );
});
TabsCarousel.displayName = "TabsCarousel";
export interface TabsCarouselCameraProps extends LynxHostProps<"viewpager"> {}

export const TabsCarouselCamera = React.forwardRef<unknown, TabsCarouselCameraProps>(
  (props, ref) => {
    const { children, className, ...nativeProps } = props;
    const { classNames } = useTabsStyleContext();
    return (
      <HeadlessTabs.CarouselCamera
        {...nativeProps}
        {...(ref ? { ref } : {})}
        className={clsx(classNames.carouselCamera, className)}
      >
        {children}
      </HeadlessTabs.CarouselCamera>
    );
  },
);
TabsCarouselCamera.displayName = "TabsCarouselCamera";
