import type { ReactNode } from "@lynx-js/react";

import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

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
  const DialogView = (props: Record<string, unknown>) => (
    <view className={props["className"] as string}>
      {renderChildren(props["children"], { open: props["show"] === true })}
    </view>
  );
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

describe("Dialog", () => {
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
});
