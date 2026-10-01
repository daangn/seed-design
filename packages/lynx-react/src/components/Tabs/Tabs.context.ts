import * as React from "@lynx-js/react";

type TabsStyleState = {
  selected?: boolean;
  pressed?: boolean;
  disabled?: boolean;
  inCarousel?: boolean;
  transitionEnabled?: boolean;
};

interface TabsStyleContext {
  classNames: ReturnType<TabsStyleContext["getClassNames"]>;
  getClassNames: (state?: TabsStyleState) => {
    root: string;
    list: string;
    listContent: string;
    carousel: string;
    carouselCamera: string;
    content: string;
    trigger: string;
    triggerLabel: string;
  };
  getIndicatorClassName?: (state?: TabsStyleState) => string;
  inlineNotification?: boolean;
}

const TabsStyleContext = React.createContext<TabsStyleContext | null>(null);
export const TabsStyleProvider = TabsStyleContext.Provider;
export function useTabsStyleContext() {
  const context = React.useContext(TabsStyleContext);
  if (!context) throw new Error("Tabs must be rendered inside a styled TabsRoot");
  return context;
}
