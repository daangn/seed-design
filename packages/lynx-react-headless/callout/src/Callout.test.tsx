import "@testing-library/jest-dom";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { runOnBackground, useState } from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";
import { Callout, useCalloutContext } from "./index.js";

function query(selector: string) {
  return elementTree.root?.querySelector<HTMLElement>(selector) ?? null;
}

function get(selector: string) {
  const node = query(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

function eventKeys(node: HTMLElement) {
  return Object.keys((node as HTMLElement & { eventMap?: object }).eventMap ?? {}).sort();
}

function Pressed() {
  const { pressed } = useCalloutContext();
  return <text>{`pressed=${pressed}`}</text>;
}

describe("Callout.Root", () => {
  it("hides after an uncontrolled dismiss and ignores later dismiss calls", () => {
    const onDismiss = vi.fn();
    let dismiss = () => {};
    function Capture() {
      dismiss = useCalloutContext().dismiss;
      return null;
    }
    render(
      <Callout.Root className="root" onDismiss={onDismiss}>
        <Capture />
        <Callout.CloseButton className="close" accessibility-label="닫기" />
      </Callout.Root>,
    );

    fireEvent.tap(get(".close"));
    expect(query(".root")).not.toBeInTheDocument();
    dismiss();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("renders nothing when defaultOpen is false", () => {
    render(<Callout.Root className="root" defaultOpen={false} />);
    expect(query(".root")).not.toBeInTheDocument();
  });

  it("notifies without hiding while controlled and follows the controlled value", () => {
    const onDismiss = vi.fn();
    function Example() {
      const [open, setOpen] = useState(true);
      return (
        <view>
          <view className="hide" bindtap={() => setOpen(false)} />
          <Callout.Root className="root" open={open} onDismiss={onDismiss}>
            <Callout.CloseButton className="close" accessibility-label="닫기" />
          </Callout.Root>
        </view>
      );
    }
    render(<Example />);

    fireEvent.tap(get(".close"));
    fireEvent.tap(get(".close"));
    expect(onDismiss).toHaveBeenCalledTimes(2);
    expect(query(".root")).toBeInTheDocument();

    fireEvent.tap(get(".hide"));
    expect(query(".root")).not.toBeInTheDocument();
  });

  it("maps an actionable Root to press state, tap and button accessibility", () => {
    const tap = vi.fn();
    render(
      <Callout.Root className="root" bindtap={tap}>
        <Pressed />
      </Callout.Root>,
    );

    expect(get(".root")).toHaveAttribute("accessibility-element", "true");
    expect(get(".root")).toHaveAttribute("accessibility-traits", "button");
    fireEvent.touchstart(get(".root"), {});
    expect(get(".root")).toHaveTextContent("pressed=true");
    fireEvent.tap(get(".root"));
    expect(get(".root")).toHaveTextContent("pressed=false");
    expect(tap).toHaveBeenCalledTimes(1);
  });

  it("leaves a Root without tap handlers non-interactive", () => {
    render(
      <Callout.Root className="root">
        <Pressed />
      </Callout.Root>,
    );

    fireEvent.touchstart(get(".root"), {});
    expect(get(".root")).toHaveTextContent("pressed=false");
    expect(get(".root")).not.toHaveAttribute("accessibility-element");
    expect(get(".root")).not.toHaveAttribute("accessibility-traits");
    expect(eventKeys(get(".root"))).toEqual([]);
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
        <Callout.Root
          className="root"
          bindtap={() => {}}
          main-thread:bindtouchstart={handleTouchStart}
          main-thread:bindtouchend={handleTouchEnd}
        >
          <Pressed />
        </Callout.Root>
      );
    }
    render(<Example />, { enableMainThread: true, enableBackgroundThread: true });
    await waitSchedule();

    fireEvent.touchstart(get(".root"), {});
    await waitSchedule();
    expect(get(".root")).toHaveTextContent("pressed=true");
    fireEvent.touchend(get(".root"), {});
    await waitSchedule();
    expect(get(".root")).toHaveTextContent("pressed=false");
    expect(reports.start).toHaveBeenCalledTimes(1);
    expect(reports.end).toHaveBeenCalledTimes(1);
  });
});

describe("Callout.CloseButton", () => {
  it("runs the consumer tap before dismiss and lets the tap bubble to an actionable Root", () => {
    const calls: string[] = [];
    render(
      <Callout.Root
        className="root"
        open
        bindtap={() => calls.push("root")}
        onDismiss={() => calls.push("dismiss")}
      >
        <Callout.CloseButton
          className="close"
          accessibility-label="닫기"
          bindtap={() => calls.push("close")}
        />
      </Callout.Root>,
    );

    expect(eventKeys(get(".close"))).toEqual(["bindEvent:tap"]);
    // Native taps bubble to Root; the testing library only bubbles when asked.
    fireEvent(get(".close"), new Event("bindEvent:tap", { bubbles: true }));
    expect(calls).toEqual(["close", "dismiss", "root"]);
  });

  it("forwards the ref with button accessibility defaults", () => {
    let nativeRef: unknown;
    render(
      <Callout.Root>
        <Callout.CloseButton
          className="close"
          accessibility-label="닫기"
          ref={(value) => {
            nativeRef = value;
          }}
        />
      </Callout.Root>,
    );

    expect(nativeRef).toBeTruthy();
    expect(get(".close")).toHaveAttribute("accessibility-element", "true");
    expect(get(".close")).toHaveAttribute("accessibility-traits", "button");
    expect(get(".close")).toHaveAttribute("accessibility-label", "닫기");
  });

  it("requires a CalloutRoot", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Callout.CloseButton accessibility-label="닫기" />)).toThrow();
  });
});
