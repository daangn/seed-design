import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { runOnBackground } from "@lynx-js/react";
import type { MainThread } from "@lynx-js/types";
import type { LynxIconElementProps } from "../../../types";
import { act, createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { Icon } from "../../Icon";
import { ContentPlaceholderAsset, ContentPlaceholderRoot } from "../ContentPlaceholder";

const TestIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => (
  <image {...props} {...(ref ? { "main-thread:ref": ref } : {})} src="icon.png" mode="aspectFit" />
));
TestIcon.displayName = "TestIcon";

function getRoot() {
  const root = elementTree.root;
  if (!root) throw new Error("Expected a rendered placeholder.");
  return root;
}

describe("ContentPlaceholder", () => {
  it("preserves a custom image's source, tint, sizing, and load handler", () => {
    const onLoad = vi.fn();
    render(
      <ContentPlaceholderRoot style={{ width: "240px", height: "120px" }}>
        <ContentPlaceholderAsset>
          <image
            src="photo.png"
            mode="aspectFit"
            tint-color="#ff6600"
            style={{ width: "100%", height: "100%" }}
            bindload={onLoad}
          />
        </ContentPlaceholderAsset>
      </ContentPlaceholderRoot>,
    );

    const image = getRoot().querySelector("image");
    if (!image) throw new Error("Expected an asset image.");
    expect(image).toHaveAttribute("src", "photo.png");
    expect(image).toHaveAttribute("mode", "aspectFit");
    expect(image).toHaveAttribute("tint-color", "#ff6600");
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
    const init = { eventType: "bindEvent", eventName: "load", detail: {} };
    const event = createEvent("bindEvent:load", image, init);
    Object.assign(event, init);
    act(() => {
      fireEvent(image, event);
    });
    expect(onLoad).toHaveBeenCalledOnce();
  });

  it("lets the public Icon fill the asset while preserving source properties", () => {
    render(
      <ContentPlaceholderRoot>
        <ContentPlaceholderAsset>
          <Icon icon={<TestIcon />} />
        </ContentPlaceholderAsset>
      </ContentPlaceholderRoot>,
    );

    const image = getRoot().querySelector("image");
    if (!image) throw new Error("Expected an asset image.");
    expect(image).toHaveAttribute("src", "icon.png");
    expect(image).toHaveAttribute("mode", "aspectFit");
    expect(image).toHaveStyle({ width: "100%", height: "100%" });
  });

  it("sizes a direct icon without an Icon wrapper and retains custom styles", () => {
    render(
      <ContentPlaceholderRoot>
        <ContentPlaceholderAsset>
          <TestIcon style={{ width: "24px", height: "24px", opacity: 0.5 }} />
        </ContentPlaceholderAsset>
      </ContentPlaceholderRoot>,
    );
    expect(getRoot().querySelector("image")).toHaveStyle({
      width: "100%",
      height: "100%",
      opacity: "0.5",
    });
  });

  it.each([
    "monochrome",
    "original",
    "marked",
  ])("handles %s tint without losing the child's Main Thread ref", async (mode) => {
    let frame: FrameRequestCallback | undefined;
    lynxTestingEnv.mainThread.globalThis["SystemInfo"] = { ...SystemInfo, lynxSdkVersion: "3.5" };
    lynxTestingEnv.mainThread.globalThis["__GetComputedStyleByKey"] = () => "rgb(220, 222, 227)";
    lynxTestingEnv.mainThread.globalThis["requestAnimationFrame"] = (
      callback: FrameRequestCallback,
    ) => {
      frame = callback;
      return 1;
    };
    lynxTestingEnv.mainThread.globalThis["cancelAnimationFrame"] = () => {
      frame = undefined;
    };
    const MarkedIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => (
      <TestIcon {...props} ref={ref} />
    ));
    Object.assign(MarkedIcon, { [Symbol.for("@seed-design/multicolor-icon")]: true });
    function Example({
      className,
      show = true,
      report,
    }: {
      className: string;
      show?: boolean;
      report: (value: boolean | "appear") => void;
    }) {
      const target = React.useMainThreadRef<MainThread.Element>(null);
      function inspect() {
        "main thread";
        runOnBackground(report)(target.current !== null);
      }
      function onAppear() {
        "main thread";
        runOnBackground(report)("appear");
      }
      return (
        <view>
          <view id="inspect-asset-ref" main-thread:bindtap={inspect} />
          <ContentPlaceholderRoot>
            <ContentPlaceholderAsset
              className={className}
              preserveOriginalColor={mode === "original" ? true : undefined}
            >
              {show ? (
                mode === "marked" ? (
                  <MarkedIcon ref={target} main-thread:binduiappear={onAppear} />
                ) : (
                  <TestIcon ref={target} main-thread:binduiappear={onAppear} />
                )
              ) : null}
            </ContentPlaceholderAsset>
          </ContentPlaceholderRoot>
        </view>
      );
    }
    const report = vi.fn();
    const { container, rerender } = render(<Example className="before" report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    rerender(<Example className="after" report={report} />);
    await waitSchedule();
    if (frame) {
      lynxTestingEnv.switchToMainThread();
      act(() => frame?.(16));
      lynxTestingEnv.switchToBackgroundThread();
    }
    const image = getRoot().querySelector("image");
    if (!image) throw new Error("Expected an asset image.");
    expect(image.getAttribute("tint-color")).toBe(
      mode === "monochrome" ? "rgb(220, 222, 227)" : null,
    );
    const init = { eventType: "bindEvent", eventName: "uiappear", detail: {} };
    const appear = createEvent("bindEvent:uiappear", image, init);
    Object.assign(appear, init);
    fireEvent(image, appear);
    await waitSchedule();
    expect(report).toHaveBeenCalledExactlyOnceWith("appear");
    const inspect = container.querySelector("#inspect-asset-ref");
    if (!inspect) throw new Error("Expected the ref inspection control.");
    fireEvent.tap(inspect);
    await waitSchedule();
    expect(report).toHaveBeenLastCalledWith(true);
    rerender(<Example className="after" show={false} report={report} />);
    await waitSchedule();
    fireEvent.tap(inspect);
    await waitSchedule();
    expect(report).toHaveBeenLastCalledWith(false);
  });
});
