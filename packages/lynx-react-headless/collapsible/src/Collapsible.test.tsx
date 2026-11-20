import "@testing-library/jest-dom";
import { act, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { runOnBackground, useState } from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";
import { Collapsible, useCollapsibleTrigger } from "./index.js";

function node(selector: string) {
  const element = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`Missing ${selector}`);
  return element;
}

function expectRefOn(ref: unknown, element: HTMLElement) {
  // Lynx ref는 native node 대신 RefProxy이고, 붙은 요소에 `react-ref-<refAttr>` 속성을 남긴다.
  const { refAttr } = ref as { refAttr: number[] };
  expect(element).toHaveAttribute(`react-ref-${refAttr.join("-")}`);
}

function TestCollapsible(props: Collapsible.RootProps) {
  return (
    <Collapsible.Root {...props}>
      <Collapsible.Trigger className="trigger">
        <text>열기</text>
      </Collapsible.Trigger>
      <Collapsible.Content className="content">
        <text>내용</text>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

describe("Collapsible", () => {
  it("does not collapse initially open content before it is measured", () => {
    render(<TestCollapsible defaultOpen />);
    const inner = node(".content").firstElementChild as HTMLElement;

    expect(node(".content")).toHaveStyle({ height: "auto", overflow: "hidden" });
    expect(node(".trigger")).toHaveAttribute("accessibility-value", "펼쳐짐");

    act(() => fireEvent.layoutchange(inner, { height: 40 }));
    expect(node(".content")).toHaveStyle({ height: "40px" });

    fireEvent.tap(node(".trigger"));
    expect(node(".content")).toHaveStyle({ height: "0px" });
    expect(node(".content")).toHaveAttribute("accessibility-elements-hidden", "true");

    fireEvent.tap(node(".trigger"));
    expect(node(".content")).toHaveStyle({ height: "40px" });
  });

  it("keeps the measured height when the content shrinks by one device pixel", () => {
    // Android rounds layout edges to device pixels, so moving the content can report
    // a 1px smaller height. Following it re-centers the layout and flips the rounding back.
    // The ReactLynx testing environment sets `SystemInfo.pixelRatio` to 3.
    render(<TestCollapsible defaultOpen />);
    const inner = node(".content").firstElementChild as HTMLElement;

    act(() => fireEvent.layoutchange(inner, { height: 558 / 3 }));
    act(() => fireEvent.layoutchange(inner, { height: 557 / 3 }));
    expect(node(".content")).toHaveStyle({ height: `${558 / 3}px` });

    act(() => fireEvent.layoutchange(inner, { height: 556 / 3 }));
    expect(node(".content")).toHaveStyle({ height: `${556 / 3}px` });
  });

  it("keeps the measured height while an ancestor hides the content", () => {
    render(<TestCollapsible defaultOpen />);
    const inner = node(".content").firstElementChild as HTMLElement;

    act(() => fireEvent.layoutchange(inner, { width: 320, height: 40 }));
    act(() => fireEvent.layoutchange(inner, { width: 0, height: 0 }));
    expect(node(".content")).toHaveStyle({ height: "40px" });

    act(() => fireEvent.layoutchange(inner, { width: 320, height: 0 }));
    expect(node(".content")).toHaveStyle({ height: "0px" });
  });

  it("reports controlled changes without opening until the parent applies them", () => {
    const onOpenChange = vi.fn();
    function Parent() {
      const [open, setOpen] = useState(false);
      return (
        <TestCollapsible
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            if (onOpenChange.mock.calls.length > 1) setOpen(next);
          }}
        />
      );
    }
    render(<Parent />);

    fireEvent.tap(node(".trigger"));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(node(".content")).toHaveStyle({ height: "0px" });

    fireEvent.tap(node(".trigger"));
    expect(onOpenChange).toHaveBeenCalledTimes(2);
    expect(node(".content")).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("ignores taps while disabled", () => {
    const onOpenChange = vi.fn();
    render(<TestCollapsible disabled onOpenChange={onOpenChange} />);

    fireEvent.tap(node(".trigger"));

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(node(".trigger")).toHaveAttribute("accessibility-traits", "disabled");
    expect(node(".content")).toHaveStyle({ height: "0px" });
  });

  it("toggles before invoking the user's bindtap", () => {
    const order: string[] = [];
    render(
      <Collapsible.Root onOpenChange={() => order.push("toggle")}>
        <Collapsible.Trigger className="trigger" bindtap={() => order.push("user")} />
      </Collapsible.Root>,
    );
    fireEvent.tap(node(".trigger"));
    expect(order).toEqual(["toggle", "user"]);
  });

  it("forwards native refs and merges user touch handlers", () => {
    let triggerRef: unknown;
    let contentRef: unknown;
    const touchStart = vi.fn();
    const touchEnd = vi.fn();
    const touchCancel = vi.fn();
    render(
      <Collapsible.Root>
        <Collapsible.Trigger
          className="trigger"
          ref={(value) => {
            triggerRef = value;
          }}
          bindtouchstart={touchStart}
          bindtouchend={touchEnd}
          bindtouchcancel={touchCancel}
        />
        <Collapsible.Content
          className="content"
          ref={(value) => {
            contentRef = value;
          }}
        />
      </Collapsible.Root>,
    );
    expectRefOn(triggerRef, node(".trigger"));
    expectRefOn(contentRef, node(".content"));
    for (const name of ["touchstart", "touchend", "touchcancel"]) {
      fireEvent(node(".trigger"), new Event(`bindEvent:${name}`));
    }
    expect(touchStart).toHaveBeenCalledTimes(1);
    expect(touchEnd).toHaveBeenCalledTimes(1);
    expect(touchCancel).toHaveBeenCalledTimes(1);
  });

  it("preserves user string style overrides on collapsed content", () => {
    render(
      <Collapsible.Root>
        <Collapsible.Content className="content" style="opacity:0.5;overflow:visible">
          Content
        </Collapsible.Content>
      </Collapsible.Root>,
    );
    expect(node(".content")).toHaveStyle({ opacity: "0.5", height: "0px", overflow: "visible" });
  });

  it("keeps pressed state when a hook consumer passes Main Thread touch handlers", async () => {
    const reports = { start: vi.fn(), end: vi.fn() };
    function MainThreadProbe() {
      function handleTouchStart() {
        "main thread";
        runOnBackground(reports.start)();
      }
      function handleTouchEnd() {
        "main thread";
        runOnBackground(reports.end)();
      }
      const { pressed, triggerProps } = useCollapsibleTrigger({
        "main-thread:bindtouchstart": handleTouchStart,
        "main-thread:bindtouchend": handleTouchEnd,
      });
      return (
        <view className="main-thread-probe" {...triggerProps}>
          <text>{`pressed=${pressed}`}</text>
        </view>
      );
    }
    render(
      <Collapsible.Root>
        <MainThreadProbe />
      </Collapsible.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();

    fireEvent.touchstart(node(".main-thread-probe"), {});
    await waitSchedule();
    expect(node(".main-thread-probe")).toHaveTextContent("pressed=true");
    fireEvent.touchend(node(".main-thread-probe"), {});
    await waitSchedule();
    expect(node(".main-thread-probe")).toHaveTextContent("pressed=false");
    expect(reports.start).toHaveBeenCalledTimes(1);
    expect(reports.end).toHaveBeenCalledTimes(1);
  });
});
