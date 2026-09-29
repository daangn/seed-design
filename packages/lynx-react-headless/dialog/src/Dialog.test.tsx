import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Dialog } from "./index.js";

// lynx-ui-presence advances open/close states with `lynx.requestAnimationFrame`, which the
// testing environment does not provide. Frames run on fake timers so each test can finish
// the enter/exit lifecycle explicitly.
function installAnimationFrames() {
  const frames = {
    requestAnimationFrame: (callback: () => void) => setTimeout(callback, 16),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
  };
  Object.assign(lynx, frames);
  Object.assign(lynxTestingEnv.backgroundThread.lynx, frames);
  Object.assign(lynxTestingEnv.mainThread.lynx, frames);
}

// Each state change schedules the next frames from an effect, so frames run across several act() rounds.
function flushPresence() {
  for (let round = 0; round < 8; round += 1) {
    installAnimationFrames();
    act(() => {
      vi.advanceTimersByTime(500);
    });
  }
}

function renderDialog(props: Dialog.RootProps, contentProps: Dialog.ContentProps = {}) {
  const view = render(
    <Dialog.Root {...props}>
      <Dialog.Trigger>
        <text>Open</text>
      </Dialog.Trigger>
      <Dialog.Positioner>
        <Dialog.Backdrop className="backdrop" />
        <Dialog.Content className="content" {...contentProps}>
          <Dialog.Title>Title</Dialog.Title>
          <Dialog.CloseButton className="close">
            <text>Close</text>
          </Dialog.CloseButton>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>,
  );
  const query = (selector: string) => view.container.querySelector(selector);
  const tap = (selector: string) => {
    const element = query(selector);
    if (!element) throw new Error(`Expected ${selector} to be rendered.`);
    fireEvent.tap(element);
  };

  return { ...view, query, tap, trigger: () => tap("view") };
}

describe("Dialog", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installAnimationFrames();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens from Trigger and closes from CloseButton in uncontrolled mode", () => {
    const onOpenChange = vi.fn();
    const dialog = renderDialog({ onOpenChange });

    expect(dialog.query(".content")).toBeNull();

    dialog.trigger();
    flushPresence();

    expect(onOpenChange.mock.calls).toEqual([[true]]);
    expect(dialog.query(".content")).not.toBeNull();

    dialog.tap(".close");
    flushPresence();

    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    expect(dialog.query(".content")).toBeNull();
  });

  it("only requests changes in controlled mode", () => {
    const onOpenChange = vi.fn();
    const closed = renderDialog({ open: false, onOpenChange });

    closed.trigger();
    flushPresence();

    expect(onOpenChange.mock.calls).toEqual([[true]]);
    expect(closed.query(".content")).toBeNull();
    closed.unmount();

    onOpenChange.mockClear();
    const opened = renderDialog({ open: true, onOpenChange });
    flushPresence();

    opened.tap(".backdrop");
    flushPresence();

    expect(onOpenChange.mock.calls).toEqual([[false]]);
    expect(opened.query(".content")).not.toBeNull();
  });

  it("keeps Backdrop taps from closing when clickToClose is false", () => {
    const onOpenChange = vi.fn();
    const view = render(
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Positioner>
          <Dialog.Backdrop className="backdrop" clickToClose={false} />
          <Dialog.Content className="content" />
        </Dialog.Positioner>
      </Dialog.Root>,
    );
    flushPresence();

    const backdrop = view.container.querySelector(".backdrop");
    if (!backdrop) throw new Error("Expected backdrop to be rendered.");
    fireEvent.tap(backdrop);
    flushPresence();

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(view.container.querySelector(".content")).not.toBeNull();
  });

  it("fills the native overlay with the layer view only in container mode", () => {
    const view = render(
      <Dialog.Root defaultOpen>
        <Dialog.Positioner className="overlay-layer" container="window" style={{ width: "80%" }}>
          <Dialog.Content />
        </Dialog.Positioner>
        <Dialog.Positioner className="view-layer" style={{ top: "0px" }}>
          <Dialog.Content />
        </Dialog.Positioner>
      </Dialog.Root>,
    );
    const overlayLayer = view.container.querySelector<HTMLElement>("overlay > .overlay-layer");
    const viewLayer = view.container.querySelector<HTMLElement>(".view-layer");

    expect(overlayLayer?.style.width).toBe("80%");
    expect(overlayLayer?.style.height).toBe("100%");
    expect(overlayLayer?.style.position).toBe("relative");
    expect(viewLayer?.style.height).toBe("");
    expect(viewLayer?.style.position).toBe("fixed");
  });

  it("keeps closed content mounted with forceMount", () => {
    const dialog = renderDialog({ forceMount: true });
    flushPresence();

    expect(dialog.query(".content")?.classList.contains("ui-closed")).toBe(true);
  });

  it("drops transition classes with skipAnimation", () => {
    const animated = renderDialog({ defaultOpen: true }, { transition: true });
    expect(animated.query(".content")?.classList.contains("ui-entering")).toBe(false);
    act(() => {
      vi.advanceTimersByTime(16 * 8);
    });
    expect(animated.query(".content")?.classList.contains("ui-entering")).toBe(true);
    animated.unmount();

    const skipped = renderDialog({ defaultOpen: true, skipAnimation: true }, { transition: true });
    act(() => {
      vi.advanceTimersByTime(16 * 8);
    });
    expect(skipped.query(".content")?.classList.contains("ui-entering")).toBe(false);
    expect(skipped.query(".content")?.classList.contains("ui-open")).toBe(true);
  });

  it("keeps user native callbacks without replacing dialog handlers", () => {
    const onOpenChange = vi.fn();
    const contentTap = vi.fn();
    const backdropTap = vi.fn();
    const onBackdropClick = vi.fn();
    const view = render(
      <Dialog.Root defaultOpen onOpenChange={onOpenChange}>
        <Dialog.Positioner>
          <Dialog.Backdrop
            className="backdrop"
            onClick={onBackdropClick}
            // @ts-expect-error `bindtap` is reserved for backdrop dismissal.
            dialogBackdropProps={{ bindtap: backdropTap }}
          />
          <Dialog.Content className="content" dialogContentProps={{ bindtap: contentTap }} />
        </Dialog.Positioner>
      </Dialog.Root>,
    );
    flushPresence();

    const content = view.container.querySelector(".content");
    const backdrop = view.container.querySelector(".backdrop");
    if (!content || !backdrop) throw new Error("Expected content and backdrop to be rendered.");

    fireEvent.tap(content);
    expect(contentTap).toHaveBeenCalledTimes(1);

    fireEvent.tap(backdrop);
    flushPresence();

    expect(backdropTap).not.toHaveBeenCalled();
    expect(onBackdropClick).toHaveBeenCalledTimes(1);
    expect(onOpenChange.mock.calls).toEqual([[false]]);
    expect(view.container.querySelector(".content")).toBeNull();
  });
});
