import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { act, createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as Tabs from "./Tabs.namespace.js";
import { useTabsContext } from "./useTabsContext.js";
import { useTabsTriggerContext } from "./useTabsTriggerContext.js";
import { useTabsCarouselCamera } from "./useTabsCarouselCamera.js";
import {
  areTabsTransitionsEnabled,
  getTabsLayoutWidth,
  getTabsScrollOffset,
  getTabsTriggerRects,
} from "./Tabs.utils.js";

function fireViewPagerEvent(
  pager: Element,
  eventName: "change" | "willchange" | "offsetchange",
  detail: { index: number; isDragged: boolean } | { offset: number },
) {
  const init = { eventType: "bindEvent", eventName, detail };
  const event = createEvent(`bindEvent:${eventName}`, pager, init);
  Object.assign(event, init);
  fireEvent(pager, event);
}

function BasicTabs(props: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Tabs.Root {...props}>
      <Tabs.List>
        <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
        <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
      <Tabs.Content value="two">두 번째 콘텐츠</Tabs.Content>
    </Tabs.Root>
  );
}

function getTrigger(container: HTMLElement, label: string) {
  const trigger = container.querySelector<HTMLElement>(
    `[accessibility-role-description="tab"][accessibility-label="${label}"]`,
  );
  if (!trigger) throw new Error(`Expected trigger for ${label} to exist.`);
  return trigger;
}

function getProbeState(container: HTMLElement, testId: string): unknown {
  const probe = container.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  if (!probe) throw new Error("Expected state probe.");
  return JSON.parse(probe.textContent ?? "null");
}

function ContextProbe() {
  const { value, visualValue, items, triggerRects, pagerValues, transitionsEnabled } =
    useTabsContext();
  return (
    <text data-testid="context">
      {JSON.stringify({ value, visualValue, items, triggerRects, pagerValues, transitionsEnabled })}
    </text>
  );
}

function TriggerProbe() {
  const { isSelected, isVisuallySelected, isDisabled, isPressed } = useTabsTriggerContext();
  return (
    <text data-testid="trigger-state">
      {JSON.stringify({ isSelected, isVisuallySelected, isDisabled, isPressed })}
    </text>
  );
}

function setNativeProps(ref: unknown, props: Record<string, string>) {
  if (!ref || typeof ref !== "object") throw new Error("Expected native ref.");
  const setProps: unknown = Reflect.get(ref, "setNativeProps");
  if (typeof setProps !== "function") throw new Error("Expected native operation.");
  const operation: unknown = setProps.call(ref, props);
  if (!operation || typeof operation !== "object") throw new Error("Expected native operation.");
  const exec: unknown = Reflect.get(operation, "exec");
  if (typeof exec !== "function") throw new Error("Expected native operation.");
  exec.call(operation);
}

function fireLayoutChange(element: Element, width: number) {
  const init = { eventType: "bindEvent", eventName: "layoutchange", detail: { width, left: 999 } };
  const event = createEvent("bindEvent:layoutchange", element, init);
  Object.assign(event, init);
  fireEvent(element, event);
}

