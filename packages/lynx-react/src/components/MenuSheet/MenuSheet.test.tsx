import { fireEvent, render } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LynxPressableProps } from "../../types";

const sheetMocks = vi.hoisted(() => ({
  contentProps: [] as Array<Record<string, unknown>>,
  rootProps: [] as Array<Record<string, unknown>>,
  triggerTap: vi.fn(),
  closeTap: vi.fn(),
}));

vi.mock("@seed-design/lynx-react-bottom-sheet", async () => {
  const React = await vi.importActual<typeof import("@lynx-js/react")>("@lynx-js/react");
  const Context = React.createContext({ skipAnimation: false });

  const BottomSheetRoot = (props: Record<string, unknown> & { children?: React.ReactNode }) => {
    sheetMocks.rootProps.push(props);
    return (
      <Context.Provider value={{ skipAnimation: props["skipAnimation"] === true }}>
        {props["children"]}
      </Context.Provider>
    );
  };

  const BottomSheetContent = (props: Record<string, unknown> & { children?: React.ReactNode }) => {
    sheetMocks.contentProps.push(props);
    return <>{props["children"]}</>;
  };

  const BottomSheetHandle = (props: Record<string, unknown> & { children?: React.ReactNode }) => (
    <view className={props["className"] as string}>{props["children"]}</view>
  );

  const BottomSheetBackdrop = (
    props: Record<string, unknown> & { children?: React.ReactNode; onClick?: () => void },
  ) => {
    const handlers: Pick<LynxPressableProps, "bindtap"> = { bindtap: props.onClick };
    return <view {...handlers}>{props["children"]}</view>;
  };

  return {
    BottomSheetRoot,
    BottomSheetContent,
    BottomSheetHandle,
    BottomSheetBackdrop,
    BottomSheetPositioner: (props: { children?: React.ReactNode }) => <>{props.children}</>,
    useBottomSheetContext: () => React.useContext(Context),
    useBottomSheetTrigger: () => ({ triggerProps: { bindtap: sheetMocks.triggerTap } }),
    useBottomSheetCloseButton: (props: Pick<LynxPressableProps, "bindtap"> = {}) => ({
      closeButtonProps: {
        bindtap: (...args: Parameters<NonNullable<LynxPressableProps["bindtap"]>>) => {
          sheetMocks.closeTap(...args);
          props.bindtap?.(...args);
        },
      },
    }),
  };
});

vi.mock("../../hooks/useSafeArea", () => ({
  useSafeArea: () => ({
    safeAreaInsetTop: "62px",
    safeAreaInsetRight: "84px",
    safeAreaInsetBottom: "34px",
    safeAreaInsetLeft: "0px",
  }),
}));

import * as MenuSheet from "./MenuSheet.namespace";
import { ActionButton } from "../ActionButton";

