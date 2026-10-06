import "@testing-library/jest-dom";
import { act, cleanup, createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";
import type { Rect } from "@seed-design/lynx-react-floating";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Select, type SelectOpenChangeDetails, type SelectSelectedItem } from "./index.js";

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
let triggerBox: Box;
let listBox: Box;
let itemBoxes: Record<string, Box>;

function toRect({ left, top, width, height }: Box): Rect {
  return { left, top, width, height, right: left + width, bottom: top + height };
}

function elementForRef(current: unknown) {
  if (!current || typeof current !== "object" || !("refAttr" in current)) return null;
  const refAttr = current.refAttr;
  if (!Array.isArray(refAttr)) return null;
  return elementTree.root?.querySelector(`[react-ref-${refAttr[0]}-${refAttr[1]}]`) ?? null;
}

// 측정은 비동기 native query를 거치므로 frame과 macrotask를 번갈아 진행합니다.
async function flush(rounds = 10) {
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

function fireNativeEvent(element: Element, eventName: string) {
  const init = { eventType: "bindEvent", eventName, detail: {} };
  const event = createEvent(`bindEvent:${eventName}`, element, init);
  Object.assign(event, init);
  lynxTestingEnv.switchToBackgroundThread();
  act(() => {
    element.dispatchEvent(event);
  });
}

// 직렬화된 inline style의 공백을 지워 `prop:value` 형태로 비교합니다.
function styleOf(element: Element) {
  return (element.getAttribute("style") ?? "").replace(/\s/g, "");
}

/** Positioner className은 레이어 요소에 붙고, 그 첫 자식이 측정 기준 레이어, 그 첫 자식이 backdrop입니다. */
function backdrop() {
  const element = query(".positioner").firstElementChild?.firstElementChild;
  if (!element) throw new Error("Expected the select backdrop to be rendered.");
  return element;
}

beforeEach(() => {
  cleanup();
  frames.length = 0;
  triggerBox = { left: 20, top: 100, width: 350, height: 48 };
  listBox = { left: 0, top: 0, width: 350, height: 200 };
  itemBoxes = {};
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
    if (element?.parentElement?.classList.contains("positioner")) {
      return toRect({ left: 0, top: 0, width: 390, height: 844 });
    }
    if (element?.classList.contains("list")) return toRect(listBox);
    const value = element?.getAttribute("data-value");
    if (value && itemBoxes[value]) return toRect(itemBoxes[value]);
    return toRect(triggerBox);
  });
});

