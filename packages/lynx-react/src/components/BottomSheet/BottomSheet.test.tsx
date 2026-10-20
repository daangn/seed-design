import "@testing-library/jest-dom";
import { createRef } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LynxPressableProps } from "../../types";

const sheetMocks = vi.hoisted(() => ({
  contentProps: [] as Array<Record<string, unknown>>,
  rootProps: [] as Array<Record<string, unknown>>,
  triggerTap: vi.fn(),
  closeTap: vi.fn(),
  safeArea: {
    safeAreaInsetTop: "62px",
    safeAreaInsetRight: "0px",
    safeAreaInsetBottom: "34px",
    safeAreaInsetLeft: "59px",
  },
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
  useSafeArea: () => sheetMocks.safeArea,
}));

import * as BottomSheet from "./BottomSheet.namespace";
import { ScrollFog } from "../ScrollFog";

describe("BottomSheet", () => {
  beforeEach(() => {
    sheetMocks.contentProps = [];
    sheetMocks.rootProps = [];
    sheetMocks.triggerTap.mockClear();
    sheetMocks.closeTap.mockClear();
  });

  it("uses the device logical height when the host does not provide screenHeight", () => {
    render(
      <BottomSheet.Root snapPoints={["45%", "80%"]}>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.rootProps.at(-1)).toMatchObject({
      screenHeight: SystemInfo.pixelHeight / SystemInfo.pixelRatio,
    });
  });

  it("preserves a consumer-provided screenHeight", () => {
    render(
      <BottomSheet.Root screenHeight={600} snapPoints={["45%", "80%"]}>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.rootProps.at(-1)).toMatchObject({ screenHeight: 600 });
  });

  it("passes handleOnly to headless Root", () => {
    render(
      <BottomSheet.Root handleOnly>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.rootProps.at(-1)).toMatchObject({
      handleOnly: true,
    });
  });

  it("renders Body as a view around a vertical scroll-view that holds its children", () => {
    const bodyRef = createRef<unknown>();
    const { container } = render(
      <BottomSheet.Root>
        <BottomSheet.Body ref={bodyRef} className="custom-body" style={{ height: "200px" }}>
          <ScrollFog placement={["top", "bottom"]}>
            <scroll-view scroll-orientation="vertical" scroll-bar-enable={false}>
              <text>Scrollable content</text>
            </scroll-view>
          </ScrollFog>
        </BottomSheet.Body>
      </BottomSheet.Root>,
    );

    const body = container.querySelector(".custom-body");
    const scrollArea = body?.firstElementChild;
    const fogScrollViews = scrollArea?.querySelectorAll("scroll-view");

    expect(body?.tagName.toLowerCase()).toBe("view");
    expect(body).toHaveStyle({ height: "200px" });
    expect(bodyRef.current).not.toBeNull();
    expect(scrollArea?.tagName.toLowerCase()).toBe("scroll-view");
    expect(scrollArea).toHaveClass("seed-bottom-sheet__scrollArea");
    expect(scrollArea).toHaveAttribute("scroll-orientation", "vertical");
    expect(scrollArea?.firstElementChild).toHaveClass("seed-bottom-sheet__scrollContent");
    expect(fogScrollViews).toHaveLength(1);
    expect(fogScrollViews?.item(0)).toHaveAttribute("scroll-orientation", "vertical");
    expect(fogScrollViews?.item(0)).not.toHaveAttribute("fading-edge-length");
  });

  it("forwards native Header props while preserving its children", () => {
    const { container, getByText } = render(
      <BottomSheet.Root>
        <BottomSheet.Header id="sheet-header" accessibility-label="Sheet heading" data-foo="header">
          <BottomSheet.Title>Choose an option</BottomSheet.Title>
        </BottomSheet.Header>
      </BottomSheet.Root>,
    );
    const header = container.querySelector("#sheet-header");

    expect(header).toHaveAttribute("accessibility-label", "Sheet heading");
    expect(header).toHaveAttribute("data-foo", "header");
    expect(header).toContainElement(getByText("Choose an option") as HTMLElement);
  });

  it("renders Handle with a target-size touch area around the visual handle", () => {
    const { container } = render(
      <BottomSheet.Root>
        <BottomSheet.Handle />
      </BottomSheet.Root>,
    );

    const touchArea = container.querySelector(".seed-bottom-sheet-handle__touchArea");
    const visualHandle = container.querySelector(".seed-bottom-sheet-handle__root");

    expect(visualHandle).not.toBeNull();
    expect(touchArea).not.toBeNull();
    expect(touchArea?.contains(visualHandle)).toBe(true);
  });

  it("passes inner layout styles and safe area bottom to Content", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Content innerStyle={{ paddingTop: "8px" }} />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      innerStyle: {
        display: "flex",
        flexDirection: "column",
        minHeight: "0",
        paddingBottom: "34px",
        paddingTop: "8px",
      },
    });
  });

  it("releases the sheet's inline left inset so the positioner can center it", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      style: { left: "auto" },
    });
  });

  it("lets a user-provided style win over the released left inset", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Content style={{ left: "12px" }} />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      style: { left: "12px" },
    });
  });

  it("centers Content between the side insets", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      style: {
        width: "calc(100vw - 59px - 0px)",
        marginLeft: "59px",
        marginRight: "0px",
      },
    });
  });

  it("caps a fitted sheet at the height fraction and below the top inset", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      style: { paddingBottom: "calc(50vh + 62px)" },
      innerStyle: { flexShrink: 1, maxHeight: "calc(0.9 * 100vh)" },
    });
  });

  it("leaves the height to explicit snap points", () => {
    render(
      <BottomSheet.Root snapPoints={["45%", "80%"]}>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    const contentProps = sheetMocks.contentProps.at(-1);

    expect(contentProps?.["style"]).not.toHaveProperty("paddingBottom");
    expect(contentProps?.["innerStyle"]).not.toHaveProperty("maxHeight");
    expect(contentProps?.["innerStyle"]).not.toHaveProperty("flexShrink");
  });

  it("passes skipAnimation to headless Root and leaves default transitions to headless Content", () => {
    render(
      <BottomSheet.Root skipAnimation>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      snapAnimation: undefined,
      enterAnimation: undefined,
      exitAnimation: undefined,
    });
  });

  it("preserves user-provided animations when Root has skipAnimation", () => {
    const snapAnimation = { type: "tween", duration: 120 } as const;
    const enterAnimation = { type: "tween", duration: 140 } as const;
    const exitAnimation = { type: "tween", duration: 90 } as const;

    render(
      <BottomSheet.Root skipAnimation>
        <BottomSheet.Content
          snapAnimation={snapAnimation}
          enterAnimation={enterAnimation}
          exitAnimation={exitAnimation}
        />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      snapAnimation,
      enterAnimation,
      exitAnimation,
    });
  });

  it("composes the headless Trigger handler with the user handler", () => {
    const onTap = vi.fn();
    const { getByText } = render(
      <BottomSheet.Root skipAnimation>
        <BottomSheet.Trigger bindtap={onTap}>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    const trigger = (getByText("Open sheet") as HTMLElement).parentElement;
    if (!trigger) {
      throw new Error("Expected trigger parent element to exist.");
    }

    fireEvent.tap(trigger);

    expect(sheetMocks.triggerTap).toHaveBeenCalledOnce();
    expect(sheetMocks.rootProps.at(-1)).toMatchObject({ skipAnimation: true });
    expect(onTap).toHaveBeenCalledOnce();
  });

  it("composes the headless CloseButton handler with the user handler", () => {
    const onOpenChange = vi.fn();
    const onTap = vi.fn();
    const { container } = render(
      <BottomSheet.Root open onOpenChange={onOpenChange}>
        <BottomSheet.CloseButton accessibility-label="닫기" bindtap={onTap} />
      </BottomSheet.Root>,
    );

    const closeButton = container.querySelector(".seed-bottom-sheet__closeButton");
    if (!closeButton) {
      throw new Error("Expected close button to exist.");
    }

    fireEvent.tap(closeButton);

    expect(sheetMocks.closeTap).toHaveBeenCalledOnce();
    expect(sheetMocks.rootProps.at(-1)).toMatchObject({ onOpenChange });
    expect(onTap).toHaveBeenCalledOnce();
  });

  it.each([
    "left",
    "center",
  ] as const)("reserves title space for CloseButton only while it is rendered (headerAlign=%s)", (headerAlign) => {
    const renderSheet = (showCloseButton: boolean) => (
      <BottomSheet.Root headerAlign={headerAlign}>
        <BottomSheet.Title>Title</BottomSheet.Title>
        {showCloseButton ? <BottomSheet.CloseButton accessibility-label="닫기" /> : null}
      </BottomSheet.Root>
    );
    const closeButtonTitleClass = `seed-bottom-sheet__title--headerAlign_${headerAlign}-closeButton_true`;
    const { getByText, rerender } = render(renderSheet(true));

    expect(getByText("Title")).toHaveClass(closeButtonTitleClass);

    rerender(renderSheet(false));

    expect(getByText("Title")).not.toHaveClass(closeButtonTitleClass);
  });
});
