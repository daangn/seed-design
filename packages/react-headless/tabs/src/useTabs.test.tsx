import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, describe, expect, it } from "bun:test";

import type { ReactElement } from "react";
import * as React from "react";

import { useTabs, type UseTabsProps } from "./useTabs";
import type { ContentProps, TriggerProps } from "./Tabs.namespace";

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

function Tabs(props: React.PropsWithChildren<UseTabsProps>) {
  const api = useTabs(props);
  const { rootProps } = api;

  return (
    <div {...rootProps}>
      <TabsContext.Provider value={{ api }}>{props.children}</TabsContext.Provider>
    </div>
  );
}

function TabsList(props: React.PropsWithChildren) {
  const { api } = useTabsContext();
  const { listProps: tabTriggerListProps } = api;
  return <div {...tabTriggerListProps}>{props.children}</div>;
}

function TabsTrigger(props: React.PropsWithChildren<TriggerProps>) {
  const { api } = useTabsContext();
  const { getTriggerProps: getTabsTriggerProps } = api;
  const { rootProps } = getTabsTriggerProps(props);

  return <button {...rootProps}>{props.children}</button>;
}

function TabsContent(props: React.PropsWithChildren<ContentProps>) {
  const { api } = useTabsContext();
  const { getContentProps: getTabContentProps } = api;
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
}: {
  items: Record<string, TabItem>;
  tabsProps: UseTabsProps;
}) {
  return (
    <Tabs {...tabsProps}>
      <TabsList>
        {Object.values(items).map(({ value, label, ...restProps }) => (
          <TabsTrigger key={value} value={value} {...restProps}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.values(items).map(({ value, content }) => (
        <TabsContent key={content} value={value}>
          {content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

// ------------------------------------------------------------------- //
// ------------------------------ Tests ------------------------------ //
// ------------------------------------------------------------------- //

describe("useTabs", () => {
  const originalResizeObserver = window.ResizeObserver;
  window.ResizeObserver = ResizeObserver;

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  const tabItems = {
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
  } as const satisfies Record<string, TabItem>;

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
    const tabItemsWithDisabled = {
      tab1: {
        value: "Tab 1",
        label: "Label 1",
        content: "Content 1",
      },
      tab2: {
        value: "Tab 2",
        label: "Label 2",
        content: "Content 2",
        disabled: true,
      },
      tab3: {
        value: "Tab 3",
        label: "Label 3",
        content: "Content 3",
      },
    } as const satisfies Record<string, TabItem>;

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

      if (!disabledTrigger) {
        throw new Error("Disabled trigger not found");
      }

      await user.click(disabledTrigger);

      expect(disabledTrigger).toHaveAttribute("aria-disabled");
      expect(disabledTrigger).not.toHaveAttribute("aria-selected");
    });
  });
});
