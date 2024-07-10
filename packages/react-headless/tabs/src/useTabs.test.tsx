import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import { useTabs, type UseTabsProps, type ContentProps, type TriggerProps } from "./index";

afterEach(cleanup);

function setUp(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const TabsContext = React.createContext<ReturnType<typeof useTabs> | null>(null);

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
      <TabsContext.Provider value={api}>{props.children}</TabsContext.Provider>
    </div>
  );
}

function TabTriggerList(props: React.PropsWithChildren) {
  const { tabTriggerListProps } = useTabsContext();
  return <div {...tabTriggerListProps}>{props.children}</div>;
}

function TabTrigger(props: React.PropsWithChildren<TriggerProps>) {
  const { getTabTriggerProps } = useTabsContext();
  const tabTriggerProps = getTabTriggerProps(props);

  return <button {...tabTriggerProps}>{props.children}</button>;
}

function TabContentList(props: React.PropsWithChildren) {
  const { tabContentListProps } = useTabsContext();
  return <div {...tabContentListProps}>{props.children}</div>;
}

function TabContent(props: React.PropsWithChildren<ContentProps>) {
  const { getTabContentProps } = useTabsContext();
  const { shouldRender, tabContentProps } = getTabContentProps(props);

  return <div {...tabContentProps}>{shouldRender && props.children}</div>;
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

function UncontrolledTabs(props: UseTabsProps) {
  return (
    <Tabs {...props}>
      <TabTriggerList>
        {Object.values(tabs).map(({ value, label }) => (
          <TabTrigger key={value} value={value}>
            {label}
          </TabTrigger>
        ))}
      </TabTriggerList>
      <TabContentList>
        {Object.values(tabs).map(({ value, content }) => (
          <TabContent key={content} value={value}>
            {content}
          </TabContent>
        ))}
      </TabContentList>
    </Tabs>
  );
}

function ControlledTabs(
  props: React.PropsWithChildren<Omit<UseTabsProps, "value" | "onValueChange">>,
) {
  const { defaultValue } = props;
  const [value, setValue] = React.useState(defaultValue);
  const mockSetValue = vi.fn((value) => setValue(value));

  return (
    <Tabs {...props} value={value} onValueChange={mockSetValue}>
      {props.children}
    </Tabs>
  );
}

describe("useTabs", () => {
  it("should render the tabs", () => {
    const { queryByText } = setUp(<UncontrolledTabs defaultValue={tabs.tab1.value} />);

    expect(queryByText(tabs.tab1.label)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.label)).toBeInTheDocument();
    expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
    expect(queryByText(tabs.tab2.content)).toBeInTheDocument();
  });

  describe("lazy test", () => {
    it("should render all tabs when isLazy=false, lazyMode='keepMounted'", async () => {
      const { queryByText, user } = setUp(
        <UncontrolledTabs isLazy={false} lazyMode="keepMounted" />,
      );

      await user.click(queryByText(tabs.tab1.label));

      expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
      expect(queryByText(tabs.tab2.content)).toBeInTheDocument();
    });

    it("should render all tabs when isLazy=false, lazyMode='unmount'", async () => {
      const { queryByText, user } = setUp(<UncontrolledTabs isLazy={false} lazyMode="unmount" />);

      await user.click(queryByText(tabs.tab1.label));

      expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
      expect(queryByText(tabs.tab2.content)).toBeInTheDocument();
    });

    it("should only render first tab when isLazy=true, lazyMode='keepMounted'", async () => {
      const { queryByText, user } = setUp(
        <UncontrolledTabs isLazy={true} lazyMode="keepMounted" />,
      );

      await user.click(queryByText(tabs.tab1.label));

      expect(queryByText(tabs.tab1.content)).toBeInTheDocument();
      expect(queryByText(tabs.tab2.content)).not.toBeInTheDocument();
    });

    it("should render all tabs after all tabs was selected when isLazy=true, lazyMode='keepMounted'", async () => {
      const { queryByText, user } = setUp(<UncontrolledTabs isLazy lazyMode="keepMounted" />);

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
      const { queryByText, user } = setUp(<UncontrolledTabs isLazy lazyMode="unmount" />);

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

  // describe("loop test", () => {});

  // describe("controlled test", () => {});

  // describe("swipe test", () => {
  //   it("should render the tabs", () => {
  //     const { getByText, getByRole, user } = setUp(
  //       <ControlledTabs defaultValue="tab1">
  //         <TabTriggerList>
  //           <TabTrigger value="tab1">Tab 1</TabTrigger>
  //           <TabTrigger value="tab2">Tab 2</TabTrigger>
  //         </TabTriggerList>
  //         <TabContentList>
  //           <TabContent value="tab1">Content 1</TabContent>
  //           <TabContent value="tab2">Content 2</TabContent>
  //         </TabContentList>
  //       </ControlledTabs>,
  //     );
  //     const tab1 = getByText("Tab 1");
  //     const tab2 = getByText("Tab 2");
  //     const content1 = getByText("Content 1");
  //     const content2 = getByText("Content 2");
  //     user.pointer([
  //       // touch the screen at element1
  //       { keys: "[TouchA>]", target: content1 },
  //       // move the touch pointer to element2
  //       { pointerName: "TouchA", target: content2 },
  //       // release the touch pointer at the last position (element2)
  //       { keys: "[/TouchA]" },
  //     ]);
  //     expect(tab2).toHaveAttribute("data-selected");
  //     expect(tab1).not.toHaveAttribute("data-selected");
  //   });
  // });
});
