import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { SheetRootRef } from "@lynx-js/lynx-ui-sheet";
import { beforeEach, describe, expect, it, vi } from "vitest";

const sheetMocks = vi.hoisted(() => ({
  contentProps: [] as Array<Record<string, unknown>>,
  calls: [] as string[],
  rootRef: {
    open: vi.fn(),
    close: vi.fn(),
    snapTo: vi.fn(),
    expand: vi.fn(),
    collapse: vi.fn(),
  },
}));

vi.mock("@lynx-js/lynx-ui-sheet", async () => {
  const { forwardRef, useImperativeHandle } = await vi.importActual<typeof React>("@lynx-js/react");

  const SheetRoot = forwardRef<unknown, { children?: React.ReactNode }>((props, ref) => {
    useImperativeHandle(ref, () => sheetMocks.rootRef);
    return <>{props.children}</>;
  });
  const SheetContent = (props: Record<string, unknown>) => {
    sheetMocks.contentProps.push(props);
    return null;
  };
  const passthrough = (props: { children?: React.ReactNode }) => <>{props.children}</>;

  return {
    SheetRoot,
    SheetContent,
    SheetView: passthrough,
    SheetBackdrop: passthrough,
    SheetHandle: passthrough,
  };
});

import { BottomSheet, useBottomSheetTrigger } from "./index.js";

function tapTrigger(label: HTMLElement) {
  const trigger = label.parentElement;
  if (!trigger) throw new Error("Expected trigger element.");
  fireEvent.tap(trigger);
}

describe("BottomSheet", () => {
  beforeEach(() => {
    sheetMocks.contentProps = [];
    sheetMocks.calls = [];
    sheetMocks.rootRef.open.mockReset();
    sheetMocks.rootRef.open.mockImplementation(() => sheetMocks.calls.push("open"));
  });

  it("opens the sheet from Trigger before calling the consumer tap", () => {
    const { getByText } = render(
      <BottomSheet.Root>
        <BottomSheet.Trigger bindtap={() => sheetMocks.calls.push("bindtap")}>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    tapTrigger(getByText("Open sheet") as HTMLElement);

    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith();
    expect(sheetMocks.calls).toEqual(["open", "bindtap"]);
  });

  it("opens without animation from Trigger when Root skips animation", () => {
    const { getByText } = render(
      <BottomSheet.Root skipAnimation>
        <BottomSheet.Trigger>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    tapTrigger(getByText("Open sheet") as HTMLElement);

    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith({ animate: false });
  });

  it("keeps Trigger props across renders while tapping with the latest Root and handler", () => {
    const rendered: unknown[] = [];
    function Probe(props: { bindtap: () => void }) {
      const { triggerProps } = useBottomSheetTrigger(props);
      rendered.push(triggerProps);
      return (
        <view {...triggerProps}>
          <text>Open sheet</text>
        </view>
      );
    }
    const firstTap = vi.fn();
    const latestTap = vi.fn();
    const { getByText, rerender } = render(
      <BottomSheet.Root>
        <Probe bindtap={firstTap} />
      </BottomSheet.Root>,
    );
    const firstProps = rendered.at(-1);

    rerender(
      <BottomSheet.Root skipAnimation>
        <Probe bindtap={latestTap} />
      </BottomSheet.Root>,
    );
    tapTrigger(getByText("Open sheet") as HTMLElement);

    expect(rendered.at(-1)).toBe(firstProps);
    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith({ animate: false });
    expect(latestTap).toHaveBeenCalledTimes(1);
    expect(firstTap).not.toHaveBeenCalled();
  });

  it("shares the engine handle with a forwarded ref and Trigger", () => {
    const ref = React.createRef<SheetRootRef>();
    const { getByText } = render(
      <BottomSheet.Root ref={ref}>
        <BottomSheet.Trigger>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    tapTrigger(getByText("Open sheet") as HTMLElement);

    expect(ref.current).toBe(sheetMocks.rootRef);
    expect(sheetMocks.rootRef.open).toHaveBeenCalledTimes(1);
  });

  it("leaves Content transitions to the engine unless Root skips animation", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Content />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      snapAnimation: undefined,
      enterAnimation: undefined,
      exitAnimation: undefined,
    });
  });

  it("ends only the transitions Content does not set when Root skips animation", () => {
    const snapAnimation = { type: "tween", duration: 120 } as const;

    render(
      <BottomSheet.Root skipAnimation>
        <BottomSheet.Content snapAnimation={snapAnimation} />
      </BottomSheet.Root>,
    );

    expect(sheetMocks.contentProps.at(-1)).toMatchObject({
      snapAnimation,
      enterAnimation: { type: "tween", duration: 0 },
      exitAnimation: { type: "tween", duration: 0 },
    });
  });
});
