import "@testing-library/jest-dom";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { runOnBackground } from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";
import {
  getIndependentActionProps,
  PageBanner,
  usePageBannerCloseButton,
  usePageBannerContext,
} from "./index.js";

function query(selector: string) {
  return elementTree.root?.querySelector<HTMLElement>(selector) ?? null;
}

function get(selector: string) {
  const node = query(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

function eventKeys(node: HTMLElement) {
  return "eventMap" in node && typeof node.eventMap === "object" && node.eventMap !== null
    ? Object.keys(node.eventMap).sort()
    : [];
}

function Pressed() {
  const { pressed } = usePageBannerContext();
  return <text>{`pressed=${pressed}`}</text>;
}

describe("PageBanner.Root", () => {
  it("maps an actionable Root to press state, tap and button accessibility", () => {
    const tap = vi.fn();
    render(
      <PageBanner.Root className="root" bindtap={tap}>
        <Pressed />
      </PageBanner.Root>,
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
      <PageBanner.Root className="root">
        <Pressed />
      </PageBanner.Root>,
    );

    fireEvent.touchstart(get(".root"), {});
    expect(get(".root")).toHaveTextContent("pressed=false");
    expect(get(".root")).not.toHaveAttribute("accessibility-traits");
    expect(eventKeys(get(".root"))).toEqual([]);
  });
});

describe("PageBanner.Button", () => {
  it("catches tap and touch so an actionable Root does not run", () => {
    const calls: string[] = [];
    render(
      <PageBanner.Root className="root" bindtap={() => calls.push("root")}>
        <PageBanner.Button
          className="button"
          bindtap={() => calls.push("bind")}
          catchtap={() => calls.push("catch")}
        />
        <Pressed />
      </PageBanner.Root>,
    );

    // The testing library cannot model catch stopping a bind listener; the catch keys are the contract.
    expect(eventKeys(get(".button"))).toEqual([
      "catchEvent:tap",
      "catchEvent:touchcancel",
      "catchEvent:touchend",
      "catchEvent:touchstart",
    ]);
    expect(get(".button")).toHaveAttribute("accessibility-traits", "button");
    fireEvent.touchstart(get(".button"), { eventType: "catchEvent" });
    fireEvent.tap(get(".button"), { eventType: "catchEvent" });
    expect(calls).toEqual(["catch", "bind"]);
    expect(get(".root")).toHaveTextContent("pressed=false");
  });
});

describe("PageBanner.CloseButton", () => {
  it("runs the consumer tap before dismiss without binding the tap to bubble", () => {
    const calls: string[] = [];
    render(
      <PageBanner.Root
        className="root"
        bindtap={() => calls.push("root")}
        onDismiss={() => calls.push("dismiss")}
      >
        <PageBanner.CloseButton
          className="close"
          accessibility-label="닫기"
          bindtap={() => calls.push("close")}
        />
      </PageBanner.Root>,
    );

    expect(eventKeys(get(".close"))).toEqual([
      "catchEvent:tap",
      "catchEvent:touchcancel",
      "catchEvent:touchend",
      "catchEvent:touchstart",
    ]);
    fireEvent.tap(get(".close"), { eventType: "catchEvent" });
    expect(calls).toEqual(["close", "dismiss"]);
    expect(query(".root")).not.toBeInTheDocument();
  });

  it("keeps its own pressed state when consumer Main Thread touch handlers move to catch", async () => {
    const report = vi.fn();
    function Close() {
      function handleTouchStart() {
        "main thread";
        runOnBackground(report)();
      }
      const { pressed, closeButtonProps } = usePageBannerCloseButton({
        "accessibility-label": "닫기",
        "main-thread:bindtouchstart": handleTouchStart,
      });
      return (
        <view className="close" {...getIndependentActionProps(closeButtonProps)}>
          <text>{`close=${pressed}`}</text>
        </view>
      );
    }
    render(
      <PageBanner.Root className="root" bindtap={() => {}}>
        <Pressed />
        <Close />
      </PageBanner.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();

    fireEvent.touchstart(get(".close"), { eventType: "catchEvent" });
    await waitSchedule();
    expect(report).toHaveBeenCalledTimes(1);
    expect(get(".close")).toHaveTextContent("close=true");
    expect(get(".root")).toHaveTextContent("pressed=false");
  });

  it("forwards the ref with button accessibility defaults and requires a PageBannerRoot", () => {
    let nativeRef: unknown;
    render(
      <PageBanner.Root>
        <PageBanner.CloseButton
          className="close"
          accessibility-label="닫기"
          ref={(value) => {
            nativeRef = value;
          }}
        />
      </PageBanner.Root>,
    );

    expect(nativeRef).toBeTruthy();
    expect(get(".close")).toHaveAttribute("accessibility-element", "true");
    expect(get(".close")).toHaveAttribute("accessibility-traits", "button");
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<PageBanner.CloseButton accessibility-label="닫기" />)).toThrow();
  });
});
