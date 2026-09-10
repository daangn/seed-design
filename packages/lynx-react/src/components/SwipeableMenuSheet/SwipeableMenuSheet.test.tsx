import { fireEvent, render } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LynxPressableProps } from "../../types";

const sheetMocks = vi.hoisted(() => ({
  contentProps: [] as Array<Record<string, unknown>>,
  rootProps: [] as Array<Record<string, unknown>>,
  rootRef: {
    close: vi.fn(),
    open: vi.fn(),
  },
}));

vi.mock("@lynx-js/lynx-ui-sheet", async () => {
  const React = await vi.importActual<typeof import("@lynx-js/react")>("@lynx-js/react");

  const SheetRoot = React.forwardRef<
    unknown,
    Record<string, unknown> & { children?: React.ReactNode }
  >((props, ref) => {
    sheetMocks.rootProps.push(props);
    React.useImperativeHandle(ref, () => sheetMocks.rootRef);
    return <>{props["children"]}</>;
  });
  SheetRoot.displayName = "MockSheetRoot";

  const SheetView = React.forwardRef<unknown, { children?: React.ReactNode }>((props) => {
    return <>{props.children}</>;
  });
  SheetView.displayName = "MockSheetView";

  const SheetContent = React.forwardRef<
    unknown,
    Record<string, unknown> & { children?: React.ReactNode }
  >((props) => {
    sheetMocks.contentProps.push(props);
    return <>{props["children"]}</>;
  });
  SheetContent.displayName = "MockSheetContent";

  const SheetBackdrop = (
    props: Record<string, unknown> & {
      children?: React.ReactNode;
      onClick?: () => void;
    },
  ) => {
    const handlers: Pick<LynxPressableProps, "bindtap"> = {
      bindtap: props["onClick"],
    };

    return <view {...handlers}>{props["children"]}</view>;
  };

  const SheetHandle = (props: Record<string, unknown> & { children?: React.ReactNode }) => {
    return <view className={props["className"] as string}>{props["children"]}</view>;
  };

  return { SheetBackdrop, SheetContent, SheetHandle, SheetRoot, SheetView };
});

vi.mock("../../hooks/useSafeArea", () => ({
  useSafeArea: () => ({ safeAreaInsetBottom: "34px", safeAreaInsetTop: "0px" }),
}));

import * as SwipeableMenuSheet from "./SwipeableMenuSheet.namespace";

