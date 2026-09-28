import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import * as React from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";
import { Accordion, useAccordionTrigger } from "./index.js";

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
  const { pressed, triggerProps } = useAccordionTrigger();
  return <view className="pressed-probe" {...triggerProps} data-pressed={String(pressed)} />;
}

describe("Accordion headless components", () => {
  it("opens and closes uncontrolled content without a recipe", () => {
    render(<TestAccordion />);
    expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "접힘");
    expect(node(".first-content")).toHaveStyle({ height: "0px", overflow: "hidden" });
    expect(node(".first-content")).toHaveAttribute("accessibility-elements-hidden", "true");

    tap(".first-trigger");
    expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "펼쳐짐");
    expect(node(".first-content")).toHaveAttribute("accessibility-elements-hidden", "false");

    tap(".first-trigger");
    expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "접힘");
    expect(node(".first-content")).toHaveStyle({ height: "0px" });
  });

  it("closes the previous item in single mode", () => {
    render(<TestAccordion defaultValues={["first"]} />);
    tap(".second-trigger");
    expect(node(".first-trigger")).toHaveAttribute("accessibility-value", "접힘");
    expect(node(".second-trigger")).toHaveAttribute("accessibility-value", "펼쳐짐");
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

  it.each([
    "root",
    "item",
  ] as const)("blocks tap and pressed feedback when the %s is disabled", (scope) => {
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
  });

  it("toggles before invoking the user's bindtap", () => {
    const order: string[] = [];
    render(
      <Accordion.Root onValuesChange={() => order.push("toggle")}>
        <Accordion.Item value="first">
          <Accordion.Trigger className="first-trigger" bindtap={() => order.push("user")} />
        </Accordion.Item>
      </Accordion.Root>,
    );
    tap(".first-trigger");
    expect(order).toEqual(["toggle", "user"]);
  });

  it("forwards native refs and merges user touch handlers", () => {
    let triggerRef: unknown;
    let contentRef: unknown;
    const touchStart = vi.fn();
    const touchEnd = vi.fn();
    const touchCancel = vi.fn();
    render(
      <Accordion.Root>
        <Accordion.Item value="first">
          <Accordion.Trigger
            className="first-trigger"
            ref={(value) => {
              triggerRef = value;
            }}
            bindtouchstart={touchStart}
            bindtouchend={touchEnd}
            bindtouchcancel={touchCancel}
          />
          <Accordion.Content
            className="first-content"
            ref={(value) => {
              contentRef = value;
            }}
          />
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(triggerRef).toBeTruthy();
    expect(contentRef).toBeTruthy();
    touch(".first-trigger", "touchstart");
    touch(".first-trigger", "touchend");
    touch(".first-trigger", "touchcancel");
    expect(touchStart).toHaveBeenCalledTimes(1);
    expect(touchEnd).toHaveBeenCalledTimes(1);
    expect(touchCancel).toHaveBeenCalledTimes(1);
  });

  it("measures natural inner height, clips collapsed content, and preserves the measurement", () => {
    render(<TestAccordion defaultValues={["first"]} />);
    const inner = node(".first-content").firstElementChild as HTMLElement;
    expect(inner).toHaveStyle({ flexShrink: "0" });
    expect(node(".first-content")).toHaveStyle({ height: "0px", overflow: "hidden" });
    act(() => fireEvent.layoutchange(inner, { height: 84 }));
    expect(node(".first-content")).toHaveStyle({ height: "84px" });
    tap(".first-trigger");
    expect(node(".first-content")).toHaveStyle({ height: "0px" });
    expect(node(".first-content")).toHaveAttribute("accessibility-elements-hidden", "true");
    tap(".first-trigger");
    expect(node(".first-content")).toHaveStyle({ height: "84px" });
  });
  it("preserves a native string style while enforcing collapsed clipping", () => {
    render(
      <Accordion.Root>
        <Accordion.Item value="first">
          <Accordion.Content className="first-content" style="opacity:0.5;overflow:visible">
            Content
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>,
    );
    expect(node(".first-content")).toHaveStyle({
      opacity: "0.5",
      height: "0px",
      overflow: "hidden",
    });
  });
});