describe("Tabs headless", () => {
  it("registers wrapped triggers in fragment order and preserves widths through reorder and removal", () => {
    function WrappedTrigger(props: React.ComponentProps<typeof Tabs.Trigger>) {
      return <Tabs.Trigger {...props} />;
    }
    function OrderedTabs({ order }: { order: string[] }) {
      return (
        <Tabs.Root defaultValue="one">
          <Tabs.List>
            <React.Fragment>
              {order.map((value) => (
                <WrappedTrigger key={value} value={value}>
                  {value}
                </WrappedTrigger>
              ))}
            </React.Fragment>
            <Tabs.Indicator />
          </Tabs.List>
          <ContextProbe />
        </Tabs.Root>
      );
    }
    const { container, rerender } = render(<OrderedTabs order={["one", "two", "three"]} />);
    const state = () => getProbeState(container, "context");
    expect(state()).toMatchObject({
      items: [
        { value: "one", disabled: false },
        { value: "two", disabled: false },
        { value: "three", disabled: false },
      ],
      triggerRects: {},
      transitionsEnabled: false,
    });
    fireLayoutChange(getTrigger(container, "three"), 120);
    fireLayoutChange(getTrigger(container, "one"), 80);
    expect(state()).toMatchObject({
      triggerRects: { one: { left: 0, width: 80 } },
      transitionsEnabled: false,
    });
    fireLayoutChange(getTrigger(container, "two"), 100);
    expect(state()).toMatchObject({
      triggerRects: {
        one: { left: 0, width: 80 },
        two: { left: 80, width: 100 },
        three: { left: 180, width: 120 },
      },
      transitionsEnabled: true,
    });
    rerender(<OrderedTabs order={["three", "two", "one"]} />);
    expect(state()).toMatchObject({
      items: [
        { value: "three", disabled: false },
        { value: "two", disabled: false },
        { value: "one", disabled: false },
      ],
      triggerRects: {
        three: { left: 0, width: 120 },
        two: { left: 120, width: 100 },
        one: { left: 220, width: 80 },
      },
    });
    rerender(<OrderedTabs order={["three", "one"]} />);
    expect(state()).toMatchObject({
      items: [
        { value: "three", disabled: false },
        { value: "one", disabled: false },
      ],
      triggerRects: { three: { left: 0, width: 120 }, one: { left: 120, width: 80 } },
    });
    rerender(<OrderedTabs order={["three", "two", "one"]} />);
    expect(state()).toMatchObject({
      triggerRects: { three: { left: 0, width: 120 } },
      transitionsEnabled: false,
    });
  });

  it("runs consumer tap before value change and exposes pressed state until end or cancel", () => {
    const order: string[] = [];
    const { container } = render(
      <Tabs.Root onValueChange={(value) => order.push(`value:${value}`)}>
        <Tabs.List>
          <Tabs.Trigger value="one" accessibility-label="one" bindtap={() => order.push("tap")}>
            <view>
              <text>Custom label</text>
              <TriggerProbe />
            </view>
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    );
    const trigger = getTrigger(container, "one");
    const state = () => getProbeState(container, "trigger-state");
    expect(state()).toEqual({
      isSelected: false,
      isVisuallySelected: false,
      isDisabled: false,
      isPressed: false,
    });
    fireEvent.touchstart(trigger, {});
    expect(state()).toMatchObject({ isPressed: true });
    fireEvent.touchend(trigger, {});
    expect(state()).toMatchObject({ isPressed: false });
    fireEvent.tap(trigger);
    expect(order).toEqual(["tap", "value:one"]);
    expect(state()).toMatchObject({ isSelected: true, isVisuallySelected: true });
    fireEvent.touchstart(trigger, {});
    fireEvent.touchcancel(trigger, {});
    expect(state()).toMatchObject({ isPressed: false });
  });

  it("previews dragged pager selection before committing and orders consumer callbacks", () => {
    const order: string[] = [];
    const { container } = render(
      <Tabs.Root defaultValue="one" onValueChange={(value) => order.push(`value:${value}`)}>
        <Tabs.List>
          <Tabs.Trigger value="one">one</Tabs.Trigger>
          <Tabs.Trigger value="two">two</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel
          swipeable
          onSwipeStart={() => order.push("start")}
          onSwipeEnd={() => order.push("end")}
          onSettle={() => order.push("settle")}
        >
          <Tabs.CarouselCamera
            bindwillchange={() => order.push("will")}
            bindchange={() => order.push("change")}
          >
            <Tabs.Content value="one">
              <text>One</text>
            </Tabs.Content>
            <Tabs.Content value="two">
              <text>Two</text>
            </Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
        <ContextProbe />
      </Tabs.Root>,
    );
    const pager = container.querySelector("viewpager")!;
    const state = () => getProbeState(container, "context");
    fireViewPagerEvent(pager, "willchange", { index: 1, isDragged: false });
    expect(state()).toMatchObject({ value: "one", visualValue: "one" });
    expect(order).toEqual(["will"]);
    order.length = 0;
    fireViewPagerEvent(pager, "willchange", { index: 1, isDragged: true });
    expect(state()).toMatchObject({ value: "one", visualValue: "two" });
    expect(getTrigger(container, "one")).toHaveAttribute("accessibility-value", "selected");
    fireViewPagerEvent(pager, "change", { index: 1, isDragged: true });
    fireEvent.touchend(pager, {});
    expect(state()).toMatchObject({ value: "two", visualValue: "two" });
    expect(order).toEqual(["will", "start", "change", "value:two", "settle", "end"]);
    fireViewPagerEvent(pager, "change", { index: 99, isDragged: false });
    expect(state()).toMatchObject({ value: "two", visualValue: "two" });
  });

  it("lets a background-only camera consumer observe offsets without committing selection", () => {
    function OffsetCamera() {
      const [offset, setOffset] = React.useState(0);
      const { cameraProps } = useTabsCarouselCamera({
        bindoffsetchange: (event) => setOffset(Number(event.detail.offset)),
      });
      // 테스트 런타임의 MT/BG 이벤트 덮어쓰기를 피하는 BG 전용 hook 소비자다.
      const { "main-thread:bindoffsetchange": _indicatorOffset, ...backgroundProps } = cameraProps;
      return (
        <>
          <viewpager {...backgroundProps}>
            <viewpager-item>
              <text>One</text>
            </viewpager-item>
            <viewpager-item>
              <text>Two</text>
            </viewpager-item>
          </viewpager>
          <text data-testid="offset">{offset}</text>
        </>
      );
    }
    const { container, getByTestId } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">one</Tabs.Trigger>
          <Tabs.Trigger value="two">two</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel swipeable>
          <OffsetCamera />
        </Tabs.Carousel>
        <ContextProbe />
      </Tabs.Root>,
    );
    fireViewPagerEvent(container.querySelector("viewpager")!, "offsetchange", { offset: 0.5 });
    expect(getByTestId("offset")).toHaveTextContent("0.5");
    expect(getProbeState(container, "context")).toMatchObject({
      value: "one",
      visualValue: "one",
    });
    expect(getTrigger(container, "one")).toHaveAttribute("accessibility-value", "selected");
    expect(getTrigger(container, "two")).toHaveAttribute("accessibility-value", "not selected");
  });

  it("disables transitions when a dynamically added trigger is unmeasured", () => {
    const rects = getTabsTriggerRects(["one", "two"], { one: 80, two: 80 });

    expect(areTabsTransitionsEnabled(["one", "two"], rects)).toBe(true);
    expect(areTabsTransitionsEnabled(["one", "two", "three"], rects)).toBe(false);
  });

  it("keeps transitions off in the update that first applies measured trigger geometry", () => {
    const renders: { measured: boolean; transitionsEnabled: boolean }[] = [];
    function RenderLog() {
      const { triggerRects, transitionsEnabled } = useTabsContext();
      renders.push({ measured: Object.keys(triggerRects).length === 2, transitionsEnabled });
      return null;
    }
    const { container } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
        </Tabs.List>
        <RenderLog />
      </Tabs.Root>,
    );

    fireLayoutChange(getTrigger(container, "첫 번째"), 80);
    fireLayoutChange(getTrigger(container, "두 번째"), 100);

    const firstMeasured = renders.find((entry) => entry.measured);
    expect(firstMeasured).toEqual({ measured: true, transitionsEnabled: false });
    expect(renders.at(-1)).toEqual({ measured: true, transitionsEnabled: true });
  });

  it("changes an uncontrolled value when a trigger is tapped", () => {
    const onValueChange = vi.fn();
    const { container } = render(<BasicTabs defaultValue="one" onValueChange={onValueChange} />);

    const first = getTrigger(container, "첫 번째");
    const second = getTrigger(container, "두 번째");

    expect(first).toHaveAttribute("accessibility-value", "selected");
    expect(second).toHaveAttribute("accessibility-value", "not selected");

    fireEvent.tap(second);

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(second).toHaveAttribute("accessibility-value", "selected");
  });

  it("calls bindtap when the selected trigger is tapped again", () => {
    const bindtap = vi.fn();
    const onValueChange = vi.fn();
    const { container } = render(
      <Tabs.Root defaultValue="one" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="one" bindtap={bindtap}>
            첫 번째
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    );

    fireEvent.tap(getTrigger(container, "첫 번째"));

    expect(bindtap).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("derives trigger positions from ordered widths instead of platform coordinates", () => {
    expect(getTabsLayoutWidth({ detail: { width: 128 }, params: { width: 128 } })).toBe(128);
    expect(
      getTabsTriggerRects(["one", "two", "three"], {
        one: 128,
        two: 128,
        three: 128,
      }),
    ).toEqual({
      one: { left: 0, width: 128 },
      two: { left: 128, width: 128 },
      three: { left: 256, width: 128 },
    });
  });

  it("waits for every preceding trigger width before positioning later triggers", () => {
    expect(getTabsTriggerRects(["one", "two", "three"], { one: 80, three: 120 })).toEqual({
      one: { left: 0, width: 80 },
    });
  });

  it("ignores inherited object properties used as trigger values", () => {
    expect(getTabsTriggerRects(["toString"], {})).toEqual({});
    expect(getTabsTriggerRects(["constructor"], {})).toEqual({});
    expect(getTabsTriggerRects(["__proto__"], {})).toEqual({});
  });

  it("calculates tab scroll offsets from content insets and measured widths", () => {
    const geometry = {
      viewportWidth: 360,
      contentWidth: 792,
      contentInsetStart: 16,
      contentInsetEnd: 16,
      triggerRect: { left: 320, width: 56 },
    };

    expect(getTabsScrollOffset({ ...geometry, scrollAlign: "start", currentOffset: 0 })).toBe(320);
    expect(getTabsScrollOffset({ ...geometry, scrollAlign: "center", currentOffset: 0 })).toBe(184);
    expect(getTabsScrollOffset({ ...geometry, scrollAlign: "end", currentOffset: 0 })).toBe(48);
    expect(getTabsScrollOffset({ ...geometry, scrollAlign: "nearest", currentOffset: 0 })).toBe(48);
    expect(getTabsScrollOffset({ ...geometry, scrollAlign: "nearest", currentOffset: 160 })).toBe(
      160,
    );
    // A trigger can sit inside the desired 16px padding while remaining fully
    // visible in the actual scroll viewport; nearest must not move it.
    expect(
      getTabsScrollOffset({
        ...geometry,
        scrollAlign: "nearest",
        currentOffset: 200,
        triggerRect: { left: 192, width: 56 },
      }),
    ).toBe(200);
    expect(
      getTabsScrollOffset({
        ...geometry,
        scrollAlign: "nearest",
        currentOffset: 240,
        triggerRect: { left: 192, width: 56 },
      }),
    ).toBe(192);
  });

  it("clamps tab scrolling at both content edges without moving a non-scrollable list", () => {
    const geometry = {
      viewportWidth: 360,
      contentWidth: 792,
      contentInsetStart: 16,
      contentInsetEnd: 16,
    };

    expect(
      getTabsScrollOffset({
        ...geometry,
        scrollAlign: "end",
        currentOffset: 0,
        triggerRect: { left: 0, width: 56 },
      }),
    ).toBe(0);
    expect(
      getTabsScrollOffset({
        ...geometry,
        scrollAlign: "start",
        currentOffset: 0,
        triggerRect: { left: 704, width: 56 },
      }),
    ).toBe(432);
    expect(
      getTabsScrollOffset({
        ...geometry,
        contentWidth: 360,
        scrollAlign: "center",
        currentOffset: 144,
        triggerRect: { left: 320, width: 56 },
      }),
    ).toBe(0);
  });

  it("blocks disabled activation and pressed feedback", () => {
    const onValueChange = vi.fn();
    const bindtap = vi.fn();
    const { container } = render(
      <Tabs.Root defaultValue="one" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="two" disabled accessibility-label="두 번째" bindtap={bindtap}>
            <text>두 번째</text>
            <TriggerProbe />
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    );

    const disabled = getTrigger(container, "두 번째");
    fireEvent.touchstart(disabled, {});
    expect(getProbeState(container, "trigger-state")).toEqual({
      isSelected: false,
      isVisuallySelected: false,
      isDisabled: true,
      isPressed: false,
    });
    fireEvent.tap(disabled);

    expect(onValueChange).not.toHaveBeenCalled();
    expect(bindtap).not.toHaveBeenCalled();
    expect(disabled).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("keeps controlled selection until the value prop changes", () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(<BasicTabs value="one" onValueChange={onValueChange} />);

    const second = getTrigger(container, "두 번째");
    fireEvent.tap(second);

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(second).toHaveAttribute("accessibility-value", "not selected");

    rerender(<BasicTabs value="two" onValueChange={onValueChange} />);
    expect(second).toHaveAttribute("accessibility-value", "selected");
  });

  it("keeps carousel contents as views without a carousel camera", () => {
    const { container } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel>
          <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
        </Tabs.Carousel>
      </Tabs.Root>,
    );

    expect(container.querySelector("viewpager-item")).toBeNull();
    expect(container.querySelector('[accessibility-role-description="tabpanel"]')).not.toBeNull();
  });

  it("starts only for native drags and closes non-changing or cancelled swipes", () => {
    function SwipeLifecycleTabs() {
      const [counts, setCounts] = React.useState({ starts: 0, ends: 0, settles: 0 });
      const isSwiping = counts.starts > counts.ends;

      return (
        <Tabs.Root defaultValue="one">
          <Tabs.List>
            <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
            <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Carousel
            swipeable
            onSwipeStart={() =>
              setCounts((current) => ({ ...current, starts: current.starts + 1 }))
            }
            onSwipeEnd={() => setCounts((current) => ({ ...current, ends: current.ends + 1 }))}
            onSettle={() => setCounts((current) => ({ ...current, settles: current.settles + 1 }))}
          >
            <Tabs.CarouselCamera>
              <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
              <Tabs.Content value="two">두 번째 콘텐츠</Tabs.Content>
            </Tabs.CarouselCamera>
          </Tabs.Carousel>
          <text data-testid="swipe-state">{isSwiping ? "swiping" : "idle"}</text>
          <text data-testid="swipe-counts">
            {`${counts.starts}/${counts.ends}/${counts.settles}`}
          </text>
        </Tabs.Root>
      );
    }

    const { container, getByTestId } = render(<SwipeLifecycleTabs />);
    const pager = container.querySelector("viewpager")!;

    fireEvent.touchstart(pager, {});
    expect(getByTestId("swipe-state")).toHaveTextContent("idle");
    fireEvent.touchend(pager, {});
    expect(getByTestId("swipe-counts")).toHaveTextContent("0/0/0");

    fireEvent.touchstart(pager, {});
    fireViewPagerEvent(pager, "willchange", { index: 1, isDragged: true });
    expect(getByTestId("swipe-state")).toHaveTextContent("swiping");
    fireViewPagerEvent(pager, "change", { index: 1, isDragged: true });
    fireEvent.touchend(pager, {});

    expect(getByTestId("swipe-state")).toHaveTextContent("idle");
    expect(getByTestId("swipe-counts")).toHaveTextContent("1/1/1");

    fireEvent.touchstart(pager, {});
    fireViewPagerEvent(pager, "willchange", { index: 1, isDragged: true });
    fireEvent.touchend(pager, {});

    expect(getByTestId("swipe-state")).toHaveTextContent("idle");
    expect(getByTestId("swipe-counts")).toHaveTextContent("2/2/1");

    fireEvent.touchstart(pager, {});
    fireViewPagerEvent(pager, "willchange", { index: 0, isDragged: true });
    fireViewPagerEvent(pager, "change", { index: 0, isDragged: true });
    fireEvent.touchend(pager, {});

    expect(getByTestId("swipe-state")).toHaveTextContent("idle");
    expect(getByTestId("swipe-counts")).toHaveTextContent("3/3/2");

    fireEvent.touchstart(pager, {});
    fireViewPagerEvent(pager, "willchange", { index: 0, isDragged: true });
    fireEvent.touchcancel(pager, {});
    fireEvent.touchend(pager, {});
    expect(getByTestId("swipe-state")).toHaveTextContent("idle");
    expect(getByTestId("swipe-counts")).toHaveTextContent("4/4/2");
  });

  it("supports the complete CSS-free native tree and consumer ref operations", () => {
    const refs = new Map<string, unknown>();
    const capture = (slot: string) => (ref: unknown) => {
      refs.set(slot, ref);
    };
    const { container } = render(
      <Tabs.Root defaultValue="one" data-testid="root" ref={capture("root")}>
        <Tabs.List
          data-testid="list"
          ref={capture("list")}
          listContentProps={{ id: "list-content" }}
        >
          <Tabs.Trigger value="one" ref={capture("trigger")}>
            one
          </Tabs.Trigger>
          <Tabs.Trigger value="two">two</Tabs.Trigger>
          <Tabs.Indicator data-testid="indicator" ref={capture("indicator")} />
        </Tabs.List>
        <Tabs.Carousel swipeable data-testid="carousel" ref={capture("carousel")}>
          <Tabs.CarouselCamera data-testid="camera" ref={capture("camera")}>
            <Tabs.Content value="one" data-testid="content" ref={capture("content")}>
              <text>One</text>
            </Tabs.Content>
            <Tabs.Content value="two">
              <text>Two</text>
            </Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
      </Tabs.Root>,
    );
    expect(container.querySelector("[class]")).toBeNull();
    const list = container.querySelector("scroll-view")!;
    const pager = container.querySelector("viewpager")!;
    expect(list).toHaveAttribute("accessibility-traits", "tabbar");
    expect(list.firstElementChild).toHaveAttribute("id", "list-content");
    expect(pager.querySelectorAll(":scope > viewpager-item")).toHaveLength(2);
    expect(pager).toHaveAttribute("enable-scroll");
    const selectors = {
      root: '[data-testid="root"]',
      list: "scroll-view",
      trigger: '[accessibility-label="one"]',
      carousel: '[data-testid="carousel"]',
      camera: "viewpager",
      content: '[data-testid="content"]',
      indicator: '[data-testid="indicator"]',
    };
    for (const [slot, selector] of Object.entries(selectors)) {
      act(() => setNativeProps(refs.get(slot), { "data-consumer-operation": slot }));
      expect(container.querySelector(selector)).toHaveAttribute("data-consumer-operation", slot);
    }
    fireEvent.tap(getTrigger(container, "two"));
    expect(getTrigger(container, "two")).toHaveAttribute("accessibility-value", "selected");
    expect(container.querySelector('[data-testid="content"]')).toHaveAttribute(
      "accessibility-elements-hidden",
      "true",
    );
    expect(
      pager.querySelectorAll('[accessibility-role-description="tabpanel"]')[1],
    ).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("supports a custom iOS back gesture edge width", () => {
    const { container } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel swipeable iosBackGestureEdgeWidth={48}>
          <Tabs.CarouselCamera>
            <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
      </Tabs.Root>,
    );

    expect(container.querySelector("viewpager")).toHaveAttribute("ios-gesture-offset", "48");
  });

  it("excludes disabled content and remaps native pager indexes when disabled changes", () => {
    function DisabledTabs({ disabled }: { disabled: boolean }) {
      return (
        <Tabs.Root defaultValue="two">
          <Tabs.List>
            <Tabs.Trigger value="one">one</Tabs.Trigger>
            <Tabs.Trigger value="disabled" disabled={disabled}>
              disabled
            </Tabs.Trigger>
            <Tabs.Trigger value="two">two</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Carousel swipeable>
            <Tabs.CarouselCamera>
              <Tabs.Content value="one">
                <text>One</text>
              </Tabs.Content>
              <Tabs.Content value="disabled">
                <text>Disabled content</text>
              </Tabs.Content>
              <Tabs.Content value="two">
                <text>Two</text>
              </Tabs.Content>
            </Tabs.CarouselCamera>
          </Tabs.Carousel>
          <ContextProbe />
        </Tabs.Root>
      );
    }
    const { container, rerender } = render(<DisabledTabs disabled />);
    const pager = container.querySelector("viewpager")!;
    expect(pager.querySelectorAll("viewpager-item")).toHaveLength(2);
    expect(pager).not.toHaveTextContent("Disabled content");
    expect(pager).toHaveAttribute("initial-select-index", "1");
    expect(getProbeState(container, "context")).toMatchObject({
      pagerValues: ["one", "two"],
    });
    fireViewPagerEvent(pager, "change", { index: 0, isDragged: true });
    expect(getTrigger(container, "one")).toHaveAttribute("accessibility-value", "selected");
    fireViewPagerEvent(pager, "change", { index: 1, isDragged: true });
    expect(getTrigger(container, "two")).toHaveAttribute("accessibility-value", "selected");
    rerender(<DisabledTabs disabled={false} />);
    expect(pager.querySelectorAll("viewpager-item")).toHaveLength(3);
    expect(pager).toHaveTextContent("Disabled content");
    expect(pager).toHaveAttribute("initial-select-index", "2");
    expect(getProbeState(container, "context")).toMatchObject({
      pagerValues: ["one", "disabled", "two"],
    });
    fireViewPagerEvent(pager, "change", { index: 1, isDragged: true });
    expect(getTrigger(container, "disabled")).toHaveAttribute("accessibility-value", "selected");
  });

  it("exposes tab semantics through Lynx accessibility attributes", () => {
    const { container } = render(<BasicTabs defaultValue="one" />);
    const first = getTrigger(container, "첫 번째");

    expect(first).toHaveAttribute("accessibility-role-description", "tab");
    expect(first).toHaveAttribute("accessibility-label", "첫 번째");
    expect(first).toHaveAttribute("accessibility-traits", "selected");
  });
});
