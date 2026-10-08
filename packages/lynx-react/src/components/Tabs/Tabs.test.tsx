import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { act, createEvent, fireEvent, render } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { uiMethodOptions } from "@lynx-js/types";

import * as Tabs from "./Tabs.namespace";
import * as ChipTabs from "../ChipTabs/ChipTabs.namespace";
import type * as ScaleFeedback from "../../hooks/useScaleFeedback";

const measurement = vi.hoisted(() => ({ enabled: false }));
vi.mock("@lynx-js/react", async (importOriginal) => {
  const actual = await importOriginal<typeof React>();
  return {
    ...actual,
    runOnMainThread: (...args: Parameters<typeof actual.runOnMainThread>) =>
      measurement.enabled ? async () => ({ start: 0, end: 0 }) : actual.runOnMainThread(...args),
  };
});

// 테스트 런타임은 같은 layoutchange의 MT 핸들러로 BG 핸들러를 덮어쓴다.
// Recipe 검증에서는 MT 측정만 빼고, headless geometry 검증은 실제 BG 이벤트를 쓴다.
vi.mock("../../hooks/useScaleFeedback", async (importOriginal) => {
  const actual = await importOriginal<typeof ScaleFeedback>();
  return {
    ...actual,
    useScaleFeedback: (options: Parameters<typeof actual.useScaleFeedback>[0]) => {
      const api = actual.useScaleFeedback(options);
      const { "main-thread:bindlayoutchange": _layoutChange, ...targetProps } =
        api.scaleFeedbackTargetProps;
      return { ...api, scaleFeedbackTargetProps: targetProps };
    },
  };
});

afterEach(() => {
  measurement.enabled = false;
  vi.restoreAllMocks();
});

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

function fireNativeEvent(
  element: Element,
  eventName: "layoutchange" | "scroll",
  detail: Record<string, number>,
) {
  const init = { eventType: "bindEvent", eventName, detail };
  const event = createEvent(`bindEvent:${eventName}`, element, init);
  Object.assign(event, init);
  lynxTestingEnv.switchToBackgroundThread();
  act(() => {
    element.dispatchEvent(event);
  });
}

