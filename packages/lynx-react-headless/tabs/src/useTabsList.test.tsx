import * as React from "@lynx-js/react";
import { act, createEvent, render } from "@lynx-js/react/testing-library";
import type { NodesRef, uiMethodOptions } from "@lynx-js/types";
import { expect, it, vi } from "vitest";
import * as Tabs from "./Tabs.namespace.js";
import { useTabsList } from "./useTabsList.js";

const measure = vi.hoisted(() =>
  vi.fn(async () => ({
    start: 16,
    end: 16,
    viewportStart: 84,
    viewportEnd: 0,
  })),
);

vi.mock("@lynx-js/react", async (importOriginal) => ({
  ...(await importOriginal<typeof React>()),
  runOnMainThread: () => measure,
}));

it("remeasures changed inset expressions without looping on inline hook options", async () => {
  function List({ start, end }: { start: string; end: string }) {
    // Direct hook consumers commonly create options during each render.
    const api = useTabsList({ viewportInsets: { start, end } });
    return <scroll-view {...api.listProps} />;
  }
  function Subject({ reversed = false }: { reversed?: boolean }) {
    return (
      <Tabs.Root>
        <List start={reversed ? "0px" : "84px"} end={reversed ? "84px" : "0px"} />
      </Tabs.Root>
    );
  }
  const { rerender } = render(<Subject />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(measure).toHaveBeenCalledTimes(1);

  await act(async () => {
    rerender(<Subject reversed />);
    await Promise.resolve();
  });
  expect(measure).toHaveBeenCalledTimes(2);

  await act(async () => {
    rerender(<Subject reversed />);
    await Promise.resolve();
  });
  expect(measure).toHaveBeenCalledTimes(2);
});

function fireBindEvent(element: Element, eventName: string, detail: Record<string, number>) {
  const init = { eventType: "bindEvent", eventName, detail };
  const event = createEvent(`bindEvent:${eventName}`, element, init);
  Object.assign(event, init);
  lynxTestingEnv.switchToBackgroundThread();
  act(() => {
    element.dispatchEvent(event);
  });
}

it("aligns without animation once every trigger before the selected one is measured again", async () => {
  const listRef = React.createRef<NodesRef>();
  function Subject({ value }: { value: string }) {
    return (
      <Tabs.Root value={value}>
        <Tabs.List ref={listRef}>
          <Tabs.Trigger value="one" data-testid="one">
            one
          </Tabs.Trigger>
          <Tabs.Trigger value="two" data-testid="two">
            two
          </Tabs.Trigger>
          <Tabs.Trigger value="three" data-testid="three">
            three
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    );
  }
  const { container, rerender } = render(<Subject value="three" />);
  const list = container.querySelector("scroll-view");
  const content = list?.firstElementChild;
  if (!list || !content || !listRef.current) throw new Error("Expected the tabs list.");

  // The testing NodesRef throws from `invoke`, so record the UI method calls on this instance instead.
  const invoke = vi.fn((_options: uiMethodOptions) => ({ exec: () => {} }));
  Reflect.set(listRef.current, "invoke", invoke);
  const scrollCalls = () => invoke.mock.calls.map(([options]) => options.params);
  function setTriggerWidth(value: string, width: number) {
    const trigger = container.querySelector(`[data-testid="${value}"]`);
    if (!trigger) throw new Error(`Expected trigger ${value}.`);

    fireBindEvent(trigger, "layoutchange", { width });
  }

  await act(async () => {
    fireBindEvent(list, "layoutchange", { width: 150 });
    fireBindEvent(content, "layoutchange", { width: 332 });
    await Promise.resolve();
  });
  for (const value of ["one", "two", "three"]) setTriggerWidth(value, 100);
  expect(scrollCalls()).toEqual([{ offset: 132, smooth: false }]);

  fireBindEvent(list, "scroll", { scrollLeft: 132, scrollWidth: 332 });
  invoke.mockClear();

  // 조상이 `display: none`이 되면 trigger 폭이 하나씩 0으로 보고된다.
  setTriggerWidth("one", 0);
  expect(scrollCalls()).toEqual([]);

  setTriggerWidth("two", 0);
  setTriggerWidth("three", 0);
  fireBindEvent(list, "scroll", { scrollLeft: 0, scrollWidth: 332 });
  for (const value of ["one", "two", "three"]) setTriggerWidth(value, 100);
  expect(scrollCalls()).toEqual([{ offset: 132, smooth: false }]);

  fireBindEvent(list, "scroll", { scrollLeft: 132, scrollWidth: 332 });
  invoke.mockClear();

  rerender(<Subject value="two" />);
  expect(scrollCalls()).toEqual([{ offset: 32, smooth: true }]);
});
