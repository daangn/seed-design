import type { ReactNode } from "@lynx-js/react";

import { render } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

const alertDialogMocks = vi.hoisted(() => ({
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
    alertDialogMocks.rootProps.push(props);
    return <>{renderChildren(props["children"], { open: props["show"] === true })}</>;
  };
  DialogRoot.displayName = "MockDialogRoot";

  const DialogTrigger = (props: Record<string, unknown>) => (
    <view>{renderChildren(props["children"], { active: false, busy: false })}</view>
  );
  DialogTrigger.displayName = "MockDialogTrigger";

  const DialogView = (props: Record<string, unknown>) => {
    alertDialogMocks.viewProps.push(props);
    return (
      <view className={props["className"] as string}>
        {renderChildren(props["children"], { open: props["show"] === true })}
      </view>
    );
  };
  DialogView.displayName = "MockDialogView";

  const DialogBackdrop = (props: Record<string, unknown>) => {
    alertDialogMocks.backdropProps.push(props);
    return <view className={props["className"] as string}>{props["children"] as ReactNode}</view>;
  };
  DialogBackdrop.displayName = "MockDialogBackdrop";

  const DialogContent = (props: Record<string, unknown>) => {
    alertDialogMocks.contentProps.push(props);
    return <view className={props["className"] as string}>{props["children"] as ReactNode}</view>;
  };
  DialogContent.displayName = "MockDialogContent";

  const DialogClose = (props: Record<string, unknown>) => {
    alertDialogMocks.closeProps.push(props);
    return (
      <view className={props["className"] as string}>
        {renderChildren(props["children"], { active: false, busy: false })}
      </view>
    );
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

import * as AlertDialog from "./AlertDialog.namespace";

describe("AlertDialog", () => {
  beforeEach(() => {
    alertDialogMocks.rootProps = [];
    alertDialogMocks.viewProps = [];
    alertDialogMocks.backdropProps = [];
    alertDialogMocks.contentProps = [];
    alertDialogMocks.closeProps = [];
  });

  it("maps the namespace API and applies dialog recipe classes", () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <AlertDialog.Root open onOpenChange={onOpenChange}>
        <AlertDialog.Trigger>
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
                <text>Cancel</text>
              </AlertDialog.Action>
            </AlertDialog.Footer>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );

    expect(alertDialogMocks.rootProps.at(-1)).toMatchObject({
      show: true,
      onShowChange: onOpenChange,
    });
    expect(container.querySelector(".seed-alert-dialog__positioner")).not.toBeNull();
    expect(container.querySelector(".seed-alert-dialog__backdrop")).not.toBeNull();
    expect(container.querySelector(".seed-alert-dialog__content")).not.toBeNull();
    expect(container.querySelector(".seed-alert-dialog__header")).not.toBeNull();
    expect(container.querySelector(".seed-alert-dialog__title")).not.toBeNull();
    expect(container.querySelector(".seed-alert-dialog__description")).not.toBeNull();
    expect(container.querySelector(".seed-alert-dialog__footer")).not.toBeNull();
    expect(container.querySelector(".seed-alert-dialog__action")).not.toBeNull();
  });

  it("does not dismiss from the backdrop by default and preserves explicit overrides", () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Backdrop />
          <AlertDialog.Content />
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );

    expect(alertDialogMocks.backdropProps.at(-1)).toHaveProperty("clickToClose", false);

    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Backdrop clickToClose />
          <AlertDialog.Content />
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );

    expect(alertDialogMocks.backdropProps.at(-1)).toHaveProperty("clickToClose", true);
  });

  it("provides alert dialog accessibility defaults and preserves consumer overrides", () => {
    const { container } = render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Backdrop />
          <AlertDialog.Content>
            <AlertDialog.Title>Title</AlertDialog.Title>
          </AlertDialog.Content>
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );

    expect(alertDialogMocks.contentProps.at(-1)?.["dialogContentProps"]).toMatchObject({
      "accessibility-element": true,
      "accessibility-role-description": "alertdialog",
    });
    expect(container.querySelector("text")?.getAttribute("accessibility-heading")).toBe("true");

    const { container: overriddenContainer } = render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Positioner>
          <AlertDialog.Content
            accessibility-element={false}
            accessibility-role-description="custom dialog"
          />
          <AlertDialog.Title accessibility-heading={false}>Title</AlertDialog.Title>
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );

    expect(alertDialogMocks.contentProps.at(-1)?.["dialogContentProps"]).toMatchObject({
      "accessibility-element": false,
      "accessibility-role-description": "custom dialog",
    });
    const overriddenTexts = overriddenContainer.querySelectorAll("text");
    expect(
      overriddenTexts.item(overriddenTexts.length - 1)?.getAttribute("accessibility-heading"),
    ).toBe("false");
  });

  it("disables transitions with skipAnimation and removes reserved lifecycle handlers", () => {
    const userBindTap = vi.fn();
    const dialogContentProps = {
      style: { paddingTop: "12px" },
      bindtap: userBindTap,
    };

    render(
      <AlertDialog.Root defaultOpen forceMount skipAnimation>
        <AlertDialog.Positioner container="window" overlayLevel={2} style={{ width: "80%" }}>
          <AlertDialog.Backdrop />
          <AlertDialog.Content dialogContentProps={dialogContentProps} />
        </AlertDialog.Positioner>
      </AlertDialog.Root>,
    );

    expect(alertDialogMocks.rootProps.at(-1)).toMatchObject({
      defaultShow: true,
      forceMount: true,
    });
    expect(alertDialogMocks.viewProps.at(-1)).toMatchObject({
      container: "window",
      overlayLevel: 2,
      style: { width: "80%", height: "100%" },
      transition: false,
    });
    expect(alertDialogMocks.backdropProps.at(-1)).toMatchObject({ transition: false });
    expect(alertDialogMocks.contentProps.at(-1)).toMatchObject({ transition: false });
    expect(alertDialogMocks.contentProps.at(-1)?.["dialogContentProps"]).toMatchObject({
      style: { paddingTop: "12px" },
      "accessibility-element": true,
      "accessibility-role-description": "alertdialog",
    });
    expect(alertDialogMocks.contentProps.at(-1)?.["dialogContentProps"]).not.toHaveProperty(
      "bindtap",
    );
    expect(userBindTap).not.toHaveBeenCalled();
  });
});
