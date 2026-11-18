import "@testing-library/jest-dom";
import { runOnBackground, useState } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Switch, useSwitchContext } from "./index.js";

function root() {
  const node = elementTree.root?.querySelector<HTMLElement>(".switch");
  if (!node) throw new Error("Missing Switch root");
  return node;
}

function event(name: string) {
  fireEvent(root(), new Event(`bindEvent:${name}`));
}

function State() {
  const { checked, pressed, disabled } = useSwitchContext();
  return (
    <Switch.Control>
      <Switch.Thumb />
      <text>{`checked=${checked} pressed=${pressed} disabled=${disabled}`}</text>
    </Switch.Control>
  );
}

describe("Switch.Root", () => {
  it("toggles uncontrolled state on tap after the consumer tap handler", () => {
    const calls: string[] = [];
    render(
      <Switch.Root
        className="switch"
        onCheckedChange={(checked) => calls.push(`change:${checked}`)}
        bindtap={() => calls.push("tap")}
      >
        <State />
      </Switch.Root>,
    );

    expect(root()).toHaveAttribute("accessibility-element", "true");
    expect(root()).toHaveAttribute("accessibility-role-description", "switch");
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
        <Switch.Root
          className="switch"
          checked={checked}
          onCheckedChange={(next) => {
            onCheckedChange(next);
            // The parent accepts only every second request.
            if (onCheckedChange.mock.calls.length % 2 === 0) setChecked(next);
          }}
        >
          <State />
        </Switch.Root>
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

  it("lets consumer accessibility props override the defaults", () => {
    render(
      <Switch.Root
        className="switch"
        disabled
        accessibility-value="켜짐"
        accessibility-traits="none"
      >
        <State />
      </Switch.Root>,
    );

    expect(root()).toHaveAttribute("accessibility-value", "켜짐");
    expect(root()).toHaveAttribute("accessibility-traits", "none");
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
        <Switch.Root
          className="switch"
          onCheckedChange={onCheckedChange}
          bindtap={tap}
          main-thread:bindtap={handleMainThreadTap}
          {...props}
        >
          <State />
        </Switch.Root>
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

    // The testing environment keeps one handler per event key, so the Main Thread tap wins here.
    view.rerender(<Example />);
    await waitSchedule();
    fireEvent.tap(root(), {});
    await waitSchedule();
    expect(mainThreadTap).toHaveBeenCalledTimes(1);
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
        <Switch.Root
          className="switch"
          main-thread:bindtouchstart={handleTouchStart}
          main-thread:bindtouchend={handleTouchEnd}
        >
          <State />
        </Switch.Root>
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

  it("forwards Root, Control and Thumb refs to native views", () => {
    const refs: Record<string, unknown> = {};
    render(
      <Switch.Root className="switch" ref={(value) => (refs.root = value)}>
        <Switch.Control className="control" ref={(value) => (refs.control = value)}>
          <Switch.Thumb className="thumb" ref={(value) => (refs.thumb = value)} />
        </Switch.Control>
      </Switch.Root>,
    );

    expect(refs.root).toBeTruthy();
    expect(refs.control).toBeTruthy();
    expect(refs.thumb).toBeTruthy();
    expect(root().querySelector(".control .thumb")).not.toBeNull();
  });

  it("renders Thumb with only the Root context and requires Root for parts", () => {
    render(
      <Switch.Root className="switch">
        <Switch.Thumb className="thumb" />
      </Switch.Root>,
    );
    expect(root().querySelector(".thumb")).not.toBeNull();

    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Switch.Thumb />)).toThrow(
      "useSwitchContext must be used within a SwitchRoot",
    );
  });
});
