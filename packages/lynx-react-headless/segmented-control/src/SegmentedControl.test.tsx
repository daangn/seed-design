import "@testing-library/jest-dom";
import { useEffect, useState } from "@lynx-js/react";
import { act, fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  SegmentedControl,
  SegmentedControlProvider,
  useSegmentedControl,
  useSegmentedControlContext,
  useSegmentedControlItem,
} from "./index.js";

function item(value: string) {
  const node = elementTree.root?.querySelector<HTMLElement>(`.item-${value}`);
  if (!node) throw new Error(`Missing item ${value}`);
  return node;
}

function tap(value: string) {
  fireEvent(item(value), new Event("bindEvent:tap"));
}

function Geometry() {
  const { value, items, segmentCount, segmentIndex } = useSegmentedControlContext();
  return (
    <text className="geometry">{`value=${value} items=${items.join(",")} count=${segmentCount} index=${segmentIndex}`}</text>
  );
}

function styleVariable(element: HTMLElement, name: `--${string}`) {
  // Lynx 테스트 환경은 CSS 변수를 style[key]에 넣는다.
  return (element.style as unknown as Record<string, string>)[name];
}

function geometry() {
  return elementTree.root?.querySelector(".geometry")?.textContent;
}

describe("SegmentedControl", () => {
  it("selects an uncontrolled item before the consumer tap handler", () => {
    const calls: string[] = [];
    render(
      <SegmentedControl.Root
        defaultValue="hot"
        onValueChange={(value) => calls.push(`change:${value}`)}
      >
        <SegmentedControl.Item className="item-hot" value="hot" />
        <SegmentedControl.Item className="item-new" value="new" bindtap={() => calls.push("tap")} />
        <Geometry />
      </SegmentedControl.Root>,
    );

    expect(geometry()).toBe("value=hot items=hot,new count=2 index=0");
    expect(item("hot")).toHaveAttribute("accessibility-traits", "selected");
    expect(item("new")).toHaveAttribute("accessibility-value", "not selected");

    tap("new");

    expect(calls).toEqual(["change:new", "tap"]);
    expect(geometry()).toBe("value=new items=hot,new count=2 index=1");
    expect(item("new")).toHaveAttribute("accessibility-value", "selected");

    tap("new");
    expect(calls).toEqual(["change:new", "tap", "tap"]);
  });

  it("keeps the controlled value until the parent updates it", () => {
    const onValueChange = vi.fn();
    function Parent() {
      const [value, setValue] = useState("hot");
      return (
        <SegmentedControl.Root
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            if (next !== "old") setValue(next);
          }}
        >
          <SegmentedControl.Item className="item-hot" value="hot" />
          <SegmentedControl.Item className="item-new" value="new" />
          <SegmentedControl.Item className="item-old" value="old" />
          <Geometry />
        </SegmentedControl.Root>
      );
    }
    render(<Parent />);

    tap("old");
    expect(onValueChange).toHaveBeenLastCalledWith("old");
    expect(geometry()).toBe("value=hot items=hot,new,old count=3 index=0");

    tap("new");
    expect(onValueChange).toHaveBeenLastCalledWith("new");
    expect(geometry()).toBe("value=new items=hot,new,old count=3 index=1");
  });

  it("blocks selection and tap handlers for disabled items and roots", () => {
    const onValueChange = vi.fn();
    const bindtap = vi.fn();
    const { rerender } = render(
      <SegmentedControl.Root defaultValue="hot" onValueChange={onValueChange}>
        <SegmentedControl.Item className="item-hot" value="hot" />
        <SegmentedControl.Item className="item-new" value="new" disabled bindtap={bindtap} />
      </SegmentedControl.Root>,
    );

    tap("new");
    expect(item("new")).toHaveAttribute("accessibility-traits", "disabled");

    rerender(
      <SegmentedControl.Root defaultValue="hot" onValueChange={onValueChange} disabled>
        <SegmentedControl.Item className="item-hot" value="hot" />
        <SegmentedControl.Item className="item-new" value="new" bindtap={bindtap} />
      </SegmentedControl.Root>,
    );

    tap("new");
    expect(item("hot")).toHaveAttribute("accessibility-traits", "disabled");
    expect(item("new")).toHaveAttribute("accessibility-traits", "disabled");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(bindtap).not.toHaveBeenCalled();
  });

  it("updates count and index as items mount and unmount", () => {
    function Parent({ values, value }: { values: string[]; value?: string }) {
      return (
        <SegmentedControl.Root value={value}>
          {values.map((itemValue) => (
            <SegmentedControl.Item
              key={itemValue}
              className={`item-${itemValue}`}
              value={itemValue}
            />
          ))}
          <Geometry />
        </SegmentedControl.Root>
      );
    }
    const { rerender } = render(<Parent values={["hot", "new"]} />);
    expect(geometry()).toBe("value=undefined items=hot,new count=2 index=-1");

    rerender(<Parent values={["hot", "new", "old"]} value="old" />);
    expect(geometry()).toBe("value=old items=hot,new,old count=3 index=2");

    rerender(<Parent values={["new", "old"]} value="old" />);
    expect(geometry()).toBe("value=old items=new,old count=2 index=1");

    rerender(<Parent values={["new"]} value="old" />);
    expect(geometry()).toBe("value=old items=new count=1 index=-1");
  });

  it("exposes the segment count and selected index as Root style variables", () => {
    render(
      <SegmentedControl.Root className="root" defaultValue="b">
        <SegmentedControl.Item className="item-a" value="a" />
        <SegmentedControl.Item className="item-b" value="b" />
        <SegmentedControl.Item className="item-c" value="c" />
      </SegmentedControl.Root>,
    );
    const root = elementTree.root?.querySelector<HTMLElement>(".root");
    if (!root) throw new Error("Missing root");

    expect(styleVariable(root, "--segment-count")).toBe("3");
    expect(styleVariable(root, "--segment-index")).toBe("1");

    tap("c");
    expect(styleVariable(root, "--segment-index")).toBe("2");
  });

  it("falls back to the first segment without a selection and keeps the user style", () => {
    render(
      <SegmentedControl.Root className="root" style={{ opacity: 0.5 }}>
        <SegmentedControl.Item className="item-a" value="a" />
        <SegmentedControl.Item className="item-b" value="b" />
      </SegmentedControl.Root>,
    );
    const root = elementTree.root?.querySelector<HTMLElement>(".root");
    if (!root) throw new Error("Missing root");

    expect(styleVariable(root, "--segment-count")).toBe("2");
    expect(styleVariable(root, "--segment-index")).toBe("0");
    expect(root).toHaveStyle({ opacity: "0.5" });
  });
});
it("does not rerender existing items for registry-only changes", () => {
  const rendered = vi.fn();
  let registerItem: ReturnType<typeof useSegmentedControlContext>["registerItem"] | undefined;
  function Registry() {
    registerItem = useSegmentedControlContext().registerItem;
    return null;
  }
  function Item() {
    const { itemProps } = useSegmentedControlItem({ value: "first" });
    rendered();
    return <view {...itemProps} />;
  }
  render(
    <SegmentedControl.Root defaultValue="first">
      <Registry />
      <Item />
    </SegmentedControl.Root>,
  );
  if (!registerItem) throw new Error("Expected registry consumer");
  const register = registerItem;
  rendered.mockClear();

  act(() => {
    register("second");
  });
  expect(rendered).not.toHaveBeenCalled();
});

it("keeps children mounted when the public SegmentedControlProvider receives a value", () => {
  const mount = vi.fn();
  function Child() {
    useEffect(() => {
      mount();
    }, []);
    return null;
  }

  function Example({ enabled }: { enabled: boolean }) {
    const api = useSegmentedControl({ defaultValue: "first" });
    return (
      <SegmentedControlProvider value={enabled ? api : null}>
        <Child />
      </SegmentedControlProvider>
    );
  }

  const { rerender } = render(<Example enabled={false} />);
  rerender(<Example enabled />);
  expect(mount).toHaveBeenCalledTimes(1);
});