function TestSelect({
  calls = [],
  rootProps,
  positionerProps,
  contentProps,
  scrollAreaRef,
  extraItems = 0,
}: {
  calls?: string[];
  rootProps?: Select.RootProps;
  positionerProps?: Select.PositionerProps;
  contentProps?: Select.ContentProps;
  scrollAreaRef?: (node: unknown) => void;
  extraItems?: number;
}) {
  return (
    <Select.Root
      onValueChange={(value: string[]) => calls.push(`value:${value.join(",")}`)}
      onOpenChange={(open: boolean, details: SelectOpenChangeDetails) =>
        calls.push(`open:${open}:${details.reason}`)
      }
      {...rootProps}
    >
      <Select.Trigger className="trigger" bindtap={() => calls.push("trigger")}>
        <Select.Value className="value" />
        <Select.Placeholder>선택</Select.Placeholder>
      </Select.Trigger>
      <Select.Positioner className="positioner" {...positionerProps}>
        <Select.Content className="content" {...contentProps}>
          <Select.ScrollArea ref={scrollAreaRef} contentClassName="list">
            <Select.Group>
              <Select.GroupLabel>과일</Select.GroupLabel>
              <Select.Item className="item-apple" data-value="apple" value="apple" label="사과" />
              <Select.Item
                className="item-banana"
                data-value="banana"
                value="banana"
                label="바나나"
                disabled
                bindtap={() => calls.push("item:banana")}
              />
              <Select.Item
                className="item-cherry"
                data-value="cherry"
                value="cherry"
                label="체리"
                textValue="체리 열매"
                bindtap={() => calls.push("item:cherry")}
              />
              {Array.from({ length: extraItems }, (_, index) => (
                <Select.Item key={index} value={`extra-${index}`} label={`추가 ${index}`} />
              ))}
            </Select.Group>
          </Select.ScrollArea>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}

describe("Select", () => {
  it("resolves the default value label while closed and keeps the closed layer hidden", () => {
    render(<TestSelect rootProps={{ defaultValue: ["cherry"] }} />);

    expect(query(".value")).toHaveTextContent("체리 열매");
    expect(elementTree.root?.querySelector("overlay")).toBeNull();
    expect(styleOf(query(".positioner"))).toContain("position:fixed");
    expect(styleOf(query(".positioner"))).toContain("display:none");
    expect(query(".trigger")).toHaveAttribute("accessibility-value", "collapsed");
  });

  it("shows the placeholder until a value resolves and passes unresolved values to formatValue", () => {
    render(<TestSelect rootProps={{ defaultValue: ["unknown"] }} />);
    expect(query(".trigger")).toHaveTextContent("선택");

    cleanup();
    const formatValue = (items: SelectSelectedItem[]) =>
      items.map((item) => `${item.value}:${item.textValue}:${item.resolved}`).join("|");
    render(
      <TestSelect
        rootProps={{ multiple: true, defaultValue: ["apple", "unknown"], formatValue }}
      />,
    );
    expect(query(".value")).toHaveTextContent("apple:사과:true|unknown::false");
  });

  it("selects a single value, runs the item callback after the change, and closes with itemSelect", () => {
    const calls: string[] = [];
    render(<TestSelect calls={calls} rootProps={{ defaultValue: ["apple"] }} />);

    fireEvent.tap(query(".trigger"));
    expect(query(".trigger")).toHaveAttribute("accessibility-value", "expanded");
    expect(query(".item-apple")).toHaveAttribute("accessibility-value", "selected");

    fireEvent.tap(query(".item-banana"));
    fireEvent.tap(query(".item-cherry"));

    expect(calls).toEqual([
      "open:true:trigger",
      "trigger",
      "value:cherry",
      "open:false:itemSelect",
      "item:cherry",
    ]);
    expect(query(".item-banana")).toHaveAttribute("accessibility-traits", "disabled");
    expect(query(".value")).toHaveTextContent("체리 열매");
    expect(query(".trigger")).toHaveAttribute("accessibility-value", "collapsed");
  });

  it("toggles values in multiple mode and keeps the list open", () => {
    const calls: string[] = [];
    render(<TestSelect calls={calls} rootProps={{ multiple: true, defaultOpen: true }} />);

    fireEvent.tap(query(".item-apple"));
    fireEvent.tap(query(".item-cherry"));
    fireEvent.tap(query(".item-apple"));

    expect(calls).toEqual(["value:apple", "value:apple,cherry", "item:cherry", "value:cherry"]);
    expect(query(".trigger")).toHaveAttribute("accessibility-value", "expanded");
  });

  it("keeps a controlled value until the parent applies it", () => {
    const calls: string[] = [];
    render(<TestSelect calls={calls} rootProps={{ value: ["apple"], defaultOpen: true }} />);

    fireEvent.tap(query(".item-cherry"));

    expect(calls).toEqual(["value:cherry", "open:false:itemSelect", "item:cherry"]);
    expect(query(".value")).toHaveTextContent("사과");
  });

  it("does not open or change the value when the Root is disabled or read-only", () => {
    for (const rootProps of [{ disabled: true }, { readOnly: true }]) {
      cleanup();
      const calls: string[] = [];
      render(<TestSelect calls={calls} rootProps={{ ...rootProps, defaultValue: ["apple"] }} />);

      expect(query(".trigger")).toHaveAttribute("accessibility-traits", "disabled");
      expect(query(".item-cherry")).toHaveAttribute("accessibility-traits", "disabled");
      fireEvent.tap(query(".trigger"));
      fireEvent.tap(query(".item-cherry"));

      expect(calls).toEqual([]);
      expect(query(".trigger")).toHaveAttribute("accessibility-value", "collapsed");
    }
  });

  it("keeps the content hidden until it is measured, then places it under the trigger in layer coordinates", async () => {
    render(<TestSelect rootProps={{ defaultOpen: true }} />);
    expect(styleOf(query(".content"))).toContain("visibility:hidden");

    await flush();

    const style = styleOf(query(".content"));
    expect(style).toContain("visibility:visible");
    expect(style).toContain("left:20px");
    // 기준 요소 아래 gutter 8px
    expect(style).toContain("top:156px");
    expect(style).toContain("width:350px");
    expect(styleOf(query(".positioner"))).toContain("display:flex");
  });

  it("limits the width to the available width and measures the list again", async () => {
    triggerBox = { left: 5, top: 100, width: 380, height: 48 };
    render(<TestSelect rootProps={{ defaultOpen: true }} />);
    await flush();

    // 화면 너비 390 - overflowPadding 8 × 2
    expect(styleOf(query(".content"))).toContain("width:374px");
    expect(styleOf(query(".content"))).toContain("visibility:visible");
  });

  it("hides the previous position when reopened before the exit transition ends", async () => {
    const calls: string[] = [];
    render(<TestSelect calls={calls} rootProps={{ defaultOpen: true }} />);
    await flush();
    expect(styleOf(query(".content"))).toContain("top:156px");

    fireEvent.tap(backdrop());
    triggerBox = { left: 20, top: 300, width: 350, height: 48 };
    fireEvent.tap(query(".trigger"));

    expect(calls).toEqual(["open:false:interactOutside", "open:true:trigger", "trigger"]);
    expect(styleOf(query(".content"))).toContain("visibility:hidden");

    await flush();
    expect(styleOf(query(".content"))).toContain("visibility:visible");
    expect(styleOf(query(".content"))).toContain("top:356px");
  });

  it("scrolls a long list only as far as needed to show the selected item", async () => {
    const exec = vi.fn();
    const scrollBy = vi.fn(() => ({ exec }));
    listBox = { left: 0, top: 0, width: 350, height: 300 };
    itemBoxes = { cherry: { left: 0, top: 250, width: 350, height: 40 } };
    render(
      <TestSelect
        rootProps={{ defaultValue: ["cherry"], defaultOpen: true }}
        contentProps={{ maxHeight: 100 }}
        scrollAreaRef={(node) => {
          if (node && typeof node === "object") Object.assign(node, { invoke: scrollBy });
        }}
      />,
    );
    await flush();

    expect(styleOf(query(".list").parentElement!)).toContain("height:100px");
    expect(query(".list").parentElement).toHaveAttribute("enable-scroll", "true");
    expect(scrollBy).toHaveBeenCalledTimes(1);
    expect(scrollBy).toHaveBeenCalledWith({ method: "scrollBy", params: { offset: 190 } });
    expect(exec).toHaveBeenCalledTimes(1);
  });

  it("closes from the trigger area over the layer with the trigger reason", async () => {
    const calls: string[] = [];
    render(<TestSelect calls={calls} rootProps={{ defaultOpen: true }} />);
    await flush();

    const proxy = Array.from(query(".positioner").querySelectorAll("view")).find((element) =>
      styleOf(element).includes("width:350px;height:48px"),
    );
    if (!proxy) throw new Error("Expected the trigger tap area to be rendered.");
    fireEvent.tap(proxy);
    expect(calls).toEqual(["open:false:trigger", "trigger"]);
  });

  it("hides the layer after closing even without an exit transition signal", async () => {
    vi.useFakeTimers();
    try {
      render(<TestSelect rootProps={{ defaultOpen: true }} />);
      for (let round = 0; round < 5; round += 1) await act(() => vi.advanceTimersByTimeAsync(0));
      expect(styleOf(query(".content"))).toContain("visibility:visible");

      fireEvent.tap(backdrop());
      await act(() => vi.advanceTimersByTimeAsync(199));
      expect(styleOf(query(".positioner"))).toContain("display:flex");
      await act(() => vi.advanceTimersByTimeAsync(1));
      expect(styleOf(query(".positioner"))).toContain("display:none");
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders a native overlay with a container, hides it with visible while closed, and ignores that dismissal", async () => {
    const calls: string[] = [];
    render(<TestSelect calls={calls} positionerProps={{ container: "window" }} />);
    const overlay = query("overlay");

    expect(overlay).toHaveAttribute("visible", "false");
    expect(query(".positioner")).toHaveAttribute("event-through", "false");
    expect(styleOf(query(".positioner"))).toContain("position:relative");
    fireNativeEvent(overlay, "dismissoverlay");
    expect(calls).toEqual([]);

    fireEvent.tap(query(".trigger"));
    await flush();
    expect(overlay).toHaveAttribute("visible", "true");

    fireNativeEvent(overlay, "requestclose");
    expect(calls).toEqual(["open:true:trigger", "trigger", "open:false:dismiss"]);
  });

  it("ignores the overlay dismissal sent before an overlayLevel layer is shown", () => {
    const calls: string[] = [];
    render(
      <TestSelect
        calls={calls}
        rootProps={{ defaultOpen: true }}
        positionerProps={{ container: "window", overlayLevel: 2 }}
      />,
    );
    const overlay = query("overlay");

    fireNativeEvent(overlay, "dismissoverlay");
    expect(calls).toEqual([]);

    fireNativeEvent(overlay, "showoverlay");
    fireNativeEvent(overlay, "dismissoverlay");
    expect(calls).toEqual(["open:false:dismiss"]);
    expect(overlay).toHaveAttribute("visible", "false");
  });
});
