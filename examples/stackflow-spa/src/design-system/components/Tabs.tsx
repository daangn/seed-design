import clsx from "clsx";
import * as React from "react";
import {
  useTabs,
  type UseTabsProps,
  type TriggerProps,
  type ContentProps,
} from "@seed-design/react-tabs";
import { tabs } from "@seed-design/recipe/tabs";

import type { Assign } from "../util/types";

import "@seed-design/stylesheet/tabs.css";

const TabsContext = React.createContext<{
  api: ReturnType<typeof useTabs>;
  classNames: ReturnType<typeof tabs>;
} | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs cannot be rendered outside the Tabs");
  }
  return context;
};

export interface TabsProps extends Assign<React.HTMLAttributes<HTMLDivElement>, UseTabsProps> {}

export const Tabs = React.forwardRef<HTMLInputElement, TabsProps>((props, ref) => {
  const { className } = props;
  const api = useTabs(props);
  const classNames = tabs();
  const { rootProps } = api;

  return (
    <div ref={ref} {...rootProps} className={clsx(classNames.root, className)}>
      <TabsContext.Provider
        value={{
          api,
          classNames,
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
>(({ className, children, value, ...otherProps }, ref) => {
  const { api, classNames } = useTabsContext();
  const { getTabTriggerProps } = api;
  const { trigger } = classNames;
  const tabTriggerProps = getTabTriggerProps({ value });

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
  const { tabContentListProps, tabContentCameraProps } = api;
  const { contentList, contentCamera } = classNames;
  return (
    <div
      ref={ref}
      {...tabContentListProps}
      className={clsx(contentList, className)}
      {...otherProps}
    >
      <div {...tabContentCameraProps} className={clsx(contentCamera)}>
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
  const { shouldRender, tabContentProps } = getTabContentProps({ value });

  return (
    <div ref={ref} {...tabContentProps} className={clsx(content, className)} {...otherProps}>
      {shouldRender && children}
    </div>
  );
});
TabContent.displayName = "TabContent";

const TabIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...otherProps }, ref) => {
    const { api, classNames } = useTabsContext();
    const { tabIndicatorProps } = api;
    const { indicator } = classNames;
    return (
      <div
        ref={ref}
        {...tabIndicatorProps}
        className={clsx(indicator, className)}
        {...otherProps}
      />
    );
  },
);
TabIndicator.displayName = "TabIndicator";
