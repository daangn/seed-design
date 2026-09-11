import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as Tabs from "./Tabs.namespace";
import * as ChipTabs from "../ChipTabs/ChipTabs.namespace";
import {
  areTabsTransitionsEnabled,
  getTabsLayoutWidth,
  getTabsOrderedItems,
  getTabsScrollOffset,
  getTabsTriggerRects,
} from "./Tabs.utils";

function fireViewPagerEvent(
  pager: Element,
  eventName: "change" | "willchange",
  detail: { index: number; isDragged: boolean },
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
  const trigger = Array.from(container.querySelectorAll<HTMLElement>(".seed-tabs__trigger")).find(
    (element) => element.textContent === label,
  );
  if (!trigger) throw new Error(`Expected trigger for ${label} to exist.`);
  return trigger;
}

describe("Tabs", () => {
  it("renders triggers inside the list content layout container", () => {
    const { container } = render(<BasicTabs defaultValue="one" />);
    const list = container.querySelector(".seed-tabs__list");
    const listContent = list?.querySelector(":scope > .seed-tabs__listContent");

    expect(listContent).not.toBeNull();
    expect(listContent?.querySelectorAll(".seed-tabs__trigger")).toHaveLength(2);
  });

  it("disables label and indicator transitions during the initial render", () => {
    const { container } = render(<BasicTabs defaultValue="two" />);
    const labels = container.querySelectorAll<HTMLElement>(".seed-tabs__triggerLabel");
    const indicator = container.querySelector<HTMLElement>(".seed-tabs__indicator");

    expect(indicator).toHaveClass("seed-tabs__indicator--transitionEnabled_false");
    expect(indicator?.style.transitionDuration).toBe("");
    for (const label of labels) {
      expect(label).toHaveClass("seed-tabs__triggerLabel--transitionEnabled_false");
      expect(label.style.transitionDuration).toBe("");
    }
  });

  it("disables transitions when a dynamically added trigger is unmeasured", () => {
    const rects = getTabsTriggerRects(["one", "two"], { one: 80, two: 80 });

    expect(areTabsTransitionsEnabled(["one", "two"], rects)).toBe(true);
    expect(areTabsTransitionsEnabled(["one", "two", "three"], rects)).toBe(false);
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

  it("updates trigger positions when keyed triggers are reordered", () => {
    const items = [{ value: "one" }, { value: "two" }, { value: "three" }];
    const reordered = getTabsOrderedItems(items, ["three", "two", "one"]);
    const rects = getTabsTriggerRects(
      reordered.map((item) => item.value),
      { one: 80, two: 80, three: 80 },
    );

    expect(reordered.map((item) => item.value)).toEqual(["three", "two", "one"]);
    expect(rects["three"]?.left).toBe(0);
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

  it("updates large ChipTabs selection and content without activating disabled triggers", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <ChipTabs.Root size="large" defaultValue="one" onValueChange={onValueChange}>
        <ChipTabs.List>
          <ChipTabs.Trigger value="one" notification={<text>새 알림</text>}>
            첫 번째
          </ChipTabs.Trigger>
          <ChipTabs.Trigger value="two">두 번째</ChipTabs.Trigger>
          <ChipTabs.Trigger value="three" disabled>
            세 번째
          </ChipTabs.Trigger>
        </ChipTabs.List>
        <ChipTabs.Content value="one">첫 번째 콘텐츠</ChipTabs.Content>
        <ChipTabs.Content value="two">두 번째 콘텐츠</ChipTabs.Content>
        <ChipTabs.Content value="three">세 번째 콘텐츠</ChipTabs.Content>
      </ChipTabs.Root>,
    );
    const triggers = container.querySelectorAll<HTMLElement>(
      '[accessibility-role-description="tab"]',
    );
    const contents = container.querySelectorAll<HTMLElement>(
      '[accessibility-role-description="tabpanel"]',
    );

    expect(triggers[0]).toHaveAttribute("accessibility-value", "selected");
    expect(contents[0]).toHaveAttribute("accessibility-elements-hidden", "false");
    expect(contents[0]).toHaveTextContent("첫 번째 콘텐츠");
    expect(container).toHaveTextContent("새 알림");

    fireEvent.tap(triggers[1]);

    expect(onValueChange).toHaveBeenCalledWith("two");
    expect(triggers[1]).toHaveAttribute("accessibility-value", "selected");
    expect(contents[1]).toHaveAttribute("accessibility-elements-hidden", "false");
    expect(contents[1]).toHaveTextContent("두 번째 콘텐츠");

    fireEvent.tap(triggers[2]);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(triggers[1]).toHaveAttribute("accessibility-value", "selected");
    expect(contents[1]).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("does not select a disabled trigger", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <Tabs.Root defaultValue="one" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="two" disabled>
            두 번째
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>,
    );

    const disabled = getTrigger(container, "두 번째");
    fireEvent.tap(disabled);

    expect(onValueChange).not.toHaveBeenCalled();
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
    expect(container.querySelector(".seed-tabs__content")).not.toBeNull();
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

  it("renders carousel camera contents as native viewpager items", () => {
    const { container } = render(
      <Tabs.Root defaultValue="one">
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel swipeable>
          <Tabs.CarouselCamera>
            <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
            <Tabs.Content value="two">두 번째 콘텐츠</Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
      </Tabs.Root>,
    );

    const pager = container.querySelector("viewpager");
    expect(pager).not.toBeNull();
    expect(pager?.querySelectorAll("viewpager-item")).toHaveLength(2);
    expect(pager).toHaveAttribute("enable-scroll");
    expect(pager).toHaveAttribute("ios-gesture-offset", "32");
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

  it("maps pager indexes from content order when a disabled trigger has no content", () => {
    const { container } = render(
      <Tabs.Root defaultValue="two">
        <Tabs.List>
          <Tabs.Trigger value="one">첫 번째</Tabs.Trigger>
          <Tabs.Trigger value="disabled" disabled>
            비활성
          </Tabs.Trigger>
          <Tabs.Trigger value="two">두 번째</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Carousel swipeable>
          <Tabs.CarouselCamera>
            <Tabs.Content value="one">첫 번째 콘텐츠</Tabs.Content>
            <Tabs.Content value="two">두 번째 콘텐츠</Tabs.Content>
          </Tabs.CarouselCamera>
        </Tabs.Carousel>
      </Tabs.Root>,
    );

    const pager = container.querySelector("viewpager");
    expect(pager).toHaveAttribute("initial-select-index", "1");
    expect(getTrigger(container, "두 번째")).toHaveAttribute("accessibility-value", "selected");
  });

  it("exposes tab semantics through Lynx accessibility attributes", () => {
    const { container } = render(<BasicTabs defaultValue="one" />);
    const first = getTrigger(container, "첫 번째");

    expect(first).toHaveAttribute("accessibility-role-description", "tab");
    expect(first).toHaveAttribute("accessibility-label", "첫 번째");
    expect(first).toHaveAttribute("accessibility-traits", "selected");
  });
});
