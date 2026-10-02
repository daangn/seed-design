import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { SheetRootRef } from "@lynx-js/lynx-ui-sheet";
import { beforeEach, describe, expect, it, vi } from "vitest";

const sheetMocks = vi.hoisted(() => {
  // lynx-ui-sheet의 SheetRoot처럼 열림 값이 바뀔 때만 `onShowChange`를 호출하고, 비제어면 상태를 바꾼다.
  const engine = { change: (_open: boolean) => {} };
  const calls: string[] = [];
  return {
    contentProps: [] as Array<Record<string, unknown>>,
    viewProps: [] as Array<Record<string, unknown>>,
    calls,
    engine,
    rootRef: {
      open: vi.fn((_options?: unknown) => {
        calls.push("open");
        engine.change(true);
      }),
      close: vi.fn((_options?: unknown) => {
        calls.push("close");
        engine.change(false);
      }),
      snapTo: vi.fn(),
      expand: vi.fn(),
      collapse: vi.fn(),
    },
  };
});

vi.mock("@lynx-js/lynx-ui-sheet", async () => {
  const { forwardRef, useImperativeHandle, useRef, useState } =
    await vi.importActual<typeof React>("@lynx-js/react");

  const SheetRoot = forwardRef<
    unknown,
    {
      children?: React.ReactNode;
      show?: boolean;
      defaultShow?: boolean;
      onShowChange?: (open: boolean) => void;
    }
  >((props, ref) => {
    const { show, defaultShow = false, onShowChange } = props;
    const [uncontrolledShow, setUncontrolledShow] = useState(defaultShow);
    const actualShow = useRef(false);
    actualShow.current = show ?? uncontrolledShow;
    sheetMocks.engine.change = (next) => {
      if (next === actualShow.current) return;
      onShowChange?.(next);
      if (show === undefined) {
        actualShow.current = next;
        setUncontrolledShow(next);
      }
    };
    useImperativeHandle(ref, () => sheetMocks.rootRef);
    return <>{props.children}</>;
  });
  const SheetContent = (props: Record<string, unknown>) => {
    sheetMocks.contentProps.push(props);
    return null;
  };
  const SheetBackdrop = (props: {
    children?: React.ReactNode;
    clickToClose?: boolean;
    onClick?: () => void;
  }) => {
    const handleTap = () => {
      if (props.clickToClose ?? true) sheetMocks.engine.change(false);
      props.onClick?.();
    };
    return <view bindtap={handleTap}>{props.children}</view>;
  };
  const passthrough = (props: { children?: React.ReactNode }) => <>{props.children}</>;

  return {
    SheetRoot,
    SheetContent,
    SheetView: (props: { children?: React.ReactNode }) => {
      sheetMocks.viewProps.push(props);
      return <>{props.children}</>;
    },
    SheetBackdrop,
    SheetHandle: passthrough,
  };
});

import { BottomSheet, useBottomSheetTrigger } from "./index.js";

function tap(label: HTMLElement) {
  const target = label.parentElement;
  if (!target) throw new Error("Expected a tappable parent element.");
  fireEvent.tap(target);
}

function recordOpenChange() {
  return vi.fn((open: boolean, details: { reason: string }) => {
    sheetMocks.calls.push(`onOpenChange:${open}:${details.reason}`);
  });
}

