import "@testing-library/jest-dom";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import * as React from "@lynx-js/react";
import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";
import type { Rect } from "@seed-design/lynx-react-floating";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Popover } from "./index.js";

const geometry = vi.hoisted(() => ({ getRectByRef: vi.fn() }));

vi.mock("@lynx-js/lynx-ui-common", async (importOriginal) => {
  const actual = await importOriginal<typeof LynxUiCommon>();
  return { ...actual, getRectByRef: geometry.getRectByRef };
});

interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const ROOT = { root: true };
const frames: Array<() => void> = [];
let referenceBox: Box;
let layerBox: Box;
let referenceRect: (box: Box) => Promise<Rect>;

function toRect({ left, top, width, height }: Box): Rect {
  return { left, top, width, height, right: left + width, bottom: top + height };
}

function elementForRef(current: unknown) {
  if (!current || typeof current !== "object" || !("refAttr" in current)) return null;
  const refAttr = current.refAttr;
  if (!Array.isArray(refAttr)) return null;
  return elementTree.root?.querySelector(`[react-ref-${refAttr[0]}-${refAttr[1]}]`) ?? null;
}

// 측정은 RAF와 비동기 native query를 거치므로, frame과 macrotask를 번갈아 진행합니다.
async function flush(rounds = 20) {
  for (let round = 0; round < rounds; round += 1) {
    await act(async () => {
      for (const callback of frames.splice(0)) callback();
      const { promise, resolve } = Promise.withResolvers<void>();
      setTimeout(resolve, 0);
      await promise;
    });
  }
}

function query(selector: string) {
  const element = elementTree.root?.querySelector(selector);
  if (!element) throw new Error(`Expected ${selector} to be rendered.`);
  return element;
}

function positionerStyle() {
  return query(".positioner").getAttribute("style") ?? "";
}

function globalTapListener(selector: string) {
  const element = query(selector) as Element & { eventMap?: Record<string, unknown> };
  return element.eventMap?.["global-bindEvent:tap"] ? element : null;
}

// global-bindtap은 페이지 어디를 탭해도 전달되므로, listener 요소에 page 기준 좌표로 직접 보냅니다.
function tapPageAt(listener: Element, x: number, y: number) {
  fireEvent.tap(listener, { eventType: "global-bindEvent", detail: { x, y } });
}

beforeEach(() => {
  frames.length = 0;
  referenceBox = { left: 100, top: 300, width: 40, height: 40 };
  layerBox = { left: 0, top: -50, width: 390, height: 900 };
  referenceRect = async (box) => toRect(box);
  const createSelectorQuery = () => ({ selectRoot: () => ROOT });
  const requestAnimationFrame = (callback: () => void) => frames.push(callback);
  for (const target of [
    lynxTestingEnv.backgroundThread.globalThis,
    lynxTestingEnv.mainThread.globalThis,
    globalThis,
  ] as Array<Record<string, unknown>>) {
    target["requestAnimationFrame"] = requestAnimationFrame;
    target["cancelAnimationFrame"] = () => {};
    // lynx-ui OverlayView는 overlayLevel을 지정하면 lynx.requestAnimationFrame으로 표시를 늦춥니다.
    target["lynx"] = { ...(target["lynx"] as object), createSelectorQuery, requestAnimationFrame };
  }
  geometry.getRectByRef.mockImplementation(async (ref: { current: unknown }) => {
    if (ref.current === ROOT) return toRect({ left: 0, top: 0, width: 390, height: 844 });
    const element = elementForRef(ref.current);
    if (element?.classList.contains("content")) {
      return toRect({ left: 0, top: 0, width: 120, height: 40 });
    }
    if (element?.parentElement?.parentElement?.tagName.toLowerCase() === "overlay") {
      return toRect(layerBox);
    }
    return referenceRect(referenceBox);
  });
});

