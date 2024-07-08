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
  const tabContentProps = getTabContentProps(props);

  return <div {...tabContentProps}>{props.children}</div>;
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
    const { getByText } = setUp(
      <ControlledTabs defaultValue="tab1">
        <TabTriggerList>
          <TabTrigger value="tab1">Tab 1</TabTrigger>
          <TabTrigger value="tab2">Tab 2</TabTrigger>
        </TabTriggerList>
        <TabContentList>
          <TabContent value="tab1">Content 1</TabContent>
          <TabContent value="tab2">Content 2</TabContent>
        </TabContentList>
      </ControlledTabs>,
    );

    expect(getByText("Tab 1")).toBeInTheDocument();
    expect(getByText("Tab 2")).toBeInTheDocument();
    expect(getByText("Content 1")).toBeInTheDocument();
    expect(getByText("Content 2")).toBeInTheDocument();
  });
});
