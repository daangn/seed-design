import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import type { ReactElement } from "react";
import * as React from "react";
import { createPortal } from "react-dom";

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
  return (
    <div ref={api.refs.list} {...tabTriggerListProps}>
      {props.children}
    </div>
  );
}

function TabsTrigger(props: React.PropsWithChildren<TriggerProps>) {
  const { api } = useTabsContext();
  const { getTriggerProps: getTabsTriggerProps } = api;
  const triggerProps = getTabsTriggerProps(props);

  return (
    <button ref={triggerProps.refs.root} {...triggerProps.rootProps}>
      {props.children}
    </button>
  );
}

function TabsContent(props: React.PropsWithChildren<ContentProps>) {
  const { api } = useTabsContext();
  const { getContentProps: getTabContentProps } = api;
  const tabContentProps = getTabContentProps(props);

  return <div {...tabContentProps}>{props.children}</div>;
}

function PortaledTabsList(props: React.PropsWithChildren<{ target: HTMLElement }>) {
  const { api } = useTabsContext();

  return createPortal(
    <div ref={api.refs.list} style={{ paddingLeft: "0px" }} {...api.listProps}>
      {props.children}
      <div data-testid="indicator" {...api.indicatorProps} />
    </div>,
    props.target,
  );
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

  describe("keyboard navigation", () => {
    it("should move focus and selection with ArrowRight", async () => {
      const { queryByText, user } = setUp(
        <UncontrolledTabs items={tabItems} tabsProps={{ defaultValue: tabItems.tab1.value }} />,
      );

      const tab1 = queryByText(tabItems.tab1.label)!;
      const tab2 = queryByText(tabItems.tab2.label)!;

      await user.click(tab1);
      await user.keyboard("{ArrowRight}");

      expect(tab2).toHaveAttribute("data-selected");
      expect(tab2).toHaveFocus();
    });

    it("should move focus and selection with ArrowLeft", async () => {
      const { queryByText, user } = setUp(
        <UncontrolledTabs items={tabItems} tabsProps={{ defaultValue: tabItems.tab2.value }} />,
      );

      const tab1 = queryByText(tabItems.tab1.label)!;
      const tab2 = queryByText(tabItems.tab2.label)!;

      await user.click(tab2);
      await user.keyboard("{ArrowLeft}");

      expect(tab1).toHaveAttribute("data-selected");
      expect(tab1).toHaveFocus();
    });

    it("should cycle from last to first with ArrowRight", async () => {
      const { queryByText, user } = setUp(
        <UncontrolledTabs items={tabItems} tabsProps={{ defaultValue: tabItems.tab3.value }} />,
      );

      const tab1 = queryByText(tabItems.tab1.label)!;
      const tab3 = queryByText(tabItems.tab3.label)!;

      await user.click(tab3);
      await user.keyboard("{ArrowRight}");

      expect(tab1).toHaveAttribute("data-selected");
      expect(tab1).toHaveFocus();
    });

    it("should move focus with Home and End", async () => {
      const { queryByText, user } = setUp(
        <UncontrolledTabs items={tabItems} tabsProps={{ defaultValue: tabItems.tab2.value }} />,
      );

      const tab1 = queryByText(tabItems.tab1.label)!;
      const tab2 = queryByText(tabItems.tab2.label)!;
      const tab3 = queryByText(tabItems.tab3.label)!;

      await user.click(tab2);
      await user.keyboard("{End}");

      expect(tab3).toHaveAttribute("data-selected");
      expect(tab3).toHaveFocus();

      await user.keyboard("{Home}");

      expect(tab1).toHaveAttribute("data-selected");
      expect(tab1).toHaveFocus();
    });

    it("should skip disabled tabs when navigating", async () => {
      const itemsWithDisabled = {
        tab1: { value: "Tab 1", label: "Label 1", content: "Content 1" },
        tab2: { value: "Tab 2", label: "Label 2", content: "Content 2", disabled: true },
        tab3: { value: "Tab 3", label: "Label 3", content: "Content 3" },
      } as const satisfies Record<string, TabItem>;

      const { queryByText, user } = setUp(
        <UncontrolledTabs
          items={itemsWithDisabled}
          tabsProps={{ defaultValue: itemsWithDisabled.tab1.value }}
        />,
      );

      const tab1 = queryByText(itemsWithDisabled.tab1.label)!;
      const tab3 = queryByText(itemsWithDisabled.tab3.label)!;

      await user.click(tab1);
      await user.keyboard("{ArrowRight}");

      expect(tab3).toHaveAttribute("data-selected");
      expect(tab3).toHaveFocus();
    });
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

  describe("portaled list", () => {
    const offsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetWidth");
    const offsetLeft = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "offsetLeft");
    const target = document.createElement("div");

    beforeAll(() => {
      document.body.append(target);
      Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
        configurable: true,
        get: () => 64,
      });
      Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
        configurable: true,
        get(this: HTMLElement) {
          return this.textContent === tabItems.tab2.label ? 64 : 0;
        },
      });
    });

    afterAll(() => {
      target.remove();
      if (offsetWidth) Object.defineProperty(HTMLElement.prototype, "offsetWidth", offsetWidth);
      if (offsetLeft) Object.defineProperty(HTMLElement.prototype, "offsetLeft", offsetLeft);
    });

    function renderPortaledTabs() {
      return setUp(
        <Tabs defaultValue={tabItems.tab1.value}>
          <PortaledTabsList target={target}>
            {Object.values(tabItems).map(({ value, label }) => (
              <TabsTrigger key={value} value={value}>
                {label}
              </TabsTrigger>
            ))}
          </PortaledTabsList>
          {Object.values(tabItems).map(({ value, content }) => (
            <TabsContent key={content} value={value}>
              {content}
            </TabsContent>
          ))}
        </Tabs>,
      );
    }

    it("should set the indicator position on the indicator itself", async () => {
      const { getByTestId, getByRole, user } = renderPortaledTabs();
      const indicator = getByTestId("indicator");

      expect(indicator.style.getPropertyValue("--indicator-left")).toBe("0px");
      expect(indicator.style.getPropertyValue("--indicator-width")).toBe("64px");

      await user.click(getByRole("tab", { name: tabItems.tab2.label }));

      expect(indicator.style.getPropertyValue("--indicator-left")).toBe("64px");
    });

    it("should keep tab and panel relationships and keyboard navigation", async () => {
      const { getAllByRole, getByRole, user } = renderPortaledTabs();
      const firstTab = getByRole("tab", { name: tabItems.tab1.label });
      const secondTab = getByRole("tab", { name: tabItems.tab2.label });

      for (const tab of getAllByRole("tab")) {
        const panel = document.getElementById(tab.getAttribute("aria-controls") ?? "");

        expect(panel).toHaveAttribute("aria-labelledby", tab.id);
      }

      await user.click(firstTab);
      await user.keyboard("{ArrowRight}");

      expect(secondTab).toHaveFocus();
      expect(secondTab).toHaveAttribute("aria-selected", "true");
    });
  });
});
