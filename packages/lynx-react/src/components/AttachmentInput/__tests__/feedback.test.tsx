import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { runOnBackground } from "@lynx-js/react";
import { describe, expect, it, vi } from "vitest";
import { AttachmentInput } from "../AttachmentInput";
import { AttachmentDisplay } from "../../AttachmentDisplay/AttachmentDisplay";

const fileEntry = {
  id: "test",
  status: "error" as const,
  file: { uri: "file://test.png", name: "test.png", type: "image/png", size: 10 },
};
const displayEntry = { id: "test", status: "error" as const };

function Example({
  display,
  disabled = false,
  readOnly = false,
  onAction,
  onRemove,
  onTouch,
}: {
  display: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onAction: () => void;
  onRemove: () => void;
  onTouch: () => void;
}) {
  function handleTouch() {
    "main thread";
    runOnBackground(onTouch)();
  }
  if (display) {
    return (
      <AttachmentDisplay.Root
        defaultEntries={[displayEntry]}
        disabled={disabled}
        readOnly={readOnly}
      >
        <AttachmentDisplay.Trigger />
        <AttachmentDisplay.Item entry={displayEntry}>
          <AttachmentDisplay.ItemActionButton
            bindtap={onAction}
            main-thread:bindtouchstart={handleTouch}
          />
          <AttachmentDisplay.ItemRemoveButton
            bindtap={onRemove}
            main-thread:bindtouchstart={handleTouch}
          />
        </AttachmentDisplay.Item>
      </AttachmentDisplay.Root>
    );
  }
  return (
    <AttachmentInput.Root
      defaultAcceptedFileEntries={[fileEntry]}
      disabled={disabled}
      readOnly={readOnly}
    >
      <AttachmentInput.Trigger />
      <AttachmentInput.Item fileEntry={fileEntry}>
        <AttachmentInput.ItemActionButton
          bindtap={onAction}
          main-thread:bindtouchstart={handleTouch}
        />
        <AttachmentInput.ItemRemoveButton
          bindtap={onRemove}
          main-thread:bindtouchstart={handleTouch}
        />
      </AttachmentInput.Item>
    </AttachmentInput.Root>
  );
}

describe.each([false, true])("attachment feedback (display: %s)", (display) => {
  it("keeps remove feedback independent of the parent item and preserves Main Thread handlers", async () => {
    const onTouch = vi.fn();
    const onAction = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(<Example {...{ display, onTouch, onAction, onRemove }} />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    const item = container.querySelector(".seed-attachment-input-item__root")!;
    const remove = container.querySelector(".seed-attachment-input-item__removeButton")!;
    const action = container.querySelector(".seed-attachment-input-item__actionButton")!;
    fireEvent.touchstart(remove, {});
    await waitSchedule();
    expect(onTouch).toHaveBeenCalledTimes(1);
    expect(remove.className).toContain("removePressed_true");
    expect(item.className).not.toContain("pressed_true");
    fireEvent.touchcancel(remove, {});
    await waitSchedule();
    expect(remove.className).not.toContain("removePressed_true");
    fireEvent.touchstart(action, {});
    await waitSchedule();
    expect(onTouch).toHaveBeenCalledTimes(2);
    fireEvent.tap(action);
    fireEvent.tap(remove);
    await waitSchedule();
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it.each([
    "disabled",
    "readOnly",
  ] as const)("blocks action and remove taps while %s", async (state) => {
    const onAction = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      <Example {...{ display, onAction, onRemove, onTouch: vi.fn(), [state]: true }} />,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();
    const remove = container.querySelector(".seed-attachment-input-item__removeButton")!;
    const action = container.querySelector(".seed-attachment-input-item__actionButton")!;
    fireEvent.touchstart(remove, {});
    fireEvent.tap(remove);
    fireEvent.tap(action);
    await waitSchedule();
    expect(remove.className).not.toContain("removePressed_true");
    expect(onAction).not.toHaveBeenCalled();
    expect(onRemove).not.toHaveBeenCalled();
  });
});
