import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import {
  useLazyContents,
  useTabs,
  type ContentProps,
  type TriggerProps,
  type UseLazyContentsProps,
  type UseTabsProps,
} from "./index";

afterEach(cleanup);

/**
 * @see https://github.com/ZeeCoder/use-resize-observer/issues/40#issuecomment-644536259
 * useSize에서 사용하는 ResizeObserver를 mock으로 대체합니다.
 */
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const TabsContext = React.createContext<{
  api: ReturnType<typeof useTabs>;
  shouldRender?: (value: string) => boolean;
} | null>(null);

const useTabsContext = () => {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs cannot be rendered outside the Tabs");
  }
  return context;
};

function TabsWithLazy(
  props: React.PropsWithChildren<UseTabsProps & Omit<UseLazyContentsProps, "currentValue">>,
) {
  const api = useTabs(props);
  const { rootProps, value } = api;
  const { shouldRender } = useLazyContents({
    currentValue: value,
    lazyMode: props.lazyMode,
    isLazy: props.isLazy,
  });

  return (
    <div {...rootProps}>
      <TabsContext.Provider value={{ api, shouldRender }}>{props.children}</TabsContext.Provider>
    </div>
  );
}

function TabTriggerList(props: React.PropsWithChildren) {
  const { api } = useTabsContext();
  const { tabTriggerListProps } = api;
  return <div {...tabTriggerListProps}>{props.children}</div>;
}

function TabTrigger(props: React.PropsWithChildren<TriggerProps>) {
  const { api } = useTabsContext();
  const { getTabTriggerProps } = api;
  const { labelProps, notificationProps, rootProps } = getTabTriggerProps(props);

  return (
    <button {...rootProps}>
      <span {...labelProps}>{props.children}</span>
      <span {...notificationProps} />
    </button>
  );
}

function TabContentList(props: React.PropsWithChildren) {
  const { api } = useTabsContext();
  const { tabContentListProps, getDragProps, tabContentCameraProps } = api;
  const dragProps = getDragProps();
  return (
    <div {...tabContentListProps}>
      <div {...tabContentCameraProps} {...dragProps}>
        {props.children}
      </div>
    </div>
  );
}

function TabContentWithLazy(props: React.PropsWithChildren<ContentProps>) {
  const { api, shouldRender } = useTabsContext();
  const { getTabContentProps } = api;
  const tabContentProps = getTabContentProps(props);

  return <div {...tabContentProps}>{shouldRender(props.value) && props.children}</div>;
}

const tabs = {
  tab1: {
    value: "Tab 1",
    label: "Label 1",
    content: "Content 1",
  },
  tab2: {
    value: "Tab 2",
    label: "Label 2",
    content: "Content 2",
  },
  tab3: {
    value: "Tab 3",
    label: "Label 3",
    content: "Content 3",
  },
};

function LazyTabs(props: UseTabsProps & Omit<UseLazyContentsProps, "currentValue">) {
  return (
    <TabsWithLazy {...props}>
      <TabTriggerList>
        {Object.values(tabs).map(({ value, label }) => (
          <TabTrigger key={value} value={value}>
            {label}
          </TabTrigger>
        ))}
      </TabTriggerList>
      <TabContentList>
        {Object.values(tabs).map(({ value, content }) => (
          <TabContentWithLazy key={content} value={value}>
            {content}
          </TabContentWithLazy>
        ))}
      </TabContentList>
    </TabsWithLazy>
  );
}

describe("useLazyContents", () => {
  window.ResizeObserver = ResizeObserver;

  it("should render all tabs when isLazy=false, lazyMode='keepMounted'", async () => {
    const { queryByText, user } = setUp(<LazyTabs isLazy={false} lazyMode="keepMounted" />);

    await user.click(queryByText(tabs.tab1.label));

    expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).toBeInTheDocument();
  });

  it("should render all tabs when isLazy=false, lazyMode='unmount'", async () => {
    const { queryByText, user } = setUp(<LazyTabs isLazy={false} lazyMode="unmount" />);

    await user.click(queryByText(tabs.tab1.label));

    expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).toBeInTheDocument();
  });

  it("should only render first tab when isLazy=true, lazyMode='keepMounted'", async () => {
    const { queryByText, user } = setUp(<LazyTabs isLazy lazyMode="keepMounted" />);

    await user.click(queryByText(tabs.tab1.label));

    expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).not.toBeInTheDocument();
  });

  it("should render all tabs after all tabs was selected when isLazy=true, lazyMode='keepMounted'", async () => {
    const { queryByText, user } = setUp(<LazyTabs isLazy lazyMode="keepMounted" />);

    await user.click(queryByText(tabs.tab1.label));

    // only render tab1
    expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).not.toBeInTheDocument();
    expect(queryByText(tabs.tab3.content)).not.toBeInTheDocument();

    await user.click(queryByText(tabs.tab2.label));

    // render tab1 and tab2
    expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab3.content)).not.toBeInTheDocument();

    await user.click(queryByText(tabs.tab3.label));

    // render tab1, tab2 and tab3
    expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab3.content)).toBeInTheDocument();
  });

  it("should render only selected tab when isLazy=true, lazyMode='unmount'", async () => {
    const { queryByText, user } = setUp(<LazyTabs isLazy lazyMode="unmount" />);

    await user.click(queryByText(tabs.tab1.label));

    // only render tab1
    expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).not.toBeInTheDocument();
    expect(queryByText(tabs.tab3.content)).not.toBeInTheDocument();

    await user.click(queryByText(tabs.tab2.label));

    // only render tab2
    expect(queryByText(tabs.tab1.content)).not.toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab3.content)).not.toBeInTheDocument();

    await user.click(queryByText(tabs.tab3.label));

    // only render tab3
    expect(queryByText(tabs.tab1.content)).not.toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).not.toBeInTheDocument();
    expect(queryByText(tabs.tab3.content)).toBeInTheDocument();
  });
});
