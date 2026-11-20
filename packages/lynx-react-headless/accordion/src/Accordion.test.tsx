import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import * as React from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";
import { useCollapsibleTrigger } from "@seed-design/lynx-react-collapsible";
import { Accordion } from "./index.js";

function root() {
  const node = elementTree.root;
  if (!node) throw new Error("Expected Lynx render root.");
  return node;
}

function node(selector: string): HTMLElement {
  const result = root().querySelector<HTMLElement>(selector);
  if (!result) throw new Error(`Missing ${selector}`);
  return result;
}

function TestAccordion({
  firstDisabled = false,
  secondDisabled = false,
  ...rootProps
}: React.ComponentProps<typeof Accordion.Root> & {
  firstDisabled?: boolean;
  secondDisabled?: boolean;
}) {
  return (
    <Accordion.Root {...rootProps}>
      <Accordion.Item value="first" disabled={firstDisabled}>
        <Accordion.Header>
          <Accordion.Trigger className="first-trigger">First</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="first-content">
          <text>First content</text>
        </Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="second" disabled={secondDisabled}>
        <Accordion.Header>
          <Accordion.Trigger className="second-trigger">Second</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="second-content">
          <text>Second content</text>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

function tap(selector: string) {
  fireEvent.tap(node(selector));
}

function touch(selector: string, name: string) {
  fireEvent(node(selector), new Event(`bindEvent:${name}`));
}

function PressedProbe() {
  const { pressed, triggerProps } = useCollapsibleTrigger();
  return <view className="pressed-probe" {...triggerProps} data-pressed={String(pressed)} />;
}

describe("Accordion headless components", () => {
  it("closes the previous item in single mode", () => {
    render(<TestAccordion defaultValues={["first"]} />);
    tap(".second-trigger");
    expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "접힘");
    expect(node(".second-trigger")).toHaveAttribute("accessibility-value", "펼쳐짐");
    expect(node(".first-content")).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(node(".second-content")).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("keeps both items open in multiple mode", () => {
    render(<TestAccordion multiple defaultValues={["first"]} />);
    tap(".second-trigger");
    expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "펼쳐짐");
    expect(node(".second-trigger")).toHaveAttribute("accessibility-value", "펼쳐짐");
  });

  it("reports controlled changes without changing rendered values", () => {
    const onValuesChange = vi.fn();
    render(<TestAccordion values={[]} onValuesChange={onValuesChange} />);
    tap(".first-trigger");
    expect(onValuesChange).toHaveBeenCalledWith(["first"]);
    expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "접힘");
  });

  it("renders transformed controlled values supplied by its parent", () => {
    function Controlled() {
      const [values, setValues] = React.useState<string[]>([]);
      return <TestAccordion values={values} onValuesChange={() => setValues(["second"])} />;
    }
    render(<Controlled />);
    tap(".first-trigger");
    expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "접힘");
    expect(node(".second-trigger")).toHaveAttribute("accessibility-value", "펼쳐짐");
  });

  it.each(["root", "item"] as const)(
    "blocks tap and pressed feedback when the %s is disabled",
    (scope) => {
      const onValuesChange = vi.fn();
      render(
        <Accordion.Root onValuesChange={onValuesChange} disabled={scope === "root"}>
          <Accordion.Item value="first" disabled={scope === "item"}>
            <Accordion.Trigger className="first-trigger" />
            <Accordion.Content className="first-content">Content</Accordion.Content>
            <PressedProbe />
          </Accordion.Item>
        </Accordion.Root>,
      );
      touch(".pressed-probe", "touchstart");
      expect(node(".pressed-probe")).toHaveAttribute("data-pressed", "false");
      tap(".first-trigger");
      expect(onValuesChange).not.toHaveBeenCalled();
      expect(node(".first-trigger")).toHaveAttribute("accessibility-traits", "disabled");
      expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "접힘");
      expect(node(".first-content")).toHaveAttribute("accessibility-elements-hidden", "true");
    },
  );
});
