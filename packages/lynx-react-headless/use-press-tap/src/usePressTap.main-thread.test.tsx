import { runOnBackground } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { usePressTap } from "./usePressTap";

function target() {
  const node = elementTree.root?.querySelector<HTMLElement>(".target");
  if (!node) throw new Error("Missing press target");
  return node;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("usePressTap main-thread:bindtap", () => {
  it("skips the consumer handler while disabled without leaving an empty worklet", async () => {
    const mainThreadTap = vi.fn();
    const mainThreadWarn = vi
      .spyOn(lynxTestingEnv.mainThread.globalThis.console, "warn")
      .mockImplementation(() => {});

    function Example({ disabled }: { disabled: boolean }) {
      function handleMainThreadTap() {
        "main thread";
        runOnBackground(mainThreadTap)();
      }
      const { pressed: _pressed, ...pressProps } = usePressTap({
        disabled,
        mainThreadOnTap: handleMainThreadTap,
      });
      return <view className="target" {...pressProps} />;
    }

    const view = render(<Example disabled={false} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    fireEvent.tap(target(), {});
    await waitSchedule();
    expect(mainThreadTap).toHaveBeenCalledTimes(1);

    view.rerender(<Example disabled />);
    await waitSchedule();
    fireEvent.tap(target(), {});
    await waitSchedule();
    expect(mainThreadTap).toHaveBeenCalledTimes(1);

    view.rerender(<Example disabled={false} />);
    await waitSchedule();
    fireEvent.tap(target(), {});
    await waitSchedule();
    expect(mainThreadTap).toHaveBeenCalledTimes(2);

    expect(mainThreadWarn).not.toHaveBeenCalled();
  });
});
