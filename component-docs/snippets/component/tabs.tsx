"use client";

import clsx from "clsx";
import * as React from "react";
import {
  useTabs,
  useSwipeable,
  type UseTabsProps,
  type TriggerProps,
  type ContentProps,
  useLazyContents,
  type UseLazyContentsProps,
} from "@seed-design/react-tabs";
import { tabs } from "@seed-design/recipe/tabs";
import { tab } from "@seed-design/recipe/tab";

import "@seed-design/stylesheet/tabs.css";
import "@seed-design/stylesheet/tab.css";

type Assign<T, U> = Omit<T, keyof U> & U;

interface TabsContextValue {
  api: ReturnType<typeof useTabs> & ReturnType<typeof useSwipeable>;
  classNames: ReturnType<typeof tabs>;
  shouldRender: (value: string) => boolean;

  /**
   * @default false
   */
  isSwipeable: boolean;

  layout: "fill" | "hug";
  size: "small" | "medium";
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs cannot be rendered outside the Tabs");
  }
  return context;
};

export interface TabsProps
  extends Assign<React.HTMLAttributes<HTMLDivElement>, UseTabsProps>,
    Omit<UseLazyContentsProps, "currentValue"> {
  /**
   * @default "hug"
   */
  layout?: "fill" | "hug";

  /**
   * @default "small"
   */
  size?: "small" | "medium";
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const {
    className,
    lazyMode,
    isLazy,
    isSwipeable = false,
    layout = "hug",
    size = "small",
  } = props;
  const useTabsProps = useTabs(props);
  const useSwipeableProps = useSwipeable({
    isSwipeable,
    onSwipeLeftToRight: useTabsProps.movePrev,
    onSwipeRightToLeft: useTabsProps.moveNext,
  });
  const classNames = tabs({
    layout,
  });
  const { rootProps, value, restProps } = useTabsProps;
  const { shouldRender } = useLazyContents({ currentValue: value, lazyMode, isLazy });
  const api = {
    ...useTabsProps,
    ...useSwipeableProps,
  };

  return (
    <div ref={ref} {...rootProps} {...restProps} className={clsx(classNames.root, className)}>
      <TabsContext.Provider
        value={{
          api,
          size,
          classNames,
          shouldRender,
          isSwipeable,
          layout,
        }}
      >
        {props.children}
      </TabsContext.Provider>
    </div>
  );
});
Tabs.displayName = "Tabs";

export const TabTriggerList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...otherProps }, ref) => {
  const { api, classNames } = useTabsContext();
  const { tabTriggerListProps, triggerSize } = api;
  const { left } = triggerSize;
  const { triggerList } = classNames;

  const containerRef = React.useRef<HTMLDivElement>(null);
  React.useImperativeHandle(ref, () => containerRef.current as HTMLDivElement);

  React.useEffect(() => {
    if (containerRef.current) {
      containerRef.current?.scrollTo({
        // NOTE: 27px is half of tab's min-width
        left: left - 27,
        behavior: "smooth",
      });
    }
  }, [left]);

  return (
    <div
      ref={containerRef}
      {...tabTriggerListProps}
      className={clsx(triggerList, className)}
      {...otherProps}
    >
      {children}
      <TabIndicator />
    </div>
  );
});
TabTriggerList.displayName = "TabTriggerList";

export interface TabTriggerProps
  extends Assign<React.HTMLAttributes<HTMLButtonElement>, TriggerProps> {
  /**
   * @default false
   */
  alert?: boolean;
}

export const TabTrigger = React.forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ className, children, value, isDisabled, alert = false, ...otherProps }, ref) => {
    const { api, layout, size } = useTabsContext();
    const { getTabTriggerProps } = api;
    const { label, notification, root } = tab({
      size,
      layout,
    });
    const { rootProps, notificationProps, labelProps } = getTabTriggerProps({ value, isDisabled });

    return (
      <button ref={ref} {...rootProps} className={clsx(root, className)} {...otherProps}>
        <span className={label} {...labelProps}>
          {children}
          {alert && <div className={notification} {...notificationProps} />}
        </span>
      </button>
    );
  },
);
TabTrigger.displayName = "TabTrigger";

