import "@testing-library/jest-dom";
import { runOnBackground, useState } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup, useRadioGroupContext, useRadioGroupItemContext } from "./index.js";

function item(value: string) {
  const node = elementTree.root?.querySelector<HTMLElement>(`.item-${value}`);
  if (!node) throw new Error(`Missing item ${value}`);
  return node;
}

function tap(value: string) {
  fireEvent(item(value), new Event("bindEvent:tap"));
}

function GroupValue() {
  const { value } = useRadioGroupContext();
  return <text className="group-value">{`value=${value}`}</text>;
}

function groupValue() {
  return elementTree.root?.querySelector(".group-value")?.textContent;
}

function ItemState() {
  const { checked, disabled, pressed } = useRadioGroupItemContext();
  return (
    <RadioGroup.ItemControl>
      <text>{`checked=${checked} disabled=${disabled} pressed=${pressed}`}</text>
    </RadioGroup.ItemControl>
  );
}

describe("RadioGroup", () => {
  it("selects one uncontrolled item after the consumer tap handler and never deselects", () => {
    const calls: string[] = [];
    render(
      <RadioGroup.Root
        className="root"
        defaultValue="apple"
        onValueChange={(value) => calls.push(`change:${value}`)}
      >
        <GroupValue />
        <RadioGroup.Item
          className="item-apple"
          value="apple"
          bindtap={() => calls.push("tap:apple")}
        />
        <RadioGroup.Item
          className="item-banana"
          value="banana"
          bindtap={() => calls.push("tap:banana")}
        />
      </RadioGroup.Root>,
    );
    const root = elementTree.root?.querySelector(".root");

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-role-description", "radiogroup");
    expect(item("apple")).toHaveAttribute("accessibility-role-description", "radio");
    expect(item("apple")).toHaveAttribute("accessibility-value", "selected");
    expect(item("banana")).toHaveAttribute("accessibility-value", "not selected");

    tap("banana");

    expect(calls).toEqual(["tap:banana", "change:banana"]);
    expect(groupValue()).toBe("value=banana");
    expect(item("apple")).toHaveAttribute("accessibility-value", "not selected");
    expect(item("banana")).toHaveAttribute("accessibility-value", "selected");

    tap("banana");

    expect(calls).toEqual(["tap:banana", "change:banana", "tap:banana"]);
    expect(groupValue()).toBe("value=banana");
  });

  it("keeps the controlled value until the parent applies its own value", () => {
    const onValueChange = vi.fn();
    function Example() {
      const [value, setValue] = useState("apple");
      return (
        <RadioGroup.Root
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            if (next === "banana") setValue("cherry");
          }}
        >
          <GroupValue />
          <RadioGroup.Item className="item-apple" value="apple" />
          <RadioGroup.Item className="item-banana" value="banana" />
          <RadioGroup.Item className="item-cherry" value="cherry" />
        </RadioGroup.Root>
      );
    }
    render(<Example />);

    tap("banana");

    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(groupValue()).toBe("value=cherry");
    expect(item("banana")).toHaveAttribute("accessibility-value", "not selected");
    expect(item("cherry")).toHaveAttribute("accessibility-value", "selected");
  });

  it("blocks selection and consumer handlers for disabled items and roots", () => {
    const onValueChange = vi.fn();
    const userTap = vi.fn();
    const view = render(
      <RadioGroup.Root defaultValue="apple" onValueChange={onValueChange}>
        <GroupValue />
        <RadioGroup.Item className="item-apple" value="apple" />
        <RadioGroup.Item className="item-banana" value="banana" disabled bindtap={userTap}>
          <ItemState />
        </RadioGroup.Item>
      </RadioGroup.Root>,
    );

    expect(item("banana")).toHaveAttribute("accessibility-traits", "disabled");
    expect(item("banana")).toHaveTextContent("disabled=true");

    tap("banana");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(userTap).not.toHaveBeenCalled();
    expect(groupValue()).toBe("value=apple");

    view.rerender(
      <RadioGroup.Root className="root" defaultValue="apple" disabled onValueChange={onValueChange}>
        <GroupValue />
        <RadioGroup.Item className="item-apple" value="apple" />
        <RadioGroup.Item className="item-banana" value="banana" bindtap={userTap} />
      </RadioGroup.Root>,
    );

    expect(elementTree.root?.querySelector(".root")).toHaveAttribute(
      "accessibility-traits",
      "disabled",
    );
    expect(item("banana")).toHaveAttribute("accessibility-traits", "disabled");

    tap("banana");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(userTap).not.toHaveBeenCalled();
    expect(groupValue()).toBe("value=apple");
  });

  it("lets consumers override accessibility defaults", () => {
    render(
      <RadioGroup.Root
        className="root"
        defaultValue="apple"
        disabled
        accessibility-element={false}
        accessibility-role-description="custom group"
        accessibility-traits="none"
      >
        <RadioGroup.Item
          className="item-apple"
          value="apple"
          accessibility-element={false}
          accessibility-role-description="custom radio"
          accessibility-traits="button"
          accessibility-value="custom"
        />
      </RadioGroup.Root>,
    );
    const root = elementTree.root?.querySelector(".root");

    expect(root).toHaveAttribute("accessibility-element", "false");
    expect(root).toHaveAttribute("accessibility-role-description", "custom group");
    expect(root).toHaveAttribute("accessibility-traits", "none");
    expect(item("apple")).toHaveAttribute("accessibility-element", "false");
    expect(item("apple")).toHaveAttribute("accessibility-role-description", "custom radio");
    expect(item("apple")).toHaveAttribute("accessibility-traits", "button");
    expect(item("apple")).toHaveAttribute("accessibility-value", "custom");
  });

  it("keeps pressed state when the consumer installs Main Thread touch handlers", async () => {
    const reports = { start: vi.fn(), end: vi.fn() };
    function Example() {
      function handleTouchStart() {
        "main thread";
        runOnBackground(reports.start)();
      }
      function handleTouchEnd() {
        "main thread";
        runOnBackground(reports.end)();
      }
      return (
        <RadioGroup.Root defaultValue="apple">
          <RadioGroup.Item
            className="item-apple"
            value="apple"
            main-thread:bindtouchstart={handleTouchStart}
            main-thread:bindtouchend={handleTouchEnd}
          >
            <ItemState />
          </RadioGroup.Item>
        </RadioGroup.Root>
      );
    }
    render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
    await waitSchedule();

    fireEvent.touchstart(item("apple"), {});
    await waitSchedule();
    expect(item("apple")).toHaveTextContent("pressed=true");
    fireEvent.touchend(item("apple"), {});
    await waitSchedule();
    expect(item("apple")).toHaveTextContent("pressed=false");
    expect(reports.start).toHaveBeenCalledTimes(1);
    expect(reports.end).toHaveBeenCalledTimes(1);
  });

  it("returns null outside providers when strict is false", () => {
    function Probe() {
      const group = useRadioGroupContext({ strict: false });
      const radio = useRadioGroupItemContext({ strict: false });
      return <text className="probe">{`${group === null} ${radio === null}`}</text>;
    }
    render(<Probe />);

    expect(elementTree.root?.querySelector(".probe")).toHaveTextContent("true true");
  });
});
