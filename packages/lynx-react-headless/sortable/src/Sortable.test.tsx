import "@testing-library/jest-dom";
import { createEvent, fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { useState } from "@lynx-js/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Sortable, type SortableItemProps } from "./index.js";

type Item = { id: string };
const ITEMS: Item[] = [{ id: "a" }, { id: "b" }, { id: "c" }];
const MOVE = { previous: "앞으로 이동", next: "뒤로 이동" };

function get(selector: string) {
  const node = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

function fireNamed(target: Element, eventName: string, init: Record<string, unknown>) {
  const payload = { eventType: "bindEvent", eventName, ...init };
  const event = createEvent(`bindEvent:${eventName}`, target, payload);
  Object.assign(event, payload);
  fireEvent(target, event);
}

function List({
  items = ITEMS,
  disabled,
  readOnly,
  onReorder = () => {},
  onDragStateChange,
  itemProps,
}: {
  items?: Item[];
  disabled?: boolean;
  readOnly?: boolean;
  onReorder?: (from: number, to: number) => void;
  onDragStateChange?: (dragging: boolean) => void;
  itemProps?: Partial<SortableItemProps>;
}) {
  return (
    <Sortable.Root
      items={items}
      getItemKey={(item) => item.id}
      id="list"
      disabled={disabled}
      readOnly={readOnly}
      scrollableBoundaryId="boundary"
      onReorder={onReorder}
      onDragStateChange={onDragStateChange}
    >
      {({ onScroll, dragging }) => (
        <scroll-view id="boundary" main-thread:bindscroll={onScroll} enable-scroll={!dragging}>
          {items.map((item, index) => (
            <Sortable.Item
              key={item.id}
              itemId={item.id}
              index={index}
              accessibility-element
              accessibility-label={item.id}
              moveActionLabels={MOVE}
              {...itemProps}
            >
              {(dragging) => <text className={`label-${item.id}`}>{`${item.id}:${dragging}`}</text>}
            </Sortable.Item>
          ))}
        </scroll-view>
      )}
    </Sortable.Root>
  );
}

function itemNode(id: string) {
  return get(`.label-${id}`).parentElement as HTMLElement;
}

function actionsOf(id: string): unknown {
  const value = itemNode(id).getAttribute("accessibility-actions");
  return value === null ? null : JSON.parse(value);
}

describe("Sortable.Item accessibility actions", () => {
  it("exposes only the moves that stay inside the list", () => {
    render(<List />);

    expect(actionsOf("a")).toEqual(["뒤로 이동"]);
    expect(actionsOf("b")).toEqual(["앞으로 이동", "뒤로 이동"]);
    expect(actionsOf("c")).toEqual(["앞으로 이동"]);
  });

  it("reorders by one step through the same onReorder contract", () => {
    const onReorder = vi.fn();
    render(<List onReorder={onReorder} />);

    fireNamed(itemNode("b"), "accessibilityaction", { detail: { name: "앞으로 이동" } });
    fireNamed(itemNode("b"), "accessibilityaction", { detail: { name: "뒤로 이동" } });

    expect(onReorder.mock.calls).toEqual([
      [1, 0],
      [1, 2],
    ]);
  });

  it("moves the item the caller reordered on the next action", () => {
    function Controlled() {
      const [items, setItems] = useState(ITEMS);
      return (
        <List
          items={items}
          onReorder={(from, to) => {
            const next = [...items];
            next.splice(to, 0, ...next.splice(from, 1));
            setItems(next);
          }}
        />
      );
    }
    render(<Controlled />);

    fireNamed(itemNode("a"), "accessibilityaction", { detail: { name: "뒤로 이동" } });
    expect(actionsOf("a")).toEqual(["앞으로 이동", "뒤로 이동"]);
    fireNamed(itemNode("a"), "accessibilityaction", { detail: { name: "뒤로 이동" } });
    expect(actionsOf("a")).toEqual(["앞으로 이동"]);
  });

  it.each([
    { disabled: true },
    { readOnly: true },
  ])("hides move actions and ignores stale ones when %o", (state) => {
    const onReorder = vi.fn();
    render(<List {...state} onReorder={onReorder} />);

    expect(actionsOf("b")).toBeNull();
    fireNamed(itemNode("b"), "accessibilityaction", { detail: { name: "앞으로 이동" } });
    expect(onReorder).not.toHaveBeenCalled();
  });

  it("uses caller actions while composing the caller and move handlers", () => {
    const onReorder = vi.fn();
    const onAction = vi.fn();
    render(
      <List
        onReorder={onReorder}
        itemProps={{ "accessibility-actions": ["파일 제거"], bindaccessibilityaction: onAction }}
      />,
    );

    expect(actionsOf("b")).toEqual(["파일 제거"]);
    fireNamed(itemNode("b"), "accessibilityaction", { detail: { name: "파일 제거" } });
    fireNamed(itemNode("b"), "accessibilityaction", { detail: { name: "앞으로 이동" } });

    expect(onAction.mock.calls.map(([event]) => event.detail.name)).toEqual([
      "파일 제거",
      "앞으로 이동",
    ]);
    expect(onReorder.mock.calls).toEqual([[1, 0]]);
  });
});

// Items are 80px wide with an 8px gap, so their centers sit at 40, 128 and 216.
// A drag that starts at pageX 40 passes b's center after 128 and c's center after 216.
const PAST_B = 140;
const PAST_C = 240;
const ITEM_IDS: Record<string, number> = { "0061": 0, "0062": 1, "0063": 2 };

function rectFor(selector: string) {
  if (selector === "#boundary") return { left: 0, top: 0, width: 400, height: 80 };
  const index = ITEM_IDS[selector.slice(-4)];
  if (index === undefined) return null;
  return { left: index * 88, top: 0, width: 80, height: 80 };
}

function installNativeStubs() {
  const createSelectorQuery = () => ({
    select: (selector: string) => ({
      invoke: ({ success }: { success: (result: unknown) => void }) => ({
        exec: () => success(rectFor(selector)),
      }),
    }),
  });
  const element = {
    setStyleProperty: () => {},
    setStyleProperties: () => {},
    setAttribute: () => {},
    invoke: () => Promise.resolve({ consumedX: 0 }),
  };
  const background = lynxTestingEnv.backgroundThread.globalThis as { lynx: object };
  background.lynx = { ...background.lynx, createSelectorQuery };
  const main = lynxTestingEnv.mainThread.globalThis as { lynx: object };
  main.lynx = { ...main.lynx, querySelector: () => element };
}

function point(pageX: number, timestamp: number) {
  return { touches: [{ pageX }], detail: { x: pageX }, timestamp };
}

async function startDrag(id: string, pageX: number) {
  fireNamed(itemNode(id), "longpress", point(pageX, 0));
  await waitSchedule();
  await waitSchedule();
}

async function moveTo(id: string, pageX: number, timestamp: number) {
  fireNamed(itemNode(id), "touchmove", point(pageX, timestamp));
  await waitSchedule();
}

async function endDrag(id: string, eventName: "touchend" | "touchcancel") {
  fireNamed(itemNode(id), eventName, {});
  await waitSchedule();
}

describe("Sortable drag lifecycle", () => {
  beforeEach(installNativeStubs);

  function renderList(props: Parameters<typeof List>[0] = {}) {
    return render(<List {...props} />, { enableMainThread: true, enableBackgroundThread: true });
  }

  it("reports a drop at a different index once and ends dragging", async () => {
    const onReorder = vi.fn();
    const onDragStateChange = vi.fn();
    renderList({ onReorder, onDragStateChange });

    await startDrag("a", 40);
    expect(get(".label-a")).toHaveTextContent("a:true");
    await moveTo("a", PAST_C, 1);
    await endDrag("a", "touchend");

    expect(onReorder.mock.calls).toEqual([[0, 2]]);
    expect(onDragStateChange.mock.calls).toEqual([[true], [false]]);
    expect(get(".label-a")).toHaveTextContent("a:false");
  });

  it("ignores a move event repeating the previous timestamp", async () => {
    const onReorder = vi.fn();
    renderList({ onReorder });

    await startDrag("a", 40);
    await moveTo("a", PAST_B, 1);
    await moveTo("a", PAST_C, 1);
    await endDrag("a", "touchend");

    expect(onReorder.mock.calls).toEqual([[0, 1]]);
  });

  it("does not reorder on cancel or on a drop at the start index", async () => {
    const onReorder = vi.fn();
    const onDragStateChange = vi.fn();
    renderList({ onReorder, onDragStateChange });

    await startDrag("a", 40);
    await moveTo("a", PAST_C, 1);
    await endDrag("a", "touchcancel");

    await startDrag("b", 128);
    await moveTo("b", 140, 2);
    await endDrag("b", "touchend");

    expect(onReorder).not.toHaveBeenCalled();
    expect(onDragStateChange.mock.calls).toEqual([[true], [false], [true], [false]]);
  });

  it("does not reorder when items change during the drag", async () => {
    const onReorder = vi.fn();
    const { rerender } = renderList({ onReorder });

    await startDrag("a", 40);
    await moveTo("a", PAST_C, 1);
    rerender(<List items={[...ITEMS, { id: "d" }]} onReorder={onReorder} />);
    await waitSchedule();
    await endDrag("a", "touchend");

    expect(onReorder).not.toHaveBeenCalled();
  });

  it("ends an active drag without reordering when sorting becomes disabled", async () => {
    const onReorder = vi.fn();
    const onDragStateChange = vi.fn();
    const { rerender } = renderList({ onReorder, onDragStateChange });

    await startDrag("a", 40);
    await moveTo("a", PAST_C, 1);
    rerender(<List readOnly onReorder={onReorder} onDragStateChange={onDragStateChange} />);
    await waitSchedule();
    await waitSchedule();

    expect(onReorder).not.toHaveBeenCalled();
    expect(onDragStateChange.mock.calls).toEqual([[true], [false]]);
    expect(get(".label-a")).toHaveTextContent("a:false");
  });
});
