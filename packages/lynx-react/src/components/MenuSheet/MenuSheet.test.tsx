import { fireEvent, render } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LynxPressableProps } from "../../types";

const sheetMocks = vi.hoisted(() => {
  // lynx-ui-sheet의 imperative handle처럼 열림 값이 바뀌면 같은 호출 안에서 `onShowChange`를 부른다.
  const engine = { show: false, onShowChange: undefined as ((open: boolean) => void) | undefined };
  const change = (next: boolean) => {
    if (next === engine.show) return;
    engine.show = next;
    engine.onShowChange?.(next);
  };
  return {
    contentProps: [] as Array<Record<string, unknown>>,
    rootProps: [] as Array<Record<string, unknown>>,
    engine,
    rootRef: {
      close: vi.fn((_options?: unknown) => change(false)),
      open: vi.fn((_options?: unknown) => change(true)),
    },
  };
});

vi.mock("@lynx-js/lynx-ui-sheet", async () => {
  const React = await vi.importActual<typeof import("@lynx-js/react")>("@lynx-js/react");

  const SheetRoot = React.forwardRef<
    unknown,
    Record<string, unknown> & { children?: React.ReactNode }
  >((props, ref) => {
    sheetMocks.rootProps.push(props);
    sheetMocks.engine.onShowChange = props["onShowChange"] as (open: boolean) => void;
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

import * as MenuSheet from "./MenuSheet.namespace";

describe("MenuSheet", () => {
  beforeEach(() => {
    sheetMocks.contentProps = [];
    sheetMocks.rootProps = [];
    sheetMocks.engine.show = false;
    sheetMocks.rootRef.close.mockClear();
    sheetMocks.rootRef.open.mockClear();
  });

  it("fixes the engine to a bottom, fit-height sheet", () => {
    render(
      <MenuSheet.Root forceMount>
        <MenuSheet.Positioner>
          <MenuSheet.Content />
        </MenuSheet.Positioner>
      </MenuSheet.Root>,
    );

    expect(sheetMocks.rootProps.at(-1)).toMatchObject({
      forceMount: true,
      side: "bottom",
      snapPoints: ["fit"],
    });
  });

  it("exposes the Trigger as an accessible button", () => {
    const { getByText } = render(
      <MenuSheet.Root>
        <MenuSheet.Trigger>
          <text>Open</text>
        </MenuSheet.Trigger>
      </MenuSheet.Root>,
    );

    const trigger = (getByText("Open") as HTMLElement).parentElement;
    if (!trigger) throw new Error("Expected menu sheet trigger.");

    expect(trigger.getAttribute("accessibility-element")).to.equal("true");
    expect(trigger.hasAttribute("accessibility-role-description")).to.equal(true);
    expect(trigger.getAttribute("accessibility-role-description")).to.equal("button");
  });

  it("keeps outer and inner Content classes separate while preserving safe-area padding", () => {
    render(
      <MenuSheet.Root>
        <MenuSheet.Content
          accessibility-label="Menu options"
          className="outer"
          innerClassName="inner"
          innerStyle={{ paddingTop: "8px" }}
        />
      </MenuSheet.Root>,
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

  it("reports trigger, close button and backdrop reasons without dropping user handlers", () => {
    const onOpenChange = vi.fn();
    const onTriggerTap = vi.fn();
    const onCloseTap = vi.fn();
    const { getByText } = render(
      <MenuSheet.Root onOpenChange={onOpenChange}>
        <MenuSheet.Trigger bindtap={onTriggerTap}>
          <text>Open</text>
        </MenuSheet.Trigger>
        <MenuSheet.Backdrop>
          <text>Dismiss</text>
        </MenuSheet.Backdrop>
        <MenuSheet.CloseButton bindtap={onCloseTap}>Close</MenuSheet.CloseButton>
      </MenuSheet.Root>,
    );

    const trigger = (getByText("Open") as HTMLElement).parentElement;
    const backdrop = (getByText("Dismiss") as HTMLElement).parentElement;
    const closeButtonLabel = getByText("Close") as HTMLElement;
    const closeButton = closeButtonLabel.parentElement;
    if (
      !trigger ||
      !backdrop ||
      !closeButton ||
      closeButtonLabel.tagName.toLowerCase() !== "text"
    ) {
      throw new Error("Expected menu sheet controls with a native close button label.");
    }

    expect(closeButtonLabel.className).toContain("seed-menu-sheet__closeButtonLabel");

    fireEvent.tap(trigger);
    fireEvent.tap(closeButton);
    fireEvent.tap(trigger);
    fireEvent.tap(backdrop);

    expect(onOpenChange.mock.calls).toEqual([
      [true, { reason: "trigger" }],
      [false, { reason: "closeButton" }],
      [true, { reason: "trigger" }],
      [false, { reason: "interactOutside" }],
    ]);
    expect(onTriggerTap).toHaveBeenCalledTimes(2);
    expect(onCloseTap).toHaveBeenCalledOnce();
  });

  it("inherits label alignment, supports wrapped items, draws the divider inside every item but the last, and leaves item taps open", () => {
    const onItemTap = vi.fn();
    function WrappedItem() {
      return (
        <MenuSheet.Item bindtap={onItemTap}>
          <MenuSheet.ItemContent>
            <MenuSheet.ItemLabel>First item</MenuSheet.ItemLabel>
          </MenuSheet.ItemContent>
        </MenuSheet.Item>
      );
    }

    const { container, getByText } = render(
      <MenuSheet.Root>
        <MenuSheet.Content labelAlign="center">
          <MenuSheet.List>
            <MenuSheet.Group labelAlign="left">
              <WrappedItem />
              <MenuSheet.Item labelAlign="center">
                <MenuSheet.ItemContent>
                  <MenuSheet.ItemLabel>Second item</MenuSheet.ItemLabel>
                </MenuSheet.ItemContent>
              </MenuSheet.Item>
            </MenuSheet.Group>
          </MenuSheet.List>
        </MenuSheet.Content>
      </MenuSheet.Root>,
    );

    const dividers = container.querySelectorAll(".seed-menu-sheet-item__divider");
    expect(dividers).toHaveLength(1);
    expect(
      (getByText("First item") as HTMLElement).parentElement?.parentElement?.className,
    ).toContain("labelAlign_left");
    expect(
      (getByText("Second item") as HTMLElement).parentElement?.parentElement?.className,
    ).toContain("labelAlign_center");

    const item = (getByText("First item") as HTMLElement).closest<HTMLElement>(
      ".seed-menu-sheet-item__root",
    );
    if (!item) throw new Error("Expected menu sheet item.");
    // 반투명 stroke가 Group 배경이 아니라 Item 배경 위에 겹치도록 Item 안에 둔다.
    expect(dividers[0] && item.contains(dividers[0])).toBe(true);
    fireEvent.tap(item);

    expect(onItemTap).toHaveBeenCalledOnce();
    expect(sheetMocks.rootRef.close).not.toHaveBeenCalled();
  });

  it("maps skipAnimation to both trigger and content motion behavior", () => {
    const { getByText } = render(
      <MenuSheet.Root skipAnimation>
        <MenuSheet.Trigger>
          <text>Open without motion</text>
        </MenuSheet.Trigger>
        <MenuSheet.Content />
      </MenuSheet.Root>,
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

  it("keeps item backgrounds outside the scale target and scales the whole close button", () => {
    const { getByText } = render(
      <MenuSheet.Root>
        <MenuSheet.Item>
          <MenuSheet.ItemLabel>Choice</MenuSheet.ItemLabel>
        </MenuSheet.Item>
        <MenuSheet.CloseButton>Close feedback</MenuSheet.CloseButton>
      </MenuSheet.Root>,
    );
    const target = (getByText("Choice") as HTMLElement).parentElement!;
    expect(target.classList.contains("seed-menu-sheet-item__scaleContent")).toBe(true);
    expect(target.getAttribute("flatten")).toBe("false");
    expect(target.parentElement!.classList.contains("seed-menu-sheet-item__root")).toBe(true);
    expect(target.parentElement!.hasAttribute("flatten")).toBe(false);
    const close = (getByText("Close feedback") as HTMLElement).parentElement!;
    expect(close.classList.contains("seed-menu-sheet__closeButton")).toBe(true);
    expect(close.getAttribute("flatten")).toBe("false");
  });
});
