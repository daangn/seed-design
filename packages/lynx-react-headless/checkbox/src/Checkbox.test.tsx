import "@testing-library/jest-dom";
import { useState } from "@lynx-js/react";
import { runOnBackground } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Checkbox, useCheckboxContext } from "./index.js";

function root() {
  const node = elementTree.root?.querySelector<HTMLElement>(".checkbox");
  if (!node) throw new Error("Missing Checkbox root");
  return node;
}

function event(name: string) {
  fireEvent(root(), new Event(`bindEvent:${name}`));
}

function State() {
  const { checked, indeterminate, pressed, disabled } = useCheckboxContext();
  return (
    <Checkbox.Control>
      <text>{`checked=${checked} indeterminate=${indeterminate} pressed=${pressed} disabled=${disabled}`}</text>
    </Checkbox.Control>
  );
}

describe("Checkbox.Root", () => {
  it("toggles uncontrolled state on tap after the consumer tap handler", () => {
    const calls: string[] = [];
    render(
      <Checkbox.Root
        className="checkbox"
        onCheckedChange={(checked) => calls.push(`change:${checked}`)}
        bindtap={() => calls.push("tap")}
      >
        <State />
      </Checkbox.Root>,
    );

    expect(root()).toHaveAttribute("accessibility-element", "true");
    expect(root()).toHaveAttribute("accessibility-role-description", "checkbox");
    expect(root()).toHaveAttribute("accessibility-value", "not checked");

    event("touchstart");
    expect(root()).toHaveTextContent("pressed=true");
    event("touchend");
    event("tap");

    expect(calls).toEqual(["tap", "change:true"]);
    expect(root()).toHaveTextContent("checked=true");
    expect(root()).toHaveTextContent("pressed=false");
    expect(root()).toHaveAttribute("accessibility-value", "checked");
  });

  it("keeps the controlled value until the parent applies its own transform", () => {
    const onCheckedChange = vi.fn();
    function Parent() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox.Root
          className="checkbox"
          checked={checked}
          onCheckedChange={(next) => {
            onCheckedChange(next);
            // The parent accepts only every second request.
            if (onCheckedChange.mock.calls.length % 2 === 0) setChecked(next);
          }}
        >
          <State />
        </Checkbox.Root>
      );
    }
    render(<Parent />);

    event("tap");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(root()).toHaveTextContent("checked=false");

    event("tap");
    expect(onCheckedChange).toHaveBeenLastCalledWith(true);
    expect(root()).toHaveTextContent("checked=true");
    expect(root()).toHaveAttribute("accessibility-value", "checked");
  });

  it("reports mixed while indeterminate and leaves clearing it to the parent", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <Checkbox.Root className="checkbox" indeterminate checked onCheckedChange={onCheckedChange}>
        <State />
      </Checkbox.Root>,
    );

    expect(root()).toHaveAttribute("accessibility-value", "mixed");
    event("tap");
    expect(onCheckedChange).toHaveBeenCalledWith(false);
    expect(root()).toHaveTextContent("indeterminate=true");

    rerender(
      <Checkbox.Root
        className="checkbox"
        indeterminate
        checked={false}
        accessibility-value="일부 선택됨"
        onCheckedChange={onCheckedChange}
      >
        <State />
      </Checkbox.Root>,
    );
    expect(root()).toHaveAttribute("accessibility-value", "일부 선택됨");
  });

  it("blocks press, tap and checked changes while disabled", async () => {
    const onCheckedChange = vi.fn();
    const tap = vi.fn();
    const mainThreadTap = vi.fn();
    function Example(props: { disabled?: boolean }) {
      function handleMainThreadTap() {
        "main thread";
        runOnBackground(mainThreadTap)();
      }
      return (
        <Checkbox.Root
          className="checkbox"
          onCheckedChange={onCheckedChange}
          bindtap={tap}
          main-thread:bindtap={handleMainThreadTap}
          {...props}
        >
          <State />
        </Checkbox.Root>
      );
    }
    const view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
    await waitSchedule();
    fireEvent.touchstart(root(), {});
    await waitSchedule();
    expect(root()).toHaveTextContent("pressed=true");

    view.rerender(<Example disabled />);
    await waitSchedule();
    expect(root()).toHaveTextContent("pressed=false");
    expect(root()).toHaveAttribute("accessibility-traits", "disabled");

    fireEvent.tap(root(), {});
    fireEvent.touchstart(root(), {});
    await waitSchedule();

    expect(root()).toHaveTextContent("pressed=false");
    expect(root()).toHaveTextContent("checked=false");
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(tap).not.toHaveBeenCalled();
    expect(mainThreadTap).not.toHaveBeenCalled();
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
        <Checkbox.Root
          className="checkbox"
          main-thread:bindtouchstart={handleTouchStart}
          main-thread:bindtouchend={handleTouchEnd}
        >
          <State />
        </Checkbox.Root>
      );
    }
    render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
    await waitSchedule();

    fireEvent.touchstart(root(), {});
    await waitSchedule();
    expect(root()).toHaveTextContent("pressed=true");
    fireEvent.touchend(root(), {});
    await waitSchedule();
    expect(root()).toHaveTextContent("pressed=false");
    expect(reports.start).toHaveBeenCalledTimes(1);
    expect(reports.end).toHaveBeenCalledTimes(1);
  });

  it("forwards Root and Control refs to native views", () => {
    let rootRef: unknown;
    let controlRef: unknown;
    render(
      <Checkbox.Root
        className="checkbox"
        ref={(value) => {
          rootRef = value;
        }}
      >
        <Checkbox.Control
          className="control"
          ref={(value) => {
            controlRef = value;
          }}
        />
      </Checkbox.Root>,
    );

    expect(rootRef).toBeTruthy();
    expect(controlRef).toBeTruthy();
    expect(root().querySelector(".control")).not.toBeNull();
  });

  it("requires Control to be rendered inside Root", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Checkbox.Control />)).toThrow(
      "useCheckboxContext must be used within a CheckboxRoot",
    );
  });
});
