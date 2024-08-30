import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import { useTabs, type ContentProps, type TriggerProps, type UseTabsProps } from "./index";

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

function Tabs(props: React.PropsWithChildren<UseTabsProps>) {
  const api = useTabs(props);
  const { rootProps } = api;

  return (
    <div {...rootProps}>
      <TabsContext.Provider value={{ api }}>{props.children}</TabsContext.Provider>
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
  const { tabContentListProps, tabContentCameraProps } = api;
  return (
    <div {...tabContentListProps}>
      <div {...tabContentCameraProps}>{props.children}</div>
    </div>
  );
}

function TabContent(props: React.PropsWithChildren<ContentProps>) {
  const { api } = useTabsContext();
  const { getTabContentProps } = api;
  const tabContentProps = getTabContentProps(props);

  return <div {...tabContentProps}>{props.children}</div>;
}

interface TabItem extends TriggerProps {
  value: string;
  label: string;
  content: string;
}

function UncontrolledTabs({
  items,
  tabsProps,
}: { items: Record<string, TabItem>; tabsProps: UseTabsProps }) {
  return (
    <Tabs {...tabsProps}>
      <TabTriggerList>
        {Object.values(items).map(({ value, label, ...restProps }) => (
          <TabTrigger key={value} value={value} {...restProps}>
            {label}
          </TabTrigger>
        ))}
      </TabTriggerList>
      <TabContentList>
        {Object.values(items).map(({ value, content }) => (
          <TabContent key={content} value={value}>
            {content}
          </TabContent>
        ))}
      </TabContentList>
    </Tabs>
  );
}

// ------------------------------------------------------------------- //
// ------------------------------ Tests ------------------------------ //
// ------------------------------------------------------------------- //

afterEach(cleanup);

describe("useTabs", () => {
  const tabItems: Record<string, TabItem> = {
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

  it("should render the tabs", () => {
    const { queryByText } = setUp(
      <UncontrolledTabs
        items={tabItems}
        tabsProps={{
          defaultValue: tabItems.tab1.value,
        }}
      />,
    );

    expect(queryByText(tabItems.tab1.label)).toBeInTheDocument();
    expect(queryByText(tabItems.tab2.label)).toBeInTheDocument();
    expect(queryByText(tabItems.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabItems.tab2.content)).toBeInTheDocument();
  });

  describe("disabled tab test", () => {
    const tabItemsWithDisabled: Record<string, TabItem> = {
      tab1: {
        value: "Tab 1",
        label: "Label 1",
        content: "Content 1",
      },
      tab2: {
        value: "Tab 2",
        label: "Label 2",
        content: "Content 2",
        isDisabled: true,
      },
      tab3: {
        value: "Tab 3",
        label: "Label 3",
        content: "Content 3",
      },
    };

    it("should not trigger the disabled tab", async () => {
      const { queryByText, user } = setUp(
        <UncontrolledTabs
          items={tabItemsWithDisabled}
          tabsProps={{
            defaultValue: tabItems.tab1.value,
          }}
        />,
      );

      const disabledTrigger = queryByText(tabItemsWithDisabled.tab2.label);

      await user.click(disabledTrigger);

      expect(disabledTrigger).toHaveAttribute("aria-disabled");
      expect(disabledTrigger).not.toHaveAttribute("aria-selected");
    });
  });
});