export const TabContentList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...otherProps }, ref) => {
  const { api, classNames, isSwipeable } = useTabsContext();
  const {
    tabContentListProps,
    tabContentCameraProps,
    getDragProps,
    currentTabEnabledIndex,
    swipeMoveX,
    swipeStatus,
    tabEnabledCount,
  } = api;
  const { contentList, contentCamera } = classNames;
  const dragProps = getDragProps();

  const getCameraTranslateX = () => {
    const MODIFIER = 5;

    const currentContentOffsetX = currentTabEnabledIndex * 100;

    if (swipeMoveX > 0 && currentTabEnabledIndex === 0) {
      return `calc(-${currentContentOffsetX}% + ${swipeMoveX / MODIFIER}px)`;
    }

    if (swipeMoveX < 0 && currentTabEnabledIndex === tabEnabledCount - 1) {
      return `calc(-${currentContentOffsetX}% + ${swipeMoveX / MODIFIER}px)`;
    }

    return `calc(-${currentContentOffsetX}% + ${swipeMoveX}px)`;
  };

  return (
    <div
      ref={ref}
      {...tabContentListProps}
      className={clsx(contentList, className)}
      {...otherProps}
      style={{
        userSelect: "none",
        touchAction: "pan-y",
        ...otherProps.style,
      }}
    >
      <div
        {...tabContentCameraProps}
        {...dragProps}
        className={clsx(contentCamera)}
        style={{
          willChange: "transform",
          transition:
            isSwipeable && swipeStatus === "idle"
              ? "transform 0.2s cubic-bezier(0.15, 0.3, 0.25, 1)"
              : "none",
          transform: `translateX(${getCameraTranslateX()})`,
        }}
      >
        {children}
      </div>
    </div>
  );
});
TabContentList.displayName = "TabContentList";

export const TabContent = React.forwardRef<
  HTMLDivElement,
  Assign<React.HTMLAttributes<HTMLDivElement>, ContentProps>
>(({ className, children, value, ...otherProps }, ref) => {
  const { api, classNames, shouldRender } = useTabsContext();
  const { getTabContentProps } = api;
  const { content } = classNames;
  const tabContentProps = getTabContentProps({ value });
  const isRender = shouldRender(value);

  return (
    <div ref={ref} {...tabContentProps} className={clsx(content, className)} {...otherProps}>
      {isRender && children}
    </div>
  );
});
TabContent.displayName = "TabContent";

const TabIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...otherProps }, ref) => {
    const { api, classNames, isSwipeable, layout } = useTabsContext();
    const { tabIndicatorProps, triggerSize, currentTabIndex, swipeMoveX, tabCount, swipeStatus } =
      api;
    const { indicator } = classNames;
    const { left: triggerLeft, width: triggerWidth } = triggerSize;

    const getLeft = () => {
      const MODIFIER = layout === "hug" ? 10 : 5;
      const GUTTER = layout === "fill" ? 16 : 0;

      // 양끝 탭에서 스와이프로 인한 이동은 MODIFIER를 5배로 늘려서 완전 조금 이동하도록 함
      if (
        (swipeMoveX > 0 && currentTabIndex === 0) ||
        (swipeMoveX < 0 && currentTabIndex === tabCount - 1)
      ) {
        return `calc(${GUTTER}px + ${triggerLeft}px - ${swipeMoveX / (MODIFIER * 5)}px)`;
      }

      return `calc(${GUTTER}px + ${triggerLeft}px - ${swipeMoveX / MODIFIER}px)`;
    };

    const getWidth = () => {
      const GUTTER = 16;

      if (layout === "hug") {
        return triggerWidth;
      }

      return triggerWidth - GUTTER * 2;
    };

    const leftTransition =
      isSwipeable && swipeStatus === "idle" ? "left 0.2s cubic-bezier(0.15, 0.3, 0.25, 1)" : "";
    const widthTransition = "width 0.2s cubic-bezier(0.15, 0.3, 0.25, 1)";
    const transitions = [leftTransition, widthTransition].filter(Boolean).join(", ");

    return (
      <div
        ref={ref}
        {...tabIndicatorProps}
        className={clsx(indicator, className)}
        {...otherProps}
        style={{
          ...otherProps.style,
          position: "absolute",
          width: getWidth(),
          left: getLeft(),
          willChange: "left, width",
          transition: transitions,
        }}
      />
    );
  },
);
TabIndicator.displayName = "TabIndicator";
