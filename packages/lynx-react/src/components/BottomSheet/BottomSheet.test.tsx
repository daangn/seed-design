import { fireEvent, render } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

const sheetMocks = vi.hoisted(() => ({
  contentProps: [] as Array<Record<string, unknown>>,
  rootProps: [] as Array<Record<string, unknown>>,
  rootRef: {
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

  const SheetHandle = React.forwardRef<
    unknown,
    Record<string, unknown> & { children?: React.ReactNode }
  >((props) => {
    const { children, className, style, ...rest } = props;

    // 실물 SheetHandle과 동일하게 rest props를 native view로 흘려보낸다.
    return (
      <view className={className as string} style={style as never} {...rest}>
        {children as React.ReactNode}
      </view>
    );
  });
  SheetHandle.displayName = "MockSheetHandle";

  const SheetBackdrop = React.forwardRef<
    unknown,
    Record<string, unknown> & { children?: React.ReactNode }
  >((props) => {
    return (
      <view className={props["className"] as string}>{props["children"] as React.ReactNode}</view>
    );
  });
  SheetBackdrop.displayName = "MockSheetBackdrop";

  return {
    SheetBackdrop,
    SheetContent,
    SheetHandle,
    SheetRoot,
    SheetView,
  };
});

vi.mock("../../hooks/useSafeArea", () => ({
  useSafeArea: () => ({
    safeAreaInsetTop: "62px",
    safeAreaInsetBottom: "34px",
  }),
}));

import * as BottomSheet from "./BottomSheet.namespace";

describe("BottomSheet", () => {
  beforeEach(() => {
    sheetMocks.contentProps = [];
    sheetMocks.rootProps = [];
    sheetMocks.rootRef.open.mockClear();
  });

  it("passes handleOnly to the underlying SheetRoot", () => {
    render(
      <BottomSheet.Root handleOnly>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.rootProps.at(-1)).toMatchObject({
      handleOnly: true,
    });
  });

  it("renders Body as a vertical scroll-view", () => {
    const { container } = render(
      <BottomSheet.Root>
        <BottomSheet.Body>
          <text>Scrollable content</text>
        </BottomSheet.Body>
      </BottomSheet.Root>,
    );

    const body = container.querySelector("scroll-view");

    expect(body).not.toBeNull();
    expect(body?.hasAttribute("scroll-y")).toBe(true);
  });

  // Android는 터치를 Lynx와 플랫폼 디스패치 양쪽으로 흘려서, 아래 속성이 빠지면
  // 시트 위 제스처가 배경 list/scroll-view까지 스크롤시킨다.
  describe("Android 스크롤 격리", () => {
    it("opts Body out of nested scroll so it does not chain to ancestors", () => {
      const { container } = render(
        <BottomSheet.Root>
          <BottomSheet.Body>
            <text>Scrollable content</text>
          </BottomSheet.Body>
        </BottomSheet.Root>,
      );

      expect(container.querySelector("scroll-view")?.getAttribute("enable-nested-scroll")).toBe(
        "false",
      );
    });

    it("claims vertical slides on the drag handle", () => {
      const { container } = render(
        <BottomSheet.Root>
          <BottomSheet.Handle />
        </BottomSheet.Root>,
      );

      const touchArea = container.querySelector(".seed-bottom-sheet-handle__touchArea");

      expect(touchArea?.hasAttribute("consume-slide-event")).toBe(true);
    });

    it("claims vertical slides on Header and Footer", () => {
      const { container } = render(
        <BottomSheet.Root>
          <BottomSheet.Header>
            <text>Header</text>
          </BottomSheet.Header>
          <BottomSheet.Footer>
            <text>Footer</text>
          </BottomSheet.Footer>
        </BottomSheet.Root>,
      );

      for (const slot of ["header", "footer"]) {
        const element = container.querySelector(`.seed-bottom-sheet__${slot}`);

        expect(element?.hasAttribute("consume-slide-event")).toBe(true);
      }
    });

    it("claims slides on the Backdrop through a full-size child view", () => {
      const { container } = render(
        <BottomSheet.Root>
          <BottomSheet.Backdrop />
        </BottomSheet.Root>,
      );

      const backdrop = container.querySelector(".seed-bottom-sheet__backdrop");

      expect(backdrop?.querySelector("view")?.hasAttribute("consume-slide-event")).toBe(true);
    });

    it("blocks native gestures outside Lynx on Content", () => {
      render(
        <BottomSheet.Root>
          <BottomSheet.Content />
        </BottomSheet.Root>,
      );

      expect(sheetMocks.contentProps.at(-1)).toMatchObject({
        "block-native-event": true,
      });
    });
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

  it("skips motion-engine animations when Root has skipAnimation", () => {
    render(
      <BottomSheet.Root skipAnimation>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      snapAnimation: { type: "tween", duration: 0 },
      enterAnimation: { type: "tween", duration: 0 },
      exitAnimation: { type: "tween", duration: 0 },
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

  it("opens with default animation when Root does not skip animation", () => {
    const { getByText } = render(
      <BottomSheet.Root>
        <BottomSheet.Trigger>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    const trigger = (getByText("Open sheet") as HTMLElement).parentElement;
    if (!trigger) {
      throw new Error("Expected trigger parent element to exist.");
    }

    fireEvent.tap(trigger);

    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith();
  });

  it("opens without animation when Trigger is tapped inside a skipping Root", () => {
    const { getByText } = render(
      <BottomSheet.Root skipAnimation>
        <BottomSheet.Trigger>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    const trigger = (getByText("Open sheet") as HTMLElement).parentElement;
    if (!trigger) {
      throw new Error("Expected trigger parent element to exist.");
    }

    fireEvent.tap(trigger);

    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith({ animate: false });
  });
});