describe("SwipeableMenuSheet", () => {
  beforeEach(() => {
    sheetMocks.contentProps = [];
    sheetMocks.rootProps = [];
    sheetMocks.rootRef.close.mockClear();
    sheetMocks.rootRef.open.mockClear();
  });

  it("fixes the engine to a bottom, fit-height sheet", () => {
    render(
      <SwipeableMenuSheet.Root forceMount>
        <SwipeableMenuSheet.Positioner>
          <SwipeableMenuSheet.Content />
        </SwipeableMenuSheet.Positioner>
      </SwipeableMenuSheet.Root>,
    );

    expect(sheetMocks.rootProps.at(-1)).toMatchObject({
      forceMount: true,
      side: "bottom",
      snapPoints: ["fit"],
    });
  });

  it("exposes the Trigger as an accessible button", () => {
    const { getByText } = render(
      <SwipeableMenuSheet.Root>
        <SwipeableMenuSheet.Trigger>
          <text>Open</text>
        </SwipeableMenuSheet.Trigger>
      </SwipeableMenuSheet.Root>,
    );

    const trigger = (getByText("Open") as HTMLElement).parentElement;
    if (!trigger) throw new Error("Expected menu sheet trigger.");

    expect(trigger.getAttribute("accessibility-element")).to.equal("true");
    expect(trigger.hasAttribute("accessibility-role-description")).to.equal(true);
    expect(trigger.getAttribute("accessibility-role-description")).to.equal("button");
  });

  it("keeps outer and inner Content classes separate while preserving safe-area padding", () => {
    render(
      <SwipeableMenuSheet.Root>
        <SwipeableMenuSheet.Content
          accessibility-label="Menu options"
          className="outer"
          innerClassName="inner"
          innerStyle={{ paddingTop: "8px" }}
        />
      </SwipeableMenuSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      "accessibility-label": "Menu options",
      className: expect.stringContaining("outer"),
      innerClassName: expect.stringContaining("inner"),
      innerStyle: {
        paddingBottom: "calc(16px + 34px)",
        display: "flex",
        flexDirection: "column",
        minHeight: "0",
        paddingTop: "8px",
      },
    });
  });

  it("records trigger and close button reasons without dropping user handlers", () => {
    const onOpenChange = vi.fn();
    const onTriggerTap = vi.fn();
    const onCloseTap = vi.fn();
    const { getByText } = render(
      <SwipeableMenuSheet.Root onOpenChange={onOpenChange}>
        <SwipeableMenuSheet.Trigger bindtap={onTriggerTap}>
          <text>Open</text>
        </SwipeableMenuSheet.Trigger>
        <SwipeableMenuSheet.CloseButton bindtap={onCloseTap}>Close</SwipeableMenuSheet.CloseButton>
      </SwipeableMenuSheet.Root>,
    );

    const trigger = (getByText("Open") as HTMLElement).parentElement;
    const closeButtonLabel = getByText("Close") as HTMLElement;
    const closeButton = closeButtonLabel.parentElement;
    if (!trigger || !closeButton || closeButtonLabel.tagName.toLowerCase() !== "text") {
      throw new Error("Expected menu sheet controls with a native close button label.");
    }

    expect(closeButtonLabel.className).toContain("seed-menu-sheet__closeButtonLabel");

    fireEvent.tap(trigger);
    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith();
    expect(onTriggerTap).toHaveBeenCalledOnce();
    (sheetMocks.rootProps.at(-1)?.["onShowChange"] as (open: boolean) => void)(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(true, { reason: "trigger" });

    fireEvent.tap(closeButton);
    expect(sheetMocks.rootRef.close).toHaveBeenCalledWith();
    expect(onCloseTap).toHaveBeenCalledOnce();
    (sheetMocks.rootProps.at(-1)?.["onShowChange"] as (open: boolean) => void)(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false, { reason: "closeButton" });
  });

  it("uses an outside-interaction reason for a closing backdrop", () => {
    const onOpenChange = vi.fn();
    const { getByText } = render(
      <SwipeableMenuSheet.Root onOpenChange={onOpenChange}>
        <SwipeableMenuSheet.Backdrop>
          <text>Dismiss</text>
        </SwipeableMenuSheet.Backdrop>
      </SwipeableMenuSheet.Root>,
    );

    const backdrop = (getByText("Dismiss") as HTMLElement).parentElement;
    if (!backdrop) throw new Error("Expected backdrop element.");
    fireEvent.tap(backdrop);
    (sheetMocks.rootProps.at(-1)?.["onShowChange"] as (open: boolean) => void)(false);

    expect(sheetMocks.rootRef.close).toHaveBeenCalledWith();
    expect(onOpenChange).toHaveBeenCalledWith(false, { reason: "interactOutside" });
  });

  it("inherits label alignment, supports wrapped items, omits the final divider, and leaves item taps open", () => {
    const onItemTap = vi.fn();
    function WrappedItem() {
      return (
        <SwipeableMenuSheet.Item bindtap={onItemTap}>
          <SwipeableMenuSheet.ItemContent>
            <SwipeableMenuSheet.ItemLabel>First item</SwipeableMenuSheet.ItemLabel>
          </SwipeableMenuSheet.ItemContent>
        </SwipeableMenuSheet.Item>
      );
    }

    const { container, getByText } = render(
      <SwipeableMenuSheet.Root>
        <SwipeableMenuSheet.Content labelAlign="center">
          <SwipeableMenuSheet.List>
            <SwipeableMenuSheet.Group labelAlign="left">
              <WrappedItem />
              <SwipeableMenuSheet.Item labelAlign="center">
                <SwipeableMenuSheet.ItemContent>
                  <SwipeableMenuSheet.ItemLabel>Second item</SwipeableMenuSheet.ItemLabel>
                </SwipeableMenuSheet.ItemContent>
              </SwipeableMenuSheet.Item>
            </SwipeableMenuSheet.Group>
          </SwipeableMenuSheet.List>
        </SwipeableMenuSheet.Content>
      </SwipeableMenuSheet.Root>,
    );

    expect(container.querySelectorAll(".seed-menu-sheet-item__divider")).toHaveLength(1);
    expect(
      (getByText("First item") as HTMLElement).parentElement?.parentElement?.className,
    ).toContain("labelAlign_left");
    expect(
      (getByText("Second item") as HTMLElement).parentElement?.parentElement?.className,
    ).toContain("labelAlign_center");

    const item = (getByText("First item") as HTMLElement).parentElement?.parentElement;
    if (!item) throw new Error("Expected menu sheet item.");
    fireEvent.tap(item);

    expect(onItemTap).toHaveBeenCalledOnce();
    expect(sheetMocks.rootRef.close).not.toHaveBeenCalled();
  });

  it("maps skipAnimation to both trigger and content motion behavior", () => {
    const { getByText } = render(
      <SwipeableMenuSheet.Root skipAnimation>
        <SwipeableMenuSheet.Trigger>
          <text>Open without motion</text>
        </SwipeableMenuSheet.Trigger>
        <SwipeableMenuSheet.Content />
      </SwipeableMenuSheet.Root>,
    );

    const trigger = (getByText("Open without motion") as HTMLElement).parentElement;
    if (!trigger) throw new Error("Expected trigger element.");
    fireEvent.tap(trigger);

    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith({ animate: false });
    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      innerStyle: {
        paddingBottom: "calc(16px + 34px)",
      },
      snapAnimation: { type: "tween", duration: 0 },
      enterAnimation: { type: "tween", duration: 0 },
      exitAnimation: { type: "tween", duration: 0 },
    });
  });
});
