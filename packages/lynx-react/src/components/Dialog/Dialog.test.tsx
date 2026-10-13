import type { ReactNode } from "@lynx-js/react";

import { render } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

const dialogViewStyles = vi.hoisted(() => [] as unknown[]);

// Open/close behavior is covered against the real engine in `@seed-design/lynx-react-dialog`.
// This mock renders every part immediately so the SEED slots can be inspected.
vi.mock("@lynx-js/lynx-ui-dialog", () => {
  const renderChildren = (children: unknown, status: Record<string, boolean>): ReactNode => {
    if (typeof children === "function") {
      return (children as (status: Record<string, boolean>) => ReactNode)(status);
    }
    return children as ReactNode;
  };

  const DialogRoot = (props: Record<string, unknown>) => (
    <>{renderChildren(props["children"], { open: props["show"] === true })}</>
  );
  const DialogButton = (props: Record<string, unknown>) => (
    <view className={props["className"] as string}>
      {renderChildren(props["children"], { active: false, busy: false })}
    </view>
  );
  const DialogView = (props: Record<string, unknown>) => {
    dialogViewStyles.push(props["style"]);

    return (
      <view className={props["className"] as string}>
        {renderChildren(props["children"], { open: props["show"] === true })}
      </view>
    );
  };
  const DialogPart = (props: Record<string, unknown>) => (
    <view className={props["className"] as string}>{props["children"] as ReactNode}</view>
  );

  return {
    DialogBackdrop: DialogPart,
    DialogClose: DialogButton,
    DialogContent: DialogPart,
    DialogRoot,
    DialogTrigger: DialogButton,
    DialogView,
  };
});

import * as Dialog from "./Dialog.namespace";
import { ActionButton } from "../ActionButton";

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

function renderPositioner(style?: Dialog.PositionerProps["style"]) {
  render(
    <Dialog.Root open>
      <Dialog.Positioner style={style}>
        <Dialog.Backdrop />
        <Dialog.Content />
      </Dialog.Positioner>
    </Dialog.Root>,
  );

  return dialogViewStyles.at(-1);
}

describe("Dialog", () => {
  it("owns the trigger label and hides the nested ActionButton from accessibility", () => {
    const { container, rerender } = render(
      <Dialog.Root>
        <Dialog.Trigger className="trigger">
          <ActionButton>열기</ActionButton>
        </Dialog.Trigger>
      </Dialog.Root>,
    );
    const trigger = container.querySelector('.trigger > view[accessibility-element="true"]');

    expect(trigger?.getAttribute("accessibility-label")).toBe("열기");
    expect(trigger?.getAttribute("accessibility-role-description")).toBe("button");
    expect(trigger?.getAttribute("flatten")).toBe("false");
    expect(
      trigger?.querySelector(".seed-action-button__root")?.getAttribute("accessibility-element"),
    ).toBe("false");

    rerender(
      <Dialog.Root>
        <Dialog.Trigger className="trigger" accessibility-label="다이얼로그 열기">
          {({ busy }) => <ActionButton>{busy ? "Wait" : "Open"}</ActionButton>}
        </Dialog.Trigger>
      </Dialog.Root>,
    );
    const namedTrigger = container.querySelector('.trigger > view[accessibility-element="true"]');
    expect(namedTrigger?.getAttribute("accessibility-label")).toBe("다이얼로그 열기");
    expect(namedTrigger?.textContent).toBe("Open");
  });

  afterEach(() => {
    setGlobalProps({});
  });

  it("applies SEED slots and renders Body as a vertical scroll-view", () => {
    const { container } = render(
      <Dialog.Root open>
        <Dialog.Trigger>
          <text>Open</text>
        </Dialog.Trigger>
        <Dialog.Positioner>
          <Dialog.Backdrop />
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Title</Dialog.Title>
              <Dialog.Description>Description</Dialog.Description>
            </Dialog.Header>
            <Dialog.Body
              className="custom-body"
              maxHeight="96px"
              paddingLeft="16px"
              style={{ maxHeight: "120px" }}
            >
              <text>Scrollable content</text>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.Action>
                <text>Close</text>
              </Dialog.Action>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>,
    );

    expect(container.querySelector(".seed-dialog__positioner")).not.toBeNull();
    expect(container.querySelector(".seed-dialog__backdrop")).not.toBeNull();
    expect(container.querySelector(".seed-dialog__content")).not.toBeNull();
    expect(container.querySelector(".seed-dialog__header")).not.toBeNull();
    expect(container.querySelector(".seed-dialog__title")).not.toBeNull();
    expect(container.querySelector(".seed-dialog__description")).not.toBeNull();
    expect(container.querySelector(".seed-dialog__footer")).not.toBeNull();
    expect(container.querySelector(".seed-dialog__action")).not.toBeNull();

    const body = container.querySelector<HTMLElement>("scroll-view");

    expect(body?.classList.contains("seed-dialog__body")).toBe(true);
    expect(body?.classList.contains("custom-body")).toBe(true);
    expect(body?.hasAttribute("scroll-y")).toBe(true);
    expect(body?.style.maxHeight).toBe("120px");
    expect(body?.style.paddingLeft).toBe("16px");
  });

  it("lets native Body props override scrolling defaults and computed style", () => {
    const { container } = render(
      <Dialog.Root>
        <Dialog.Body
          id="dialog-body"
          scroll-y={false}
          maxHeight="96px"
          style={{ maxHeight: "120px" }}
        >
          <text>Body content</text>
        </Dialog.Body>
      </Dialog.Root>,
    );
    const body = container.querySelector<HTMLElement>("#dialog-body");

    expect(body?.getAttribute("scroll-y")).toBe("false");
    expect(body?.style.maxHeight).toBe("120px");
    expect(body?.textContent).toBe("Body content");
  });

  it("pads the positioner by the side insets and the larger block inset on both sides", () => {
    setGlobalProps({
      safeAreaInsetTop: 47,
      safeAreaInsetRight: 0,
      safeAreaInsetBottom: 34,
      safeAreaInsetLeft: 59,
    });

    expect(renderPositioner()).toEqual({
      "--seed-safe-area-left": "59px",
      "--seed-safe-area-right": "0px",
      "--dialog-safe-area-block": "47px",
    });
  });

  it("adds the block insets when one of them falls back to env()", () => {
    setGlobalProps({ safeAreaInsetTop: 0, safeAreaInsetBottom: 34 });

    expect(renderPositioner()).toEqual({
      "--seed-safe-area-left": "env(safe-area-inset-left)",
      "--seed-safe-area-right": "env(safe-area-inset-right)",
      "--dialog-safe-area-block": "calc(env(safe-area-inset-top) + 34px)",
    });
  });

  it("lets the positioner style override the safe area variables", () => {
    setGlobalProps({ safeAreaInsetLeft: 59 });

    expect(
      renderPositioner({
        "--seed-safe-area-left": "0px",
        opacity: 0.5,
      } as Dialog.PositionerProps["style"]),
    ).toMatchObject({ "--seed-safe-area-left": "0px", opacity: 0.5 });
  });
});