describe("BottomSheet", () => {
  beforeEach(() => {
    sheetMocks.contentProps = [];
    sheetMocks.viewProps = [];
    sheetMocks.calls.length = 0;
    for (const method of Object.values(sheetMocks.rootRef)) method.mockClear();
  });

  it("opens from Trigger with the trigger reason before calling the consumer tap", () => {
    const onOpenChange = recordOpenChange();
    const { getByText } = render(
      <BottomSheet.Root onOpenChange={onOpenChange}>
        <BottomSheet.Trigger bindtap={() => sheetMocks.calls.push("bindtap")}>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    tap(getByText("Open sheet") as HTMLElement);

    expect(sheetMocks.calls).toEqual(["open", "onOpenChange:true:trigger", "bindtap"]);
  });

  it("opens without animation from Trigger when Root skips animation", () => {
    const { getByText } = render(
      <BottomSheet.Root skipAnimation>
        <BottomSheet.Trigger>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    tap(getByText("Open sheet") as HTMLElement);

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
    tap(getByText("Open sheet") as HTMLElement);

    expect(rendered.at(-1)).toBe(firstProps);
    expect(sheetMocks.rootRef.open).toHaveBeenCalledWith({ animate: false });
    expect(latestTap).toHaveBeenCalledTimes(1);
    expect(firstTap).not.toHaveBeenCalled();
  });

  it("closes from CloseButton and Backdrop with their reasons before consumer handlers", () => {
    const onOpenChange = recordOpenChange();
    const { getByText } = render(
      <BottomSheet.Root defaultOpen onOpenChange={onOpenChange}>
        <BottomSheet.Trigger>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
        <BottomSheet.Backdrop onClick={() => sheetMocks.calls.push("onClick")}>
          <text>Backdrop</text>
        </BottomSheet.Backdrop>
        <BottomSheet.CloseButton bindtap={() => sheetMocks.calls.push("bindtap")}>
          <text>Close</text>
        </BottomSheet.CloseButton>
      </BottomSheet.Root>,
    );

    tap(getByText("Close") as HTMLElement);
    tap(getByText("Open sheet") as HTMLElement);
    tap(getByText("Backdrop") as HTMLElement);

    expect(sheetMocks.calls).toEqual([
      "close",
      "onOpenChange:false:closeButton",
      "bindtap",
      "open",
      "onOpenChange:true:trigger",
      "close",
      "onOpenChange:false:interactOutside",
      "onClick",
    ]);
  });

  it("keeps the sheet open on a Backdrop tap without clickToClose", () => {
    const onOpenChange = recordOpenChange();
    const onClick = vi.fn();
    const { getByText } = render(
      <BottomSheet.Root defaultOpen onOpenChange={onOpenChange}>
        <BottomSheet.Backdrop clickToClose={false} onClick={onClick}>
          <text>Backdrop</text>
        </BottomSheet.Backdrop>
      </BottomSheet.Root>,
    );

    tap(getByText("Backdrop") as HTMLElement);

    expect(sheetMocks.rootRef.close).not.toHaveBeenCalled();
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("reports engine-driven changes as drag even after a Trigger tap that changed nothing", () => {
    const onOpenChange = recordOpenChange();
    const { getByText } = render(
      <BottomSheet.Root defaultOpen onOpenChange={onOpenChange}>
        <BottomSheet.Trigger>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
      </BottomSheet.Root>,
    );

    tap(getByText("Open sheet") as HTMLElement);
    sheetMocks.engine.change(false);

    expect(onOpenChange.mock.calls).toEqual([[false, { reason: "drag" }]]);
  });

  it("does not report changes made through the Root ref, including the engine's follow-up", () => {
    const onOpenChange = recordOpenChange();
    const ref = React.createRef<SheetRootRef>();
    const { rerender } = render(<BottomSheet.Root ref={ref} open onOpenChange={onOpenChange} />);

    ref.current?.close();
    // 엔진은 닫힘 애니메이션을 시작하면서 같은 값을 한 번 더 알린다.
    sheetMocks.engine.change(false);
    expect(sheetMocks.rootRef.close).toHaveBeenCalledTimes(1);
    expect(onOpenChange).not.toHaveBeenCalled();

    rerender(<BottomSheet.Root ref={ref} onOpenChange={onOpenChange} />);
    ref.current?.open();
    expect(onOpenChange).not.toHaveBeenCalled();

    sheetMocks.engine.change(false);
    expect(onOpenChange.mock.calls).toEqual([[false, { reason: "drag" }]]);
  });

  it("reports user changes without driving the engine when open is controlled", () => {
    const onOpenChange = recordOpenChange();
    const sheet = (open: boolean) => (
      <BottomSheet.Root open={open} onOpenChange={onOpenChange}>
        <BottomSheet.Trigger>
          <text>Open sheet</text>
        </BottomSheet.Trigger>
        <BottomSheet.CloseButton>
          <text>Close</text>
        </BottomSheet.CloseButton>
      </BottomSheet.Root>
    );
    const { getByText, rerender } = render(sheet(false));

    tap(getByText("Close") as HTMLElement);
    tap(getByText("Open sheet") as HTMLElement);
    rerender(sheet(true));
    tap(getByText("Close") as HTMLElement);

    expect(sheetMocks.calls).toEqual([
      "onOpenChange:true:trigger",
      "onOpenChange:false:closeButton",
    ]);
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

  it("fills the native overlay only in container mode", () => {
    render(
      <BottomSheet.Root>
        <BottomSheet.Positioner container="window" style={{ width: "80%" }} />
        <BottomSheet.Positioner style={{ top: "0px" }} />
      </BottomSheet.Root>,
    );

    const [overlayLayer, viewLayer] = sheetMocks.viewProps;
    expect(overlayLayer).toMatchObject({
      container: "window",
      style: { width: "80%", height: "100%" },
    });
    expect(viewLayer?.style).toEqual({ top: "0px" });
  });
});
