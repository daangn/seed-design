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

  const passthrough = (displayName: string) => {
    const Component = React.forwardRef<unknown, { children?: React.ReactNode }>((props) => {
      return <>{props.children}</>;
    });
    Component.displayName = displayName;
    return Component;
  };

  return {
    SheetBackdrop: passthrough("MockSheetBackdrop"),
    SheetContent,
    SheetHandle: passthrough("MockSheetHandle"),
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
