import "@testing-library/jest-dom/vitest";
import { cleanup, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { ReactElement } from "react";
import * as React from "react";

import { useTabs, type ContentProps, type TriggerProps, type UseTabsProps } from "./index";

afterEach(cleanup);

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
  const tabTriggerProps = getTabTriggerProps(props);

  return <button {...tabTriggerProps}>{props.children}</button>;
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

function TabContent(props: React.PropsWithChildren<ContentProps>) {
  const { api } = useTabsContext();
  const { getTabContentProps } = api;
  const tabContentProps = getTabContentProps(props);

  return <div {...tabContentProps}>{props.children}</div>;
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
});