function Bubble({
  withArrow = true,
  positionerProps,
}: {
  withArrow?: boolean;
  positionerProps?: Popover.PositionerProps;
}) {
  return (
    <Popover.Positioner className="positioner" {...positionerProps}>
      <Popover.Content className="content">
        {withArrow ? <Popover.Arrow className="arrow" size={12} tipHeight={8} /> : null}
        <text>내용</text>
      </Popover.Content>
    </Popover.Positioner>
  );
}

describe("Popover", () => {
  it("toggles with the trigger, reports the change before the user tap handler, and exposes expanded state", async () => {
    const calls: string[] = [];
    render(
      <Popover.Root onOpenChange={(open) => calls.push(`open:${open}`)}>
        <Popover.Trigger className="trigger" bindtap={() => calls.push("bindtap")}>
          <text>열기</text>
        </Popover.Trigger>
        <Bubble />
      </Popover.Root>,
    );

    expect(query(".trigger")).toHaveAttribute("accessibility-value", "collapsed");
    expect(query(".trigger")).toHaveAttribute("accessibility-traits", "button");
    expect(elementTree.root?.querySelector(".positioner")).toBeNull();

    fireEvent.tap(query(".trigger"));
    await flush();

    expect(calls).toEqual(["open:true", "bindtap"]);
    expect(query(".trigger")).toHaveAttribute("accessibility-value", "expanded");
    expect(query(".positioner")).toBeInTheDocument();
  });

  it("keeps a controlled popover open until the parent changes it", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover.Root open onOpenChange={onOpenChange}>
        <Popover.Trigger className="trigger">
          <text>열기</text>
        </Popover.Trigger>
        <Bubble />
      </Popover.Root>,
    );
    await flush();

    fireEvent.tap(query(".trigger"));
    await flush();

    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(query(".trigger")).toHaveAttribute("accessibility-value", "expanded");
  });

  it("does not give the anchor trigger accessibility semantics", () => {
    render(
      <Popover.Root>
        <Popover.Anchor className="anchor">
          <text>기준</text>
        </Popover.Anchor>
      </Popover.Root>,
    );

    expect(query(".anchor")).not.toHaveAttribute("accessibility-value");
    expect(query(".anchor")).not.toHaveAttribute("accessibility-traits");
    expect(query(".anchor")).not.toHaveAttribute("accessibility-element");
  });

  it("runs the close button handler before closing and unmounts after the exit fallback", async () => {
    const calls: string[] = [];
    render(
      <Popover.Root defaultOpen onOpenChange={(open) => calls.push(`open:${open}`)}>
        <Popover.Trigger>
          <text>열기</text>
        </Popover.Trigger>
        <Popover.Positioner className="positioner">
          <Popover.Content className="content">
            <Popover.CloseButton
              className="close"
              accessibility-label="닫기"
              bindtap={() => calls.push("bindtap")}
            />
          </Popover.Content>
        </Popover.Positioner>
      </Popover.Root>,
    );
    await flush();
    expect(query(".close")).toHaveAttribute("accessibility-traits", "button");

    fireEvent.tap(query(".close"));
    await flush(2);

    expect(calls).toEqual(["bindtap", "open:false"]);
    expect(query(".positioner")).toBeInTheDocument();

    await act(async () => {
      const { promise, resolve } = Promise.withResolvers<void>();
      setTimeout(resolve, 250);
      await promise;
    });

    expect(elementTree.root?.querySelector(".positioner")).toBeNull();
  });

  it("places the content from the anchor and adds the arrow tip only while an arrow is rendered", async () => {
    const { rerender } = render(
      <Popover.Root defaultOpen placement="bottom" gutter={4}>
        <Popover.Trigger>
          <text>열기</text>
        </Popover.Trigger>
        <Popover.Anchor>
          <text>기준</text>
        </Popover.Anchor>
        <Bubble />
      </Popover.Root>,
    );
    await flush();

    // anchor bottom 340 + gutter 4 + arrow tip 8
    expect(positionerStyle()).toContain("top: 352px");
    expect(query(".arrow").getAttribute("style")).toContain("bottom: 100%");

    rerender(
      <Popover.Root defaultOpen placement="bottom" gutter={4}>
        <Popover.Trigger>
          <text>열기</text>
        </Popover.Trigger>
        <Popover.Anchor>
          <text>기준</text>
        </Popover.Anchor>
        <Bubble withArrow={false} />
      </Popover.Root>,
    );
    await flush();

    expect(positionerStyle()).toContain("top: 344px");
  });

  it("closes on a page tap outside the reference and content only when closeOnInteractOutside is enabled", async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Popover.Root defaultOpen onOpenChange={onOpenChange} closeOnInteractOutside={false}>
        <Popover.Trigger>
          <text>열기</text>
        </Popover.Trigger>
        <Bubble />
      </Popover.Root>,
    );
    await flush();
    expect(globalTapListener(".positioner")).toBeNull();

    rerender(
      <Popover.Root defaultOpen onOpenChange={onOpenChange}>
        <Popover.Trigger>
          <text>열기</text>
        </Popover.Trigger>
        <Bubble />
      </Popover.Root>,
    );
    await flush();
    const listener = globalTapListener(".positioner");
    if (!listener) throw new Error("Expected a global tap listener.");

    // reference 100..140 × 300..340, content 60..180 × 348..388 (placement bottom, tip 8)
    tapPageAt(listener, 120, 320);
    tapPageAt(listener, 100, 370);
    await flush(2);
    expect(onOpenChange).not.toHaveBeenCalled();

    tapPageAt(listener, 10, 10);
    await flush(2);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("ignores a reference measurement that resolves after the popover reopens", async () => {
    const pending: Array<() => void> = [];
    let delayed = true;
    referenceRect = (box) => {
      if (!delayed) return Promise.resolve(toRect(box));
      const { promise, resolve } = Promise.withResolvers<Rect>();
      const staleBox = { ...box };
      pending.push(() => resolve(toRect(staleBox)));
      return promise;
    };
    function Controlled() {
      const [open, setOpen] = React.useState(true);
      return (
        <Popover.Root open={open} placement="bottom" gutter={0}>
          <Popover.Trigger>
            <text>열기</text>
          </Popover.Trigger>
          <view className="toggle" bindtap={() => setOpen((current) => !current)} />
          <Bubble withArrow={false} />
        </Popover.Root>
      );
    }
    render(<Controlled />);
    await flush();
    expect(pending.length).toBeGreaterThan(0);

    fireEvent.tap(query(".toggle"));
    await flush(2);
    fireEvent.tap(query(".toggle"));
    delayed = false;
    referenceBox = { left: 100, top: 500, width: 40, height: 40 };
    await flush();
    expect(positionerStyle()).toContain("top: 540px");

    await act(async () => {
      for (const resolve of pending.splice(0)) resolve();
    });
    await flush();

    expect(positionerStyle()).toContain("top: 540px");
  });

  it("renders into a native overlay with layer coordinates when a container is given", async () => {
    const onOpenChange = vi.fn();
    render(
      <Popover.Root defaultOpen placement="bottom" onOpenChange={onOpenChange}>
        <Popover.Trigger>
          <text>열기</text>
        </Popover.Trigger>
        <Bubble withArrow={false} positionerProps={{ container: "window", overlayLevel: 2 }} />
      </Popover.Root>,
    );
    await flush();

    expect(query("overlay")).toHaveAttribute("level", "2");
    // reference bottom 340 - layer top -50
    expect(positionerStyle()).toContain("position: absolute");
    expect(positionerStyle()).toContain("top: 390px");
    expect(query(".positioner")).toHaveAttribute("event-through", "false");

    expect(
      query("overlay").querySelectorAll('view[event-through="false"]:not(.positioner)'),
    ).toHaveLength(0);

    const layer = query(".positioner").parentElement as
      | (Element & { eventMap?: Record<string, unknown> })
      | null;
    if (!layer?.eventMap?.["global-bindEvent:tap"]) throw new Error("Expected the layer listener.");
    tapPageAt(layer, 10, 10);
    await flush(2);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
