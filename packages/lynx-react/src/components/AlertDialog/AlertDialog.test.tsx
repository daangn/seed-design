import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as AlertDialog from "./AlertDialog.namespace";

// Open/close transitions are covered in `@seed-design/lynx-react-dialog`. These tests cover the
// alert defaults layered on top of it against the real `@lynx-js/lynx-ui-dialog` engine.
// lynx-ui-presence advances with `lynx.requestAnimationFrame`, which the testing environment
// does not provide, so frames run on fake timers.
function installAnimationFrames() {
  const frames = {
    requestAnimationFrame: (callback: () => void) => setTimeout(callback, 16),
    cancelAnimationFrame: (id: number) => clearTimeout(id),
  };
  Object.assign(lynx, frames);
  Object.assign(lynxTestingEnv.backgroundThread["lynx"], frames);
  Object.assign(lynxTestingEnv.mainThread["lynx"], frames);
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

function tap(container: Element, selector: string) {
  const element = container.querySelector(selector);
  if (!element) throw new Error(`Expected ${selector} to be rendered.`);
  fireEvent.tap(element);
}

describe("AlertDialog", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installAnimationFrames();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens from Trigger, ignores Backdrop taps by default, and closes from Action", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <AlertDialog.Root onOpenChange={onOpenChange}>
        <AlertDialog.Trigger className="trigger">
          <text>Open</text>
        </AlertDialog.Trigger>
        <AlertDialog.Positioner>
          <AlertDialog.Backdrop />
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Title</AlertDialog.Title>
              <AlertDialog.Description>Description</AlertDialog.Description>
            </AlertDialog.Header>
            <AlertDialog.Footer>
              <AlertDialog.Action>
                <text>Confirm</text>
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );

    tap(container, ".trigger");
    flushPresence();

    expect(onOpenChange.mock.calls).toEqual([[true]]);
    for (const slot of [
      "positioner",
      "backdrop",
      "content",
      "header",
      "title",
      "description",
      "footer",
      "action",
    ]) {
      expect(container.querySelector(`.seed-alert-dialog__${slot}`)).not.toBeNull();
    }

    tap(container, ".seed-alert-dialog__backdrop");
    flushPresence();

    expect(onOpenChange.mock.calls).toEqual([[true]]);
    expect(container.querySelector(".seed-alert-dialog__content")).not.toBeNull();

    tap(container, ".seed-alert-dialog__action");
    flushPresence();

    expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
    expect(container.querySelector(".seed-alert-dialog__content")).toBeNull();
  });

  it("closes from the Backdrop only when clickToClose is set", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <AlertDialog.Root defaultOpen onOpenChange={onOpenChange}>
        <AlertDialog.Positioner>
          <AlertDialog.Backdrop clickToClose />
          <AlertDialog.Content />
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );
    flushPresence();

    tap(container, ".seed-alert-dialog__backdrop");
    flushPresence();

    expect(onOpenChange.mock.calls).toEqual([[false]]);
    expect(container.querySelector(".seed-alert-dialog__content")).toBeNull();
  });

  it("applies alert accessibility defaults to the content view and keeps consumer overrides", () => {
    const { container } = render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Content accessibility-label="Delete item">
            <AlertDialog.Title>Title</AlertDialog.Title>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );
    flushPresence();

    const content = container.querySelector(".seed-alert-dialog__content");
    expect(content?.getAttribute("accessibility-element")).toBe("true");
    expect(content?.getAttribute("accessibility-role-description")).toBe("alertdialog");
    expect(content?.getAttribute("accessibility-label")).toBe("Delete item");
    expect(
      container.querySelector(".seed-alert-dialog__title")?.getAttribute("accessibility-heading"),
    ).toBe("true");

    const { container: overridden } = render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Content
            accessibility-element={false}
            accessibility-role-description="custom dialog"
            dialogContentProps={{ "accessibility-label": "From native props" }}
            accessibility-label="From top-level props"
          >
            <AlertDialog.Title accessibility-heading={false}>Title</AlertDialog.Title>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );
    flushPresence();

    const overriddenContent = overridden.querySelector(".seed-alert-dialog__content");
    expect(overriddenContent?.getAttribute("accessibility-element")).toBe("false");
    expect(overriddenContent?.getAttribute("accessibility-role-description")).toBe("custom dialog");
    expect(overriddenContent?.getAttribute("accessibility-label")).toBe("From native props");
    expect(
      overridden.querySelector(".seed-alert-dialog__title")?.getAttribute("accessibility-heading"),
    ).toBe("false");
  });

  it("forwards native content callbacks", () => {
    const contentTap = vi.fn();
    const { container } = render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Content dialogContentProps={{ bindtap: contentTap }} />
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );
    flushPresence();

    tap(container, ".seed-alert-dialog__content");

    expect(contentTap).toHaveBeenCalledTimes(1);
  });
});
