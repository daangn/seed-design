import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const dialogViewStyles = vi.hoisted(() => [] as Array<Record<string, unknown> | undefined>);

vi.mock("@lynx-js/lynx-ui-dialog", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@lynx-js/lynx-ui-dialog")>();
  const DialogView = (props: Parameters<typeof actual.DialogView>[0]) => {
    dialogViewStyles.push(props.style as Record<string, unknown> | undefined);

    return <actual.DialogView {...props} />;
  };

  return { ...actual, DialogView };
});

import * as AlertDialog from "./AlertDialog.namespace";
import { ActionButton } from "../ActionButton";

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

interface TestLynxGlobal {
  lynx?: {
    __globalProps?: {
      safeAreaInsetTop?: number;
      safeAreaInsetRight?: number;
      safeAreaInsetBottom?: number;
      safeAreaInsetLeft?: number;
    };
  };
  lynxTestingEnv?: {
    backgroundThread: { globalThis: TestLynxGlobal };
    mainThread: { globalThis: TestLynxGlobal };
  };
}

function setGlobalProps(
  globalProps: NonNullable<NonNullable<TestLynxGlobal["lynx"]>["__globalProps"]>,
) {
  const lynxTestingEnv = (globalThis as TestLynxGlobal).lynxTestingEnv;
  const globals = [
    globalThis as TestLynxGlobal,
    lynxTestingEnv?.backgroundThread.globalThis,
    lynxTestingEnv?.mainThread.globalThis,
  ].filter((global): global is TestLynxGlobal => Boolean(global));

  for (const global of globals) {
    global.lynx = { ...global.lynx, __globalProps: globalProps };
  }
}

function renderPositioner(props?: Omit<AlertDialog.PositionerProps, "children">) {
  render(
    <AlertDialog.Root open>
      <AlertDialog.Positioner {...props}>
        <AlertDialog.Backdrop />
        <AlertDialog.Content />
      </AlertDialog.Positioner>
    </AlertDialog.Root>,
  );

  return dialogViewStyles.at(-1);
}

describe("AlertDialog", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    installAnimationFrames();
  });

  afterEach(() => {
    vi.useRealTimers();
    setGlobalProps({});
  });

  it("owns the trigger label while preserving its nested button's visual content", () => {
    const { container, rerender } = render(
      <AlertDialog.Root>
        <AlertDialog.Trigger className="trigger">
          <ActionButton>열기</ActionButton>
        </AlertDialog.Trigger>
      </AlertDialog.Root>,
    );
    const trigger = container.querySelector('.trigger > view[accessibility-element="true"]');
    expect(trigger?.getAttribute("accessibility-label")).toBe("열기");
    expect(trigger?.getAttribute("accessibility-role-description")).toBe("button");
    expect(trigger?.getAttribute("flatten")).toBe("false");
    expect(
      trigger?.querySelector(".seed-action-button__root")?.getAttribute("accessibility-element"),
    ).toBe("false");

    rerender(
      <AlertDialog.Root>
        <AlertDialog.Trigger className="trigger" accessibility-label="확인 창 열기">
          {({ busy }) => <ActionButton>{busy ? "Wait" : "Open"}</ActionButton>}
        </AlertDialog.Trigger>
      </AlertDialog.Root>,
    );
    const namedTrigger = container.querySelector('.trigger > view[accessibility-element="true"]');
    expect(namedTrigger?.getAttribute("accessibility-label")).toBe("확인 창 열기");
    expect(namedTrigger?.textContent).toBe("Open");
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

  it("keeps the content view out of the accessibility tree so its parts stay exposed", () => {
    const { container } = render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Content>
            <AlertDialog.Title>Title</AlertDialog.Title>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );
    flushPresence();

    const content = container.querySelector(".seed-alert-dialog__content");
    expect(content?.hasAttribute("accessibility-element")).toBe(false);
    expect(content?.hasAttribute("accessibility-role-description")).toBe(false);
    expect(
      container.querySelector(".seed-alert-dialog__title")?.getAttribute("accessibility-heading"),
    ).toBe("true");

    const { container: overridden } = render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Content
            accessibility-element={true}
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
    expect(overriddenContent?.getAttribute("accessibility-element")).toBe("true");
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

  it("pads the positioner by the side insets and the larger block inset on both sides", () => {
    setGlobalProps({
      safeAreaInsetTop: 0,
      safeAreaInsetRight: 84,
      safeAreaInsetBottom: 34,
      safeAreaInsetLeft: 0,
    });

    expect(renderPositioner()).toEqual({
      paddingTop: "calc(env(safe-area-inset-top) + 34px)",
      paddingRight: "84px",
      paddingBottom: "calc(env(safe-area-inset-top) + 34px)",
      paddingLeft: "0px",
    });

    setGlobalProps({
      safeAreaInsetTop: 47,
      safeAreaInsetRight: 0,
      safeAreaInsetBottom: 34,
      safeAreaInsetLeft: 59,
    });

    expect(renderPositioner()).toEqual({
      paddingTop: "47px",
      paddingRight: "0px",
      paddingBottom: "47px",
      paddingLeft: "59px",
    });
  });

  it("keeps the safe area padding in a container and lets the positioner style override it", () => {
    setGlobalProps({ safeAreaInsetTop: 47, safeAreaInsetBottom: 34, safeAreaInsetLeft: 59 });

    expect(renderPositioner({ container: "window" })).toEqual({
      paddingTop: "47px",
      paddingRight: "env(safe-area-inset-right)",
      paddingBottom: "47px",
      paddingLeft: "59px",
      width: "100%",
      height: "100%",
    });
    expect(renderPositioner({ style: { paddingLeft: "0px", opacity: 0.5 } })).toMatchObject({
      paddingLeft: "0px",
      opacity: 0.5,
    });
  });

  it("wraps the content children in a vertical scroll area", () => {
    const { container } = render(
      <AlertDialog.Root open>
        <AlertDialog.Positioner>
          <AlertDialog.Content>
            <AlertDialog.Header>
              <AlertDialog.Title>Title</AlertDialog.Title>
            </AlertDialog.Header>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );

    const scrollArea = container.querySelector(
      ".seed-alert-dialog__content > scroll-view.seed-alert-dialog__scrollArea",
    );
    expect(scrollArea?.getAttribute("scroll-orientation")).toBe("vertical");
    expect(
      scrollArea?.querySelector(
        ":scope > .seed-alert-dialog__scrollContent > .seed-alert-dialog__header",
      ),
    ).not.toBeNull();
  });
});
