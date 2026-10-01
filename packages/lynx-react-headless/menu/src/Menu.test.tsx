import "@testing-library/jest-dom";
import { act, createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import type * as LynxUiCommon from "@lynx-js/lynx-ui-common";
import type { Rect } from "@seed-design/lynx-react-floating";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Menu, type MenuOpenChangeDetails } from "./index.js";

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
let layerBox: Box;

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

function fireNativeEvent(element: Element, eventName: string, detail: Record<string, number> = {}) {
  const init = { eventType: "bindEvent", eventName, detail };
  const event = createEvent(`bindEvent:${eventName}`, element, init);
  Object.assign(event, init);
  lynxTestingEnv.switchToBackgroundThread();
  act(() => {
    element.dispatchEvent(event);
  });
}

// Positioner className은 레이어 요소에 붙고, 측정 기준 레이어 view는 그 첫 자식입니다.
function layer() {
  const element = query(".positioner").firstElementChild;
  if (!element) throw new Error("Expected the menu layer to be rendered.");
  return element;
}

/** 레이어의 첫 자식이 화면 전체를 덮는 backdrop입니다. */
function backdrop() {
  const element = layer().firstElementChild;
  if (!element) throw new Error("Expected the menu backdrop to be rendered.");
  return element;
}

// 직렬화된 inline style의 공백을 지워 `prop:value` 형태로 비교합니다.
function styleOf(element: Element) {
  return (element.getAttribute("style") ?? "").replace(/\s/g, "");
}

function contentStyle() {
  return styleOf(query(".content"));
}

async function measureContent(size: { width: number; height: number }) {
  fireNativeEvent(query(".content"), "layoutchange", size);
  await flush();
}

beforeEach(() => {
  frames.length = 0;
  triggerBox = { left: 100, top: 300, width: 40, height: 40 };
  layerBox = { left: 0, top: 20, width: 390, height: 844 };
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
    if (element?.parentElement?.classList.contains("positioner")) return toRect(layerBox);
    return toRect(triggerBox);
  });
});

