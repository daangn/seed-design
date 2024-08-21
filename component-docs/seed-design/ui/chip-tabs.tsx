"use client";

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
import { chipTabs } from "@seed-design/recipe/chipTabs";
import { chipTab } from "@seed-design/recipe/chipTab";

import "@seed-design/stylesheet/chipTab.css";
import "@seed-design/stylesheet/chipTabs.css";

type Assign<T, U> = Omit<T, keyof U> & U;

interface ChipTabsContextValue {
  api: ReturnType<typeof useTabs>;
  classNames: ReturnType<typeof chipTabs>;
  shouldRender: (value: string) => boolean;
}

const ChipTabsContext = React.createContext<ChipTabsContextValue | null>(null);

const useChipTabsContext = () => {
  const context = React.useContext(ChipTabsContext);
  if (!context) {
    throw new Error("Tabs cannot be rendered outside the Tabs");
  }
  return context;
};

export interface ChipTabsProps
  extends Assign<
      React.HTMLAttributes<HTMLDivElement>,
      Omit<UseTabsProps, "isSwipeable" | "swipeConfig" | "layout">
    >,
    Omit<UseLazyContentsProps, "currentValue"> {}

export const ChipTabs = React.forwardRef<HTMLDivElement, ChipTabsProps>((props, ref) => {
  const { className, lazyMode, isLazy } = props;
  const api = useTabs(props);
  const classNames = chipTabs();
  const { rootProps, value, restProps } = api;
  const { shouldRender } = useLazyContents({ currentValue: value, lazyMode, isLazy });

  return (
    <div ref={ref} {...rootProps} {...restProps} className={clsx(classNames.root, className)}>
      <ChipTabsContext.Provider
        value={{
          api,
          classNames,
          shouldRender,
        }}
      >
        {props.children}
      </ChipTabsContext.Provider>
    </div>
  );
});
ChipTabs.displayName = "Tabs";

export const ChipTabTriggerList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...otherProps }, ref) => {
  const { api, classNames } = useChipTabsContext();
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
    </div>
  );
});
ChipTabTriggerList.displayName = "TabTriggerList";

export interface ChipTabTriggerProps
  extends Assign<React.HTMLAttributes<HTMLButtonElement>, Omit<TriggerProps, "isDisabled">> {}

export const ChipTabTrigger = React.forwardRef<HTMLButtonElement, ChipTabTriggerProps>(
  ({ className, children, value, ...otherProps }, ref) => {
    const { api } = useChipTabsContext();
    const { getTabTriggerProps } = api;
    const { label, root } = chipTab();
    const { rootProps, labelProps } = getTabTriggerProps({ value });

    return (
      <button ref={ref} {...rootProps} className={clsx(root, className)} {...otherProps}>
        <span className={label} {...labelProps}>
          {children}
        </span>
      </button>
    );
  },
);
ChipTabTrigger.displayName = "TabTrigger";

export const ChipTabContentList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...otherProps }, ref) => {
  const { api, classNames } = useChipTabsContext();
  const {
    tabContentListProps,
    tabContentCameraProps,
    getDragProps,
    currentTabEnabledIndex,
    swipeMoveX,
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

          transform: `translateX(${getCameraTranslateX()})`,
        }}
      >
        {children}
      </div>
    </div>
  );
});
ChipTabContentList.displayName = "TabContentList";

export const ChipTabContent = React.forwardRef<
  HTMLDivElement,
  Assign<React.HTMLAttributes<HTMLDivElement>, ContentProps>
>(({ className, children, value, ...otherProps }, ref) => {
  const { api, classNames, shouldRender } = useChipTabsContext();
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
ChipTabContent.displayName = "TabContent";
