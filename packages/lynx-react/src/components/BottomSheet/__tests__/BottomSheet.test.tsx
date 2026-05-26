import { fireEvent, render } from "@lynx-js/react/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sheetMocks = vi.hoisted(() => ({
  contentProps: [] as Array<Record<string, unknown>>,
  rootRef: {
    open: vi.fn(),
  },
}));

vi.mock("@lynx-js/lynx-ui-sheet", async () => {
  const React = await vi.importActual<typeof import("@lynx-js/react")>("@lynx-js/react");

  const SheetRoot = React.forwardRef<unknown, { children?: React.ReactNode }>((props, ref) => {
    React.useImperativeHandle(ref, () => sheetMocks.rootRef);
    return <>{props.children}</>;
  });
  SheetRoot.displayName = "MockSheetRoot";

  const SheetView = React.forwardRef<unknown, { children?: React.ReactNode }>((props) => {
    return <>{props.children}</>;
  });
  SheetView.displayName = "MockSheetView";

  const SheetContent = React.forwardRef<unknown, Record<string, unknown>>((props) => {
    sheetMocks.contentProps.push(props);
    return <>{props.children as React.ReactNode}</>;
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

import * as BottomSheet from "../BottomSheet.namespace";

interface TestLynxGlobal {
  lynx?: {
    __globalProps?: {
      safeAreaInsets?: {
        top?: number | string | null;
        bottom?: number | string | null;
      };
      safeAreaInsetTop?: number | string | null;
      safeAreaInsetBottom?: number | string | null;
    };
  };
  lynxTestingEnv?: {
    backgroundThread: {
      globalThis: TestLynxGlobal;
    };
    mainThread: {
      globalThis: TestLynxGlobal;
    };
  };
}

function getLynxGlobals(): TestLynxGlobal[] {
  const rootGlobal = globalThis as TestLynxGlobal;

  return [
    rootGlobal,
    rootGlobal.lynxTestingEnv?.backgroundThread.globalThis,
    rootGlobal.lynxTestingEnv?.mainThread.globalThis,
  ].filter((global): global is TestLynxGlobal => global != null);
}

function setGlobalProps(
  globalProps: NonNullable<NonNullable<TestLynxGlobal["lynx"]>["__globalProps"]>,
) {
  for (const global of getLynxGlobals()) {
    global.lynx = {
      ...global.lynx,
      __globalProps: globalProps,
    };
  }
}

describe("BottomSheet", () => {
  beforeEach(() => {
    sheetMocks.contentProps = [];
    sheetMocks.rootRef.open.mockClear();
  });

  afterEach(() => {
    for (const global of getLynxGlobals()) {
      if (global.lynx) {
        delete global.lynx.__globalProps;
      }
    }
  });

  it("uses bottom safe area as the default content padding", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)?.style).toMatchObject({
      paddingBottom: "env(safe-area-inset-bottom)",
    });
  });

  it("uses host-provided bottom safe area for content padding", () => {
    setGlobalProps({
      safeAreaInsets: {
        bottom: 34,
      },
    });

    render(
      <BottomSheet.Root>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)?.style).toMatchObject({
      paddingBottom: "34px",
    });
  });

  it("lets user content style override bottom safe area padding", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Content style={{ paddingTop: "8px", paddingBottom: "24px" }} />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)?.style).toMatchObject({
      paddingTop: "8px",
      paddingBottom: "24px",
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
    const snapAnimation = { type: "tween", duration: 120 };
    const enterAnimation = { type: "tween", duration: 140 };
    const exitAnimation = { type: "tween", duration: 90 };

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

    fireEvent.tap(getByText("Open sheet").parentElement!);

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

    fireEvent.tap(getByText("Open sheet").parentElement!);

    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith({ animate: false });
  });
});