function TestMenu({
  calls = [],
  rootProps,
  positionerProps,
  triggerDisabled,
}: {
  calls?: string[];
  rootProps?: Menu.RootProps;
  positionerProps?: Menu.PositionerProps;
  triggerDisabled?: boolean;
}) {
  return (
    <Menu.Root
      onOpenChange={(open: boolean, details: MenuOpenChangeDetails) =>
        calls.push(`open:${open}:${details.reason}`)
      }
      {...rootProps}
    >
      <Menu.Trigger
        className="trigger"
        disabled={triggerDisabled}
        bindtap={() => calls.push("trigger")}
      >
        <text>열기</text>
      </Menu.Trigger>
      <Menu.Positioner className="positioner" {...positionerProps}>
        <Menu.Content className="content">
          <Menu.Group>
            <Menu.GroupLabel>그룹</Menu.GroupLabel>
            <Menu.Item className="item-edit" bindtap={() => calls.push("item:edit")}>
              <text>편집</text>
            </Menu.Item>
            <Menu.Item className="item-delete" disabled bindtap={() => calls.push("item:delete")}>
              <text>삭제</text>
            </Menu.Item>
          </Menu.Group>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}

describe("Menu", () => {
  it("toggles with the trigger, reports the change before the user tap handler, and exposes expanded state", () => {
    const calls: string[] = [];
    render(<TestMenu calls={calls} />);
    const trigger = query(".trigger");

    expect(trigger).toHaveAttribute("accessibility-value", "collapsed");
    expect(trigger).toHaveAttribute("accessibility-traits", "button");
    expect(elementTree.root?.querySelector(".positioner")).toBeNull();

    fireEvent.tap(trigger);
    expect(calls).toEqual(["open:true:trigger", "trigger"]);
    expect(trigger).toHaveAttribute("accessibility-value", "expanded");
    expect(query(".positioner")).toBeInTheDocument();
  });

  it("does not open from a disabled Root or Trigger", () => {
    for (const props of [{ rootProps: { disabled: true } }, { triggerDisabled: true }]) {
      const calls: string[] = [];
      const { unmount } = render(<TestMenu calls={calls} {...props} />);
      const trigger = query(".trigger");

      expect(trigger).toHaveAttribute("accessibility-traits", "disabled");
      fireEvent.tap(trigger);
      expect(calls).toEqual([]);
      expect(trigger).toHaveAttribute("accessibility-value", "collapsed");
      unmount();
    }
  });

  it("runs the item callback before closing with itemClick and ignores disabled items", () => {
    const calls: string[] = [];
    render(<TestMenu calls={calls} rootProps={{ defaultOpen: true }} />);

    expect(query(".item-delete")).toHaveAttribute("accessibility-traits", "disabled");
    fireEvent.tap(query(".item-delete"));
    expect(calls).toEqual([]);

    fireEvent.tap(query(".item-edit"));
    expect(calls).toEqual(["item:edit", "open:false:itemClick"]);
    expect(query(".trigger")).toHaveAttribute("accessibility-value", "collapsed");
  });

  it("keeps the content hidden until it is measured, then places it in layer coordinates", async () => {
    render(<TestMenu rootProps={{ defaultOpen: true }} />);
    await flush();

    expect(contentStyle()).toContain("visibility:hidden");

    await measureContent({ width: 200, height: 300 });

    const style = contentStyle();
    expect(style).toContain("visibility:visible");
    // 기준 요소 아래 gutter 8px. 화면 좌표 top 348에서 레이어 top 20을 뺍니다.
    expect(style).toContain("top:328px");
    expect(style).toContain("left:20px");
    expect(style).toContain("width:200px");
    expect(style).toContain("max-height:300px");
  });

  it("limits a long list to the available height", async () => {
    render(<TestMenu rootProps={{ defaultOpen: true }} />);
    await flush();
    await measureContent({ width: 200, height: 900 });

    // 화면 높이 844 - 기준 요소 아래 348 - overflowPadding 8
    expect(contentStyle()).toContain("max-height:488px");
  });

  it("hides the previous position when reopened before the exit transition ends", async () => {
    const calls: string[] = [];
    render(<TestMenu calls={calls} rootProps={{ defaultOpen: true }} />);
    await flush();
    await measureContent({ width: 200, height: 300 });
    expect(contentStyle()).toContain("visibility:visible");

    fireEvent.tap(backdrop());
    triggerBox = { left: 100, top: 100, width: 40, height: 40 };
    fireEvent.tap(query(".trigger"));

    expect(calls).toEqual(["open:false:interactOutside", "open:true:trigger", "trigger"]);
    expect(contentStyle()).toContain("visibility:hidden");

    await flush();
    expect(contentStyle()).toContain("visibility:visible");
    expect(contentStyle()).toContain("top:128px");
  });

  it("closes from the trigger area over the layer with the trigger reason", async () => {
    const calls: string[] = [];
    render(<TestMenu calls={calls} rootProps={{ defaultOpen: true }} />);
    await flush();
    await measureContent({ width: 200, height: 300 });

    // Trigger와 같은 크기(40×40)·위치의 탭 영역입니다.
    const proxy = Array.from(layer().querySelectorAll("view")).find((element) =>
      styleOf(element).includes("width:40px;height:40px"),
    );
    if (!proxy) throw new Error("Expected the trigger tap area to be rendered.");
    expect(styleOf(proxy)).toContain("top:280px");
    fireEvent.tap(proxy);
    expect(calls).toEqual(["open:false:trigger", "trigger"]);
  });

  it("unmounts after closing even without an exit transition signal", async () => {
    vi.useFakeTimers();
    try {
      render(<TestMenu rootProps={{ defaultOpen: true }} />);
      await vi.advanceTimersByTimeAsync(0);
      fireNativeEvent(query(".content"), "layoutchange", { width: 200, height: 300 });
      await vi.advanceTimersByTimeAsync(0);
      expect(contentStyle()).toContain("visibility:visible");

      fireEvent.tap(backdrop());
      await act(() => vi.advanceTimersByTimeAsync(199));
      expect(query(".positioner")).toBeInTheDocument();
      await act(() => vi.advanceTimersByTimeAsync(1));
      expect(elementTree.root?.querySelector(".positioner")).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it("renders a fixed view layer without a container", () => {
    render(<TestMenu rootProps={{ defaultOpen: true }} />);

    expect(elementTree.root?.querySelector("overlay")).toBeNull();
    expect(styleOf(query(".positioner"))).toContain("position:fixed");
  });

  it("renders a native overlay with a container and closes on its close request", () => {
    const calls: string[] = [];
    render(
      <TestMenu
        calls={calls}
        rootProps={{ defaultOpen: true }}
        positionerProps={{ container: "window" }}
      />,
    );
    const overlay = query("overlay");

    expect(query(".positioner")).toHaveAttribute("event-through", "false");
    expect(styleOf(query(".positioner"))).toContain("position:relative");

    fireNativeEvent(overlay, "requestclose");
    expect(calls).toEqual(["open:false:dismiss"]);
  });

  it("keeps the user's event-through choice on the overlay layer", () => {
    render(
      <TestMenu
        rootProps={{ defaultOpen: true }}
        positionerProps={{ container: "window", overlayViewProps: { "event-through": true } }}
      />,
    );

    expect(query(".positioner")).toHaveAttribute("event-through", "true");
  });

  it("ignores the overlay dismissal sent before an overlayLevel layer is shown", () => {
    const calls: string[] = [];
    render(
      <TestMenu
        calls={calls}
        rootProps={{ defaultOpen: true }}
        positionerProps={{ container: "window", overlayLevel: 2 }}
      />,
    );
    const overlay = query("overlay");

    fireNativeEvent(overlay, "dismissoverlay");
    expect(calls).toEqual([]);
    expect(query(".positioner")).toBeInTheDocument();

    fireNativeEvent(overlay, "showoverlay");
    fireNativeEvent(overlay, "dismissoverlay");
    expect(calls).toEqual(["open:false:dismiss"]);
    expect(elementTree.root?.querySelector(".positioner")).toBeNull();
  });
});
