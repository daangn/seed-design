import { runOnBackground, useMainThreadRef } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { Select } from "./index";

describe("Select feedback integration", () => {
  it.each([
    "trigger",
    "item",
  ] as const)("%s keeps custom content inside its scale target and preserves main-thread handlers", async (kind) => {
    function Example({ report }: { report: (attached: boolean) => void }) {
      const userRef = useMainThreadRef(null);
      function handleTouch() {
        "main thread";
        runOnBackground(report)(userRef.current !== null);
      }
      const userProps = {
        "main-thread:ref": userRef,
        "main-thread:bindtouchstart": handleTouch,
      };
      return (
        <Select.Root>
          {kind === "trigger" ? (
            <Select.Trigger {...userProps}>
              <text className="custom">Custom</text>
            </Select.Trigger>
          ) : (
            <Select.Item value="test" {...userProps}>
              <Select.ItemLabel>Custom</Select.ItemLabel>
            </Select.Item>
          )}
        </Select.Root>
      );
    }
    const report = vi.fn();
    const { container } = render(<Example report={report} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const root = container.querySelector(`.seed-select-${kind}__root`)!;
    const target = root.querySelector(`.seed-select-${kind}__scaleContent`)!;
    const overlay = root.querySelector(`.seed-select-${kind}__pressedOverlay`)!;
    expect(target).not.toBeNull();
    expect(target.textContent).toBe("Custom");
    expect(target.contains(overlay)).toBe(false);
    fireEvent.touchstart(root, {});
    await waitSchedule();
    expect(report.mock.calls).toEqual([[true]]);
    expect(root.classList.contains(`seed-select-${kind}__root--pressed_true`)).toBe(true);
    fireEvent.touchcancel(root, {});
    await waitSchedule();
    expect(root.classList.contains(`seed-select-${kind}__root--pressed_true`)).toBe(false);
  });

  it.each([
    "disabled",
    "readOnly",
  ] as const)("blocks feedback when the select is %s", async (state) => {
    const { container } = render(
      <Select.Root {...{ [state]: true }}>
        <Select.Trigger />
        <Select.Item value="test">
          <Select.ItemLabel>Test</Select.ItemLabel>
        </Select.Item>
      </Select.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();
    for (const kind of ["trigger", "item"]) {
      const root = container.querySelector(`.seed-select-${kind}__root`)!;
      fireEvent.touchstart(root, {});
      await waitSchedule();
      expect(root.classList.contains(`seed-select-${kind}__root--pressed_true`)).toBe(false);
    }
  });
});