describe("Tabs", () => {
  it("renders triggers inside the list content layout container", () => {
    const { container } = render(<BasicTabs defaultValue="one" />);
    const list = container.querySelector(".seed-tabs__list");
    const listContent = list?.querySelector(":scope > .seed-tabs__listContent");

    expect(listContent).not.toBeNull();
    expect(listContent?.querySelectorAll(".seed-tabs__trigger")).toHaveLength(2);
  });
  it("lets user scroll props win while keeping the internal scroll state updated", async () => {
    measurement.enabled = true;
    const bindscroll = vi.fn();
    const offsets: number[] = [];
    const globals: unknown = lynxTestingEnv.backgroundThread.globalThis;
    if (!globals || typeof globals !== "object" || !("lynx" in globals)) {
      throw new Error("Expected background runtime.");
    }
    const runtime = {
      lynx: globals.lynx as {
        createSelectorQuery: () => {
          select: (selector: string) => {
            invoke: (options: uiMethodOptions) => { exec: () => void };
          };
        };
      },
    };
    const createSelectorQuery = runtime.lynx.createSelectorQuery;
    vi.spyOn(runtime.lynx, "createSelectorQuery").mockImplementation(() => {
      const query = createSelectorQuery();
      const select = query.select.bind(query);
      query.select = (selector) => {
        const node = select(selector);
        node.invoke = (options) => ({
          exec() {
            if (options.method === "scrollTo") offsets.push(Number(options.params?.["offset"]));
          },
        });
        return node;
      };
      return query;
    });
    function Subject({ value }: { value: string }) {
      return (
        <Tabs.Root value={value}>
          <Tabs.List bindscroll={bindscroll} scroll-bar-enable>
            <Tabs.Trigger value="one">one</Tabs.Trigger>
            <Tabs.Trigger value="two">two</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      );
    }
    const { container, rerender } = render(<Subject value="one" />);
    const list = container.querySelector("scroll-view")!;
    const content = list.firstElementChild!;
    expect(list).toHaveAttribute("scroll-bar-enable");
    await act(async () => {
      fireNativeEvent(list, "layoutchange", { width: 100 });
      fireNativeEvent(content, "layoutchange", { width: 200 });
      for (const trigger of container.querySelectorAll('[accessibility-role-description="tab"]')) {
        fireNativeEvent(trigger, "layoutchange", { width: 100 });
      }
      fireNativeEvent(list, "scroll", { scrollLeft: 40, scrollWidth: 200 });
      await Promise.resolve();
    });
    expect(bindscroll).toHaveBeenCalledOnce();
    await act(async () => {
      rerender(<Subject value="two" />);
      await Promise.resolve();
    });
    expect(offsets).toContain(100);
  });

  it("keeps visible ChipTabs chips still by default and forwards native scrolling options", async () => {
    measurement.enabled = true;
    const offsets: number[] = [];
    const globals: unknown = lynxTestingEnv.backgroundThread.globalThis;
    if (!globals || typeof globals !== "object" || !("lynx" in globals)) {
      throw new Error("Expected background runtime.");
    }
    const runtime = {
      lynx: globals.lynx as {
        createSelectorQuery: () => {
          select: (selector: string) => {
            invoke: (options: uiMethodOptions) => { exec: () => void };
          };
        };
      },
    };
    const createSelectorQuery = runtime.lynx.createSelectorQuery;
    vi.spyOn(runtime.lynx, "createSelectorQuery").mockImplementation(() => {
      const query = createSelectorQuery();
      const select = query.select.bind(query);
      query.select = (selector) => {
        const node = select(selector);
        node.invoke = (options) => ({
          exec() {
            if (options.method === "scrollTo") offsets.push(Number(options.params?.["offset"]));
          },
        });
        return node;
      };
      return query;
    });
    function Chips({ scrollAlign }: { scrollAlign?: "start" | "nearest" }) {
      return (
        <ChipTabs.Root defaultValue="two">
          <ChipTabs.List scrollAlign={scrollAlign} fading-edge-length="20px">
            <ChipTabs.Trigger value="one">one</ChipTabs.Trigger>
            <ChipTabs.Trigger value="two">two</ChipTabs.Trigger>
            <ChipTabs.Trigger value="three">three</ChipTabs.Trigger>
          </ChipTabs.List>
        </ChipTabs.Root>
      );
    }
    const { container, rerender } = render(<Chips />);
    const list = container.querySelector("scroll-view")!;
    const content = list.firstElementChild!;
    expect(list).toHaveAttribute("fading-edge-length", "20px");
    await act(async () => {
      fireNativeEvent(list, "layoutchange", { width: 200 });
      fireNativeEvent(content, "layoutchange", { width: 316 });
      for (const trigger of container.querySelectorAll('[accessibility-role-description="tab"]')) {
        fireNativeEvent(trigger, "layoutchange", { width: 100 });
      }
      fireNativeEvent(list, "scroll", { scrollLeft: 20, scrollWidth: 316 });
      await Promise.resolve();
    });
    expect(offsets).toEqual([]);
    await act(async () => {
      rerender(<Chips scrollAlign="start" />);
      await Promise.resolve();
    });
    expect(offsets).toEqual([108]);
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

  it.each([
    ["Tabs", Tabs, "seed-tabs"],
    ["ChipTabs", ChipTabs, "seed-chip-tabs"],
  ] as const)("renders %s notification using its recipe layout", (_name, Component, prefix) => {
    const { container } = render(
      <Component.Root defaultValue="one">
        <Component.List>
          <Component.Trigger
            value="one"
            notification={
              <view data-testid="notification">
                <text>New</text>
              </view>
            }
          >
            Label
          </Component.Trigger>
        </Component.List>
      </Component.Root>,
    );
    const trigger = container.querySelector(`.${prefix}__trigger`)!;
    expect(trigger.firstElementChild).toHaveStyle({ position: "relative" });
    expect(trigger.querySelector(`.${prefix}__triggerLabel`)).toHaveTextContent("Label");
    const notification = trigger.querySelector('[data-testid="notification"]')!;
    if (prefix === "seed-chip-tabs") {
      expect(trigger.firstElementChild).toHaveStyle({ display: "flex", flexDirection: "row" });
      expect(notification.parentElement).toHaveAttribute("accessibility-elements-hidden", "true");
      expect(notification.parentElement?.previousElementSibling).toHaveClass(
        `${prefix}__triggerLabel`,
      );
    } else {
      expect(notification.previousElementSibling).toHaveClass(`${prefix}__triggerLabel`);
    }
  });

  it.each([
    ["Tabs", Tabs, "seed-tabs"],
    ["ChipTabs", ChipTabs, "seed-chip-tabs"],
  ] as const)("maps %s selected and disabled state to recipe classes", (_name, Component, prefix) => {
    const { container } = render(
      <Component.Root defaultValue="one">
        <Component.List>
          <Component.Trigger value="one">one</Component.Trigger>
          <Component.Trigger value="two">two</Component.Trigger>
          <Component.Trigger value="three" disabled>
            three
          </Component.Trigger>
        </Component.List>
      </Component.Root>,
    );
    const triggers = container.querySelectorAll(`.${prefix}__trigger`);
    expect(triggers[0]).toHaveClass(`${prefix}__trigger--selected_true`);
    expect(triggers[2]).toHaveClass(`${prefix}__trigger--disabled_true`);
    fireEvent.tap(triggers[1]);
    expect(triggers[0]).toHaveClass(`${prefix}__trigger--selected_false`);
    expect(triggers[1]).toHaveClass(`${prefix}__trigger--selected_true`);
  });

  it("enables transition recipe classes once all trigger widths are measured", () => {
    const { container } = render(<BasicTabs defaultValue="two" />);
    const triggers = container.querySelectorAll(".seed-tabs__trigger");
    fireNativeEvent(triggers[0], "layoutchange", { width: 80 });
    expect(container.querySelector(".seed-tabs__indicator")).toHaveClass(
      "seed-tabs__indicator--transitionEnabled_false",
    );
    fireNativeEvent(triggers[1], "layoutchange", { width: 100 });
    expect(container.querySelector(".seed-tabs__indicator")).not.toHaveClass(
      "seed-tabs__indicator--transitionEnabled_false",
    );
    for (const label of container.querySelectorAll(".seed-tabs__triggerLabel")) {
      expect(label).not.toHaveClass("seed-tabs__triggerLabel--transitionEnabled_false");
    }
  });
});
