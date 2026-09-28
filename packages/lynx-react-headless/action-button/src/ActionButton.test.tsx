import "@testing-library/jest-dom";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { runOnBackground } from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";
import { ActionButton, useActionButtonContext } from "./index.js";

function button() {
  const node = elementTree.root?.querySelector<HTMLElement>(".button");
  if (!node) throw new Error("Missing ActionButton root");
  return node;
}

function event(name: string) {
  fireEvent(button(), new Event(`bindEvent:${name}`));
}

function State() {
  const { pressed, loading, disabled } = useActionButtonContext();
  return <text>{`pressed=${pressed} loading=${loading} disabled=${disabled}`}</text>;
}

describe("ActionButton.Root", () => {
  it("clears pressed on tap, touchend and touchcancel and calls the consumer tap once", () => {
    const tap = vi.fn();
    const touchStart = vi.fn();
    render(
      <ActionButton.Root className="button" bindtap={tap} bindtouchstart={touchStart}>
        <State />
      </ActionButton.Root>,
    );

    event("touchstart");
    expect(button()).toHaveTextContent("pressed=true");
    event("touchend");
    expect(button()).toHaveTextContent("pressed=false");
    event("touchstart");
    event("touchcancel");
    expect(button()).toHaveTextContent("pressed=false");
    event("touchstart");
    event("tap");
    expect(button()).toHaveTextContent("pressed=false");
    expect(tap).toHaveBeenCalledTimes(1);
    expect(touchStart).toHaveBeenCalledTimes(3);
  });

  it.each([
    ["disabled", { disabled: true }],
    ["loading", { loading: true }],
  ])("blocks tap, Main Thread tap and pressed while %s", async (_, state) => {
    const tap = vi.fn();
    const mainThreadTap = vi.fn();
    function Example(props: { disabled?: boolean; loading?: boolean }) {
      function handleMainThreadTap() {
        "main thread";
        runOnBackground(mainThreadTap)();
      }
      return (
        <ActionButton.Root
          className="button"
          bindtap={tap}
          main-thread:bindtap={handleMainThreadTap}
          {...props}
        >
          <State />
        </ActionButton.Root>
      );
    }
    const view = render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
    await waitSchedule();
    fireEvent.touchstart(button(), {});
    await waitSchedule();
    expect(button()).toHaveTextContent("pressed=true");

    view.rerender(<Example {...state} />);
    await waitSchedule();
    expect(button()).toHaveTextContent("pressed=false");
    fireEvent.tap(button(), {});
    fireEvent.touchstart(button(), {});
    await waitSchedule();

    expect(button()).toHaveTextContent("pressed=false");
    expect(tap).not.toHaveBeenCalled();
    expect(mainThreadTap).not.toHaveBeenCalled();
  });

  it("keeps pressed state when the consumer installs Main Thread touch handlers", async () => {
    const reports = { start: vi.fn(), end: vi.fn(), cancel: vi.fn() };
    function Example() {
      function handleTouchStart() {
        "main thread";
        runOnBackground(reports.start)();
      }
      function handleTouchEnd() {
        "main thread";
        runOnBackground(reports.end)();
      }
      function handleTouchCancel() {
        "main thread";
        runOnBackground(reports.cancel)();
      }
      return (
        <ActionButton.Root
          className="button"
          main-thread:bindtouchstart={handleTouchStart}
          main-thread:bindtouchend={handleTouchEnd}
          main-thread:bindtouchcancel={handleTouchCancel}
        >
          <State />
        </ActionButton.Root>
      );
    }
    render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
    await waitSchedule();

    fireEvent.touchstart(button(), {});
    await waitSchedule();
    expect(button()).toHaveTextContent("pressed=true");
    fireEvent.touchend(button(), {});
    await waitSchedule();
    expect(button()).toHaveTextContent("pressed=false");
    fireEvent.touchstart(button(), {});
    await waitSchedule();
    fireEvent.touchcancel(button(), {});
    await waitSchedule();
    expect(button()).toHaveTextContent("pressed=false");
    expect(reports.start).toHaveBeenCalledTimes(2);
    expect(reports.end).toHaveBeenCalledTimes(1);
    expect(reports.cancel).toHaveBeenCalledTimes(1);
  });

  it("forwards the ref to a non-flattened native view with button accessibility defaults", () => {
    let nativeRef: unknown;
    render(
      <ActionButton.Root
        className="button"
        accessibility-label="저장"
        ref={(value) => {
          nativeRef = value;
        }}
      />,
    );

    expect(nativeRef).toBeTruthy();
    expect(button()).toHaveAttribute("flatten", "false");
    expect(button()).toHaveAttribute("accessibility-element", "true");
    expect(button()).toHaveAttribute("accessibility-traits", "button");
    expect(button()).toHaveAttribute("accessibility-label", "저장");
  });
});
