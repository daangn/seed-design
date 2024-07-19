import clsx from "clsx";
import * as React from "react";
import {
  useTabs,
  type UseTabsProps,
  type TriggerProps,
  type ContentProps,
  useLazyContents,
  type UseLazyContentsProps,
} from "@seed-design/react-tabs";
import { tabs } from "@seed-design/recipe/tabs";

import type { Assign } from "../util/types";

import "@seed-design/stylesheet/tabs.css";

interface TabsContextValue {
  api: ReturnType<typeof useTabs>;
  classNames: ReturnType<typeof tabs>;
  shouldRender?: (value: string) => boolean;
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
    Omit<UseLazyContentsProps, "currentValue"> {}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const { className, lazyMode, isLazy } = props;
  const api = useTabs(props);
  const classNames = tabs();
  const { rootProps, value, restProps } = api;
  const { shouldRender } = useLazyContents({ currentValue: value, lazyMode, isLazy });

  return (
    <div ref={ref} {...rootProps} {...restProps} className={clsx(classNames.root, className)}>
      <TabsContext.Provider
        value={{
          api,
          classNames,
          shouldRender,
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
  const { tabTriggerListProps } = api;
  const { triggerList } = classNames;
  return (
    <div
      ref={ref}
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

export const TabTrigger = React.forwardRef<
  HTMLButtonElement,
  Assign<React.HTMLAttributes<HTMLButtonElement>, TriggerProps>
>(({ className, children, value, isDisabled, ...otherProps }, ref) => {
  const { api, classNames } = useTabsContext();
  const { getTabTriggerProps } = api;
  const { trigger } = classNames;
  const tabTriggerProps = getTabTriggerProps({ value, isDisabled });

  return (
    <button ref={ref} {...tabTriggerProps} className={clsx(trigger, className)} {...otherProps}>
      {children}
    </button>
  );
});
TabTrigger.displayName = "TabTrigger";

export const TabContentList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...otherProps }, ref) => {
  const { api, classNames } = useTabsContext();
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
        ...otherProps.style,

        touchAction: "pan-y",
        userSelect: "none",
      }}
    >
      <div
        {...tabContentCameraProps}
        {...dragProps}
        className={clsx(contentCamera)}
        style={{
          willChange: "transform",
          transition:
            swipeStatus === "idle" ? "transform 0.2s cubic-bezier(0.15, 0.3, 0.25, 1)" : "none",
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
  const { api, classNames } = useTabsContext();
  const { getTabContentProps } = api;
  const { content } = classNames;
  const tabContentProps = getTabContentProps({ value });

  return (
    <div ref={ref} {...tabContentProps} className={clsx(content, className)} {...otherProps}>
      {children}
    </div>
  );
});
TabContent.displayName = "TabContent";

const TabIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...otherProps }, ref) => {
    const { api, classNames } = useTabsContext();
    const { tabIndicatorProps, currentTabIndex, swipeMoveX, tabCount, swipeStatus } = api;
    const { indicator } = classNames;

    const getIndicatorLeft = () => {
      const MODIFIER = 5;

      const currentIndicatorOffsetX = (currentTabIndex * 100) / tabCount;

      if (swipeMoveX > 0 && currentTabIndex === 0) {
        return `calc(${currentIndicatorOffsetX}% - ${swipeMoveX / MODIFIER}px)`;
      }

      if (swipeMoveX < 0 && currentTabIndex === tabCount - 1) {
        return `calc(${currentIndicatorOffsetX}% - ${swipeMoveX / MODIFIER}px)`;
      }

      return `calc(${currentIndicatorOffsetX}% - ${swipeMoveX / MODIFIER}px)`;
    };

    return (
      <div
        ref={ref}
        {...tabIndicatorProps}
        className={clsx(indicator, className)}
        {...otherProps}
        style={{
          ...otherProps.style,

          width: `${100 / tabCount}%`,

          position: "absolute",
          left: getIndicatorLeft(),

          transitionProperty: "left, right, top, bottom, width, height",
          willChange: "left, right, top, bottom, width, height",
          transition:
            swipeStatus === "idle" ? "left 0.2s cubic-bezier(0.15, 0.3, 0.25, 1)" : "none",
        }}
      />
    );
  },
);
TabIndicator.displayName = "TabIndicator";
