import type { ReactNode } from "@lynx-js/react";

import { render } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

const dialogMocks = vi.hoisted(() => ({
  rootProps: [] as Array<Record<string, unknown>>,
  viewProps: [] as Array<Record<string, unknown>>,
  backdropProps: [] as Array<Record<string, unknown>>,
  contentProps: [] as Array<Record<string, unknown>>,
  closeProps: [] as Array<Record<string, unknown>>,
}));

vi.mock("@lynx-js/lynx-ui-dialog", () => {
  const renderChildren = (children: unknown, status: Record<string, boolean>): ReactNode => {
    if (typeof children === "function") {
      return (children as (status: Record<string, boolean>) => ReactNode)(status);
    }
    return children as ReactNode;
  };

  const DialogRoot = (props: Record<string, unknown>) => {
    dialogMocks.rootProps.push(props);
    return <>{renderChildren(props["children"], { open: props["show"] === true })}</>;
  };
  DialogRoot.displayName = "MockDialogRoot";

  const DialogTrigger = (props: Record<string, unknown>) => (
    <view>{renderChildren(props["children"], { active: false, busy: false })}</view>
  );
  DialogTrigger.displayName = "MockDialogTrigger";

  const DialogView = (props: Record<string, unknown>) => {
    dialogMocks.viewProps.push(props);
    return (
      <view className={props["className"] as string}>
        {renderChildren(props["children"], { open: props["show"] === true })}
      </view>
    );
  };
  DialogView.displayName = "MockDialogView";

  const DialogBackdrop = (props: Record<string, unknown>) => {
    dialogMocks.backdropProps.push(props);
    return <view className={props["className"] as string}>{props["children"] as ReactNode}</view>;
  };
  DialogBackdrop.displayName = "MockDialogBackdrop";

  const DialogContent = (props: Record<string, unknown>) => {
    dialogMocks.contentProps.push(props);
    return <view className={props["className"] as string}>{props["children"] as ReactNode}</view>;
  };
  DialogContent.displayName = "MockDialogContent";

  const DialogClose = (props: Record<string, unknown>) => {
    dialogMocks.closeProps.push(props);
    return <view>{renderChildren(props["children"], { active: false, busy: false })}</view>;
  };
  DialogClose.displayName = "MockDialogClose";

  return {
    DialogBackdrop,
    DialogClose,
    DialogContent,
    DialogRoot,
    DialogTrigger,
    DialogView,
  };
});

import * as Dialog from "./Dialog.namespace";

describe("Dialog", () => {
  beforeEach(() => {
    dialogMocks.rootProps = [];
    dialogMocks.viewProps = [];
    dialogMocks.backdropProps = [];
    dialogMocks.contentProps = [];
    dialogMocks.closeProps = [];
  });

  it("maps the namespace API to the Lynx UI headless primitives", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <Dialog.Root open onOpenChange={onOpenChange}>
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
            <Dialog.Body className="custom-body" style={{ maxHeight: "120px" }}>
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

    expect(dialogMocks.rootProps.at(-1)).toMatchObject({
      show: true,
      onShowChange: onOpenChange,
    });
    expect(container.querySelector(".seed-content-dialog__positioner")).not.toBeNull();
    expect(container.querySelector(".seed-content-dialog__backdrop")).not.toBeNull();
    expect(container.querySelector(".seed-content-dialog__content")).not.toBeNull();
    expect(container.querySelector(".seed-content-dialog__header")).not.toBeNull();
    expect(container.querySelector(".seed-content-dialog__title")).not.toBeNull();
    expect(container.querySelector(".seed-content-dialog__description")).not.toBeNull();
    expect(container.querySelector(".seed-content-dialog__footer")).not.toBeNull();

    const body = container.querySelector<HTMLElement>("scroll-view");

    expect(body?.classList.contains("seed-content-dialog__body")).toBe(true);
    expect(body?.classList.contains("custom-body")).toBe(true);
    expect(body?.hasAttribute("scroll-y")).toBe(true);
    expect(body?.style.maxHeight).toBe("120px");
  });

  it("forwards headless mount options and removes only reserved lifecycle handlers", () => {
    const userBindTap = vi.fn();
    const dialogContentProps = {
      style: { paddingTop: "12px" },
      bindtap: userBindTap,
    };

    render(
      <Dialog.Root defaultOpen forceMount skipAnimation>
        <Dialog.Positioner
          container="window"
          overlayLevel={2}
          dialogViewProps={{ style: { top: "8px" } }}
        >
          <Dialog.Backdrop />
          <Dialog.Content dialogContentProps={dialogContentProps} />
        </Dialog.Positioner>
      </Dialog.Root>,
    );

    expect(dialogMocks.rootProps.at(-1)).toMatchObject({
      defaultShow: true,
      forceMount: true,
    });
    expect(dialogMocks.viewProps.at(-1)).toMatchObject({
      container: "window",
      overlayLevel: 2,
      transition: false,
      dialogViewProps: { style: { top: "8px" } },
    });
    expect(dialogMocks.contentProps.at(-1)).toMatchObject({
      transition: false,
      dialogContentProps: { style: { paddingTop: "12px" } },
    });
    expect(dialogMocks.contentProps.at(-1)?.["dialogContentProps"]).not.toHaveProperty("bindtap");
    expect(userBindTap).not.toHaveBeenCalled();
  });
});
