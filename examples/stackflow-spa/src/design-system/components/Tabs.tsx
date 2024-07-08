import clsx from "clsx";
import * as React from "react";
import {
  useTabs,
  type UseTabsProps,
  type TriggerProps,
  type ContentProps,
} from "@seed-design/react-tabs";

import type { Assign } from "../util/types";

// TODO: Change
// import "@seed-design/stylesheet/tabs.css";

const TabsContext = React.createContext<ReturnType<typeof useTabs> | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs cannot be rendered outside the Tabs");
  }
  return context;
};

export interface TabsProps extends Assign<React.HTMLAttributes<HTMLDivElement>, UseTabsProps> {}

export const Tabs = React.forwardRef<HTMLInputElement, TabsProps>((props, ref) => {
  const api = useTabs(props);
  const { rootProps } = api;

  return (
    <div ref={ref} {...rootProps}>
      <TabsContext.Provider value={api}>{props.children}</TabsContext.Provider>
    </div>
  );
});
Tabs.displayName = "Tabs";

export const TabTriggerList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...otherProps }, ref) => {
  const { tabTriggerListProps } = useTabsContext();
  return (
    <div ref={ref} {...tabTriggerListProps} className={clsx(className)} {...otherProps}>
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
  const { getTabTriggerProps } = useTabsContext();
  const tabTriggerProps = getTabTriggerProps({ value });

  return (
    <button ref={ref} {...tabTriggerProps} className={clsx(className)} {...otherProps}>
      {children}
    </button>
  );
});
TabTrigger.displayName = "TabTrigger";

export const TabContentList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...otherProps }, ref) => {
  const { tabContentListProps } = useTabsContext();
  return (
    <div ref={ref} {...tabContentListProps} className={clsx(className)} {...otherProps}>
      {children}
    </div>
  );
});
TabContentList.displayName = "TabContentList";

export const TabContent = React.forwardRef<
  HTMLDivElement,
  Assign<React.HTMLAttributes<HTMLDivElement>, ContentProps>
>(({ className, children, value, ...otherProps }, ref) => {
  const { getTabContentProps } = useTabsContext();
  const tabContentProps = getTabContentProps({ value });

  return (
    <div ref={ref} {...tabContentProps} className={clsx(className)} {...otherProps}>
      {children}
    </div>
  );
});
TabContent.displayName = "TabContent";

const TabIndicator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...otherProps }, ref) => {
    const { tabIndicatorProps } = useTabsContext();
    return <div ref={ref} {...tabIndicatorProps} className={clsx(className)} {...otherProps} />;
  },
);
TabIndicator.displayName = "TabIndicator";