describe("MenuSheet", () => {
  beforeEach(() => {
    sheetMocks.contentProps = [];
    sheetMocks.rootProps = [];
    sheetMocks.triggerTap.mockClear();
    sheetMocks.closeTap.mockClear();
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

  it("forwards native Title props without dropping its text", () => {
    const { container, getByText } = render(
      <MenuSheet.Root>
        <MenuSheet.Title id="menu-title" accessibility-label="Menu heading" data-foo="title">
          Choose an action
        </MenuSheet.Title>
      </MenuSheet.Root>,
    );
    const title = container.querySelector("#menu-title");

    expect(title?.getAttribute("accessibility-label")).toBe("Menu heading");
    expect(title?.getAttribute("data-foo")).toBe("title");
    expect(getByText("Choose an action")).toBe(title);
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

  it("derives the trigger name without exposing its nested ActionButton twice", () => {
    const { container, rerender } = render(
      <MenuSheet.Root>
        <MenuSheet.Trigger id="sheet-trigger">
          <ActionButton>열기</ActionButton>
        </MenuSheet.Trigger>
      </MenuSheet.Root>,
    );
    const trigger = container.querySelector("#sheet-trigger");
    expect(trigger?.getAttribute("accessibility-label")).toBe("열기");
    expect(trigger?.getAttribute("flatten")).toBe("false");
    expect(
      trigger?.querySelector(".seed-action-button__root")?.getAttribute("accessibility-element"),
    ).toBe("false");

    rerender(
      <MenuSheet.Root>
        <MenuSheet.Trigger id="sheet-trigger" accessibility-label="작업 메뉴" flatten={true}>
          <ActionButton>열기</ActionButton>
        </MenuSheet.Trigger>
      </MenuSheet.Root>,
    );
    expect(container.querySelector("#sheet-trigger")?.getAttribute("accessibility-label")).toBe(
      "작업 메뉴",
    );
    expect(container.querySelector("#sheet-trigger")?.getAttribute("flatten")).toBe("true");
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

  it("keeps Content within the safe area insets with a single bottom inset", () => {
    render(
      <MenuSheet.Root>
        <MenuSheet.Content />
      </MenuSheet.Root>,
    );

    const contentProps = sheetMocks.contentProps.at(-1);

    expect(contentProps).toMatchObject({
      style: {
        width: "calc(100vw - 0px - 84px)",
        marginLeft: "0px",
        marginRight: "84px",
        paddingBottom: "calc(50vh + 62px)",
      },
      innerStyle: {
        flexShrink: 1,
        maxHeight: "calc(0.9 * 100vh)",
        paddingBottom: "calc(16px + 34px)",
      },
    });
  });

  it("renders the List as a vertical scroll-view around its laid-out content", () => {
    const { getByText } = render(
      <MenuSheet.Root>
        <MenuSheet.List className="custom-list">
          <MenuSheet.Group>
            <MenuSheet.Item>
              <MenuSheet.ItemLabel>Choice</MenuSheet.ItemLabel>
            </MenuSheet.Item>
          </MenuSheet.Group>
        </MenuSheet.List>
      </MenuSheet.Root>,
    );

    const group = (getByText("Choice") as HTMLElement).closest<HTMLElement>(
      ".seed-menu-sheet__group",
    );
    const listContent = group?.parentElement;
    const list = listContent?.parentElement;
    if (!listContent || !list) throw new Error("Expected menu sheet list.");

    expect(listContent.classList.contains("seed-menu-sheet__listContent")).toBe(true);
    expect(list.tagName.toLowerCase()).toBe("scroll-view");
    expect(list.classList.contains("seed-menu-sheet__list")).toBe(true);
    expect(list.classList.contains("custom-list")).toBe(true);
    expect(list.getAttribute("scroll-orientation")).toBe("vertical");
    expect(list.getAttribute("bounces")).toBe("false");
  });

  it("connects headless controls without dropping user handlers", () => {
    const onOpenChange = vi.fn();
    const onTriggerTap = vi.fn();
    const onCloseTap = vi.fn();
    const onBackdropClick = vi.fn();
    const { getByText } = render(
      <MenuSheet.Root onOpenChange={onOpenChange}>
        <MenuSheet.Trigger bindtap={onTriggerTap}>
          <text>Open</text>
        </MenuSheet.Trigger>
        <MenuSheet.Backdrop onClick={onBackdropClick}>
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

    expect(sheetMocks.rootProps.at(-1)).toMatchObject({ onOpenChange });
    expect(sheetMocks.triggerTap).toHaveBeenCalledTimes(2);
    expect(sheetMocks.closeTap).toHaveBeenCalledOnce();
    expect(onBackdropClick).toHaveBeenCalledOnce();
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
    expect(sheetMocks.closeTap).not.toHaveBeenCalled();
  });

  it("forwards skipAnimation and leaves default transitions to headless Content", () => {
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

    expect(sheetMocks.triggerTap).toHaveBeenCalledOnce();
    expect(sheetMocks.rootProps.at(-1)).toMatchObject({ skipAnimation: true });
    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      innerStyle: {
        paddingBottom: "calc(16px + 34px)",
      },
      snapAnimation: undefined,
      enterAnimation: undefined,
      exitAnimation: undefined,
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
    // Android drops flattened accessibility elements from the native tree.
    expect(target.parentElement!.getAttribute("flatten")).toBe("false");
    const close = (getByText("Close feedback") as HTMLElement).parentElement!;
    expect(close.classList.contains("seed-menu-sheet__closeButton")).toBe(true);
    expect(close.getAttribute("flatten")).toBe("false");
  });
});
