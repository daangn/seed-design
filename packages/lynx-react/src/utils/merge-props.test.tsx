import { createRef, runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { mergeProps } from "./merge-props";

describe("mergeProps", () => {
  it("preserves props and chains only identical event keys, user first", () => {
    const calls: string[] = [];
    const base = {
      className: "seed",
      style: { width: "10px", color: "red" },
      bindtap: () => calls.push("base"),
    };
    const user = {
      className: "user",
      style: { color: "blue" },
      bindtap: () => {
        calls.push("user");
        return false;
      },
    };
    const props = mergeProps(base, user, { className: undefined });
    props.bindtap();
    expect(calls).toEqual(["user", "base"]);
    expect(props.className).toBe("seed user");
    expect(props.style).toEqual({ width: "10px", color: "blue" });
    expect(base.style.color).toBe("red");
    expect(mergeProps({ bindtap: base.bindtap }, { catchtap: user.bindtap })).toEqual({
      bindtap: base.bindtap,
      catchtap: user.bindtap,
    });
    expect(mergeProps({ ref: null })).toEqual({});
    const ref = createRef();
    expect(mergeProps({ ref }, { ref: null }).ref).toBe(ref);
    expect(mergeProps({ "main-thread:ref": ref })["main-thread:ref"]).toBe(ref);
  });

  it("preserves three refs across replacement and unmount", async () => {
    const ref = createRef<unknown>();
    const cleanup = vi.fn();
    const first = vi.fn(() => cleanup);
    const next = vi.fn();
    const observer = vi.fn();
    function Example({ callback }: { callback: (value: unknown) => void | (() => void) }) {
      return <view {...mergeProps({ ref }, { ref: callback }, { ref: observer })} />;
    }
    const { rerender, unmount } = render(<Example callback={first} />);
    await waitSchedule();
    expect(ref.current).toBeTruthy();
    expect(first).toHaveBeenLastCalledWith(ref.current);
    expect(observer).toHaveBeenLastCalledWith(ref.current);
    rerender(<Example callback={next} />);
    await waitSchedule();
    expect(cleanup).toHaveBeenCalledTimes(1);
    expect(observer.mock.calls[1]).toEqual([null]);
    expect(observer).toHaveBeenLastCalledWith(ref.current);
    unmount();
    await waitSchedule();
    expect(ref.current).toBeNull();
    expect(next).toHaveBeenLastCalledWith(null);
    expect(observer).toHaveBeenLastCalledWith(null);
    expect(observer).toHaveBeenCalledTimes(4);
  });

  it("composes compiled Main Thread handlers and refreshes captures", async () => {
    function Example({ report }: { report: (value: string) => void }) {
      function base() {
        "main thread";
        runOnBackground(report)("base");
      }
      function user() {
        "main thread";
        runOnBackground(report)("user");
      }
      return (
        <view
          id="target"
          {...mergeProps(
            { "main-thread:bindtouchstart": base },
            { "main-thread:bindtouchstart": user },
          )}
        />
      );
    }
    const report = vi.fn();
    const next = vi.fn();
    const { container, rerender } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    fireEvent.touchstart(container.querySelector("#target")!, {});
    await waitSchedule();
    expect(report.mock.calls).toEqual([["user"], ["base"]]);
    rerender(<Example report={next} />);
    await waitSchedule();
    fireEvent.touchstart(container.querySelector("#target")!, {});
    await waitSchedule();
    expect(next.mock.calls).toEqual([["user"], ["base"]]);
    expect(report).toHaveBeenCalledTimes(2);
  });

  it("composes three Main Thread refs and runs cleanup in source order", async () => {
    function Example({ report, show = true }: { report: (value: string) => void; show?: boolean }) {
      const target = useMainThreadRef(null);
      const status = useMainThreadRef("initial");
      function callback() {
        "main thread";
        status.current = target.current ? "attached" : "missing";
        return () => {
          status.current = target.current === null ? "cleaned" : "uncleared";
        };
      }
      function inspect() {
        "main thread";
        runOnBackground(report)(status.current);
      }
      function observer(value: unknown) {
        "main thread";
        status.current += value ? ":observed" : ":detached";
      }
      return (
        <view>
          <view id="inspect" main-thread:bindtap={inspect} />
          {show && (
            <view
              {...mergeProps(
                { "main-thread:ref": target },
                { "main-thread:ref": callback },
                { "main-thread:ref": observer },
              )}
            />
          )}
        </view>
      );
    }
    const report = vi.fn();
    const { container, rerender } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    fireEvent.tap(container.querySelector("#inspect")!);
    await waitSchedule();
    expect(report.mock.calls).toEqual([["attached:observed"]]);
    rerender(<Example report={report} show={false} />);
    await waitSchedule();
    fireEvent.tap(container.querySelector("#inspect")!);
    await waitSchedule();
    expect(report.mock.calls).toEqual([["attached:observed"], ["cleaned:detached"]]);
  });
});
