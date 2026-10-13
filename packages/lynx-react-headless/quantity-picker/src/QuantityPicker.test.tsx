import "@testing-library/jest-dom";
import { runOnBackground, useState } from "@lynx-js/react";
import { fireEvent, render, waitSchedule } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import {
  QuantityPicker,
  useQuantityPickerContext,
  useQuantityPickerIncrementButton,
  type UseQuantityPickerProps,
} from "./index.js";

function element(selector: string) {
  const node = elementTree.root?.querySelector<HTMLElement>(selector);
  if (!node) throw new Error(`Missing ${selector}`);
  return node;
}

const root = () => element(".root");
const decrement = () => element(".decrement");
const increment = () => element(".increment");
const valueDisplay = () => element(".value");

function Picker(props: UseQuantityPickerProps & { calls?: string[] }) {
  const { calls, ...rootProps } = props;
  return (
    <QuantityPicker.Root className="root" accessibility-label="수량" {...rootProps}>
      <QuantityPicker.DecrementButton
        className="decrement"
        accessibility-label="줄이기"
        bindtap={() => calls?.push("decrement-tap")}
      />
      <QuantityPicker.ValueDisplay className="value" />
      <QuantityPicker.IncrementButton
        className="increment"
        accessibility-label="늘리기"
        bindtap={() => calls?.push("increment-tap")}
      />
    </QuantityPicker.Root>
  );
}

describe("QuantityPicker", () => {
  it("exposes independent buttons and a named current value instead of the root", () => {
    render(<Picker min={0} max={5} defaultValue={2} />);

    expect(root()).toHaveAttribute("accessibility-element", "false");
    expect(root()).not.toHaveAttribute("accessibility-label");
    expect(root()).not.toHaveAttribute("accessibility-value");
    expect(decrement()).toHaveAttribute("accessibility-label", "줄이기");
    expect(increment()).toHaveAttribute("accessibility-label", "늘리기");
    for (const button of [decrement(), increment()]) {
      expect(button).toHaveAttribute("accessibility-element", "true");
      expect(button).toHaveAttribute("accessibility-role-description", "button");
      expect(button).toHaveAttribute("accessibility-traits", "button");
      expect(button).toHaveAttribute("flatten", "false");
    }
    expect(valueDisplay()).toHaveAttribute("accessibility-element", "true");
    expect(valueDisplay()).toHaveAttribute("accessibility-label", "수량");
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "2");
    expect(valueDisplay()).toHaveAttribute("flatten", "false");
    expect(valueDisplay()).not.toHaveAttribute("accessibility-elements-hidden");
    expect(element(".value text")).toHaveAttribute("accessibility-element", "false");
    expect(element(".value text")).toHaveAttribute("accessibility-elements-hidden", "true");

    fireEvent.tap(increment());
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "3");
    fireEvent.tap(decrement());
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "2");
  });

  it("starts from min, moves by step and stops at the bounds", () => {
    const calls: string[] = [];
    render(
      <Picker min={1} max={4} step={2} calls={calls} onValueChange={(v) => calls.push(`${v}`)} />,
    );

    expect(valueDisplay()).toHaveAttribute("accessibility-value", "1");
    expect(decrement()).toHaveAttribute("accessibility-traits", "disabled");

    fireEvent.tap(increment());
    fireEvent.tap(increment());
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "4");
    expect(increment()).toHaveAttribute("accessibility-traits", "disabled");

    fireEvent.tap(increment());
    fireEvent.tap(decrement());
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "2");
    expect(calls).toEqual(["3", "increment-tap", "4", "increment-tap", "2", "decrement-tap"]);
  });

  it("shows only the value the controlled parent passes back", () => {
    const onValueChange = vi.fn();
    function Parent() {
      const [value, setValue] = useState(1);
      return (
        <Picker
          min={0}
          max={9}
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            // The parent rounds every request up to an even quantity.
            setValue(next + (next % 2));
          }}
        />
      );
    }
    render(<Parent />);

    fireEvent.tap(increment());
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "2");
    fireEvent.tap(increment());
    expect(onValueChange).toHaveBeenLastCalledWith(3);
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "4");
  });

  it("turns decrement into remove at min only when removable", () => {
    const onRemove = vi.fn();
    const onValueChange = vi.fn();
    const view = render(
      <Picker
        min={1}
        max={5}
        removable
        removeAccessibilityLabel="상품 삭제"
        onRemove={onRemove}
        onValueChange={onValueChange}
      />,
    );

    expect(decrement()).toHaveAttribute("accessibility-label", "상품 삭제");
    expect(decrement()).toHaveAttribute("accessibility-traits", "button");
    fireEvent.tap(decrement());
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "1");

    view.rerender(<Picker min={1} max={5} onRemove={onRemove} onValueChange={onValueChange} />);
    expect(decrement()).toHaveAttribute("accessibility-label", "줄이기");
    expect(decrement()).toHaveAttribute("accessibility-traits", "disabled");
    fireEvent.tap(decrement());
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([
    ["disabled", { disabled: true }],
    ["readOnly", { readOnly: true }],
    ["decrement loading", { loading: { decrement: true } }],
  ] as const)("blocks remove while %s", (_, blocking) => {
    const onRemove = vi.fn();
    const calls: string[] = [];
    render(
      <Picker
        min={1}
        max={5}
        removable
        removeAccessibilityLabel="상품 삭제"
        onRemove={onRemove}
        calls={calls}
        {...blocking}
      />,
    );

    fireEvent.tap(decrement());
    expect(onRemove).not.toHaveBeenCalled();
    expect(calls).toEqual([]);
    expect(decrement()).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("blocks both actions for disabled and readOnly, and only the loading action otherwise", () => {
    const onValueChange = vi.fn();
    const view = render(
      <Picker min={0} max={5} defaultValue={2} disabled onValueChange={onValueChange} />,
    );
    for (const button of [decrement(), increment()]) {
      expect(button).toHaveAttribute("accessibility-traits", "disabled");
    }
    fireEvent.tap(decrement());
    fireEvent.tap(increment());

    view.rerender(
      <Picker min={0} max={5} defaultValue={2} readOnly onValueChange={onValueChange} />,
    );
    expect(root()).not.toHaveAttribute("accessibility-traits");
    fireEvent.tap(decrement());
    fireEvent.tap(increment());
    expect(onValueChange).not.toHaveBeenCalled();

    view.rerender(
      <Picker
        min={0}
        max={5}
        defaultValue={2}
        loading={{ increment: true }}
        onValueChange={onValueChange}
      />,
    );
    expect(increment()).toHaveAttribute("accessibility-traits", "disabled");
    expect(decrement()).toHaveAttribute("accessibility-traits", "button");
    fireEvent.tap(increment());
    fireEvent.tap(decrement());
    expect(onValueChange.mock.calls).toEqual([[1]]);
  });

  it("reverses flattened children for rtl", () => {
    render(
      <QuantityPicker.Root className="root" min={0} max={5} dir="rtl">
        {/* biome-ignore lint/complexity/noUselessFragments: Root must flatten Fragment children */}
        <>
          <QuantityPicker.DecrementButton className="decrement" />
          <QuantityPicker.ValueDisplay className="value" />
        </>
        {null}
        <QuantityPicker.IncrementButton className="increment" />
      </QuantityPicker.Root>,
    );

    expect(Array.from(root().children).map((child) => child.className)).toEqual([
      "increment",
      "value",
      "decrement",
    ]);
  });

  it("uses formatted value text for display and accessibility", () => {
    const view = render(
      <Picker min={0} max={5} defaultValue={2} getValueText={(text) => `${text}개`} />,
    );
    expect(valueDisplay()).toHaveTextContent("2개");
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "2개");

    fireEvent.tap(increment());
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "3개");
    view.rerender(<Picker min={0} max={5} defaultValue={2} getValueText={() => <text>3</text>} />);
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "3");
  });

  it("lets consumer accessibility props override the defaults", () => {
    render(
      <QuantityPicker.Root
        className="root"
        min={0}
        max={5}
        disabled
        accessibility-element={true}
        accessibility-label="수량"
        accessibility-role-description="custom picker"
        flatten={true}
        accessibility-value="두 개"
        accessibility-traits="none"
      >
        <QuantityPicker.DecrementButton
          className="decrement"
          accessibility-element={false}
          accessibility-label="custom decrease"
          accessibility-role-description="custom action"
          accessibility-traits="header"
          flatten={true}
        />
        <QuantityPicker.IncrementButton
          className="increment"
          accessibility-element={false}
          accessibility-label="custom increase"
          accessibility-role-description="custom action"
          accessibility-traits="header"
          flatten={true}
        />
        <QuantityPicker.ValueDisplay
          className="value"
          accessibility-element={false}
          accessibility-label="custom value"
          accessibility-value="세 개"
          accessibility-elements-hidden={true}
          flatten={true}
        >
          <text>custom</text>
        </QuantityPicker.ValueDisplay>
      </QuantityPicker.Root>,
    );

    expect(root()).toHaveAttribute("accessibility-element", "true");
    expect(root()).toHaveAttribute("accessibility-role-description", "custom picker");
    expect(root()).toHaveAttribute("flatten", "true");
    expect(root()).toHaveAttribute("accessibility-value", "두 개");
    expect(root()).toHaveAttribute("accessibility-traits", "none");
    expect(decrement()).toHaveAttribute("accessibility-label", "custom decrease");
    expect(increment()).toHaveAttribute("accessibility-label", "custom increase");
    for (const button of [decrement(), increment()]) {
      expect(button).toHaveAttribute("accessibility-element", "false");
      expect(button).toHaveAttribute("accessibility-role-description", "custom action");
      expect(button).toHaveAttribute("accessibility-traits", "header");
      expect(button).toHaveAttribute("flatten", "true");
    }
    expect(valueDisplay()).toHaveAttribute("accessibility-element", "false");
    expect(valueDisplay()).toHaveAttribute("accessibility-label", "custom value");
    expect(valueDisplay()).toHaveAttribute("accessibility-value", "세 개");
    expect(valueDisplay()).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(valueDisplay()).toHaveAttribute("flatten", "true");
    expect(valueDisplay()).toHaveTextContent("custom");
  });

  it("gates Main Thread taps by the action state", async () => {
    const mainThreadTap = vi.fn();
    function Example(props: { loading?: boolean }) {
      function handleMainThreadTap() {
        "main thread";
        runOnBackground(mainThreadTap)();
      }
      return (
        <QuantityPicker.Root className="root" min={0} max={5} loading={props.loading}>
          <QuantityPicker.IncrementButton
            className="increment"
            main-thread:bindtap={handleMainThreadTap}
          />
        </QuantityPicker.Root>
      );
    }
    const view = render(<Example loading />, {
      enableMainThread: true,
      enableBackgroundThread: true,
    });
    await waitSchedule();
    fireEvent.tap(increment(), {});
    await waitSchedule();
    expect(mainThreadTap).not.toHaveBeenCalled();

    view.rerender(<Example />);
    await waitSchedule();
    fireEvent.tap(increment(), {});
    await waitSchedule();
    expect(mainThreadTap).toHaveBeenCalledTimes(1);
  });

  it("lets a hook-only button keep pressed state with consumer Main Thread touch handlers", async () => {
    const reports = { start: vi.fn(), end: vi.fn() };
    function Button() {
      function handleTouchStart() {
        "main thread";
        runOnBackground(reports.start)();
      }
      function handleTouchEnd() {
        "main thread";
        runOnBackground(reports.end)();
      }
      const { value } = useQuantityPickerContext();
      const { pressed, buttonProps } = useQuantityPickerIncrementButton({
        "main-thread:bindtouchstart": handleTouchStart,
        "main-thread:bindtouchend": handleTouchEnd,
      });
      return (
        <view className="increment" {...buttonProps}>
          <text>{`value=${value} pressed=${pressed}`}</text>
        </view>
      );
    }
    render(
      <QuantityPicker.Root min={0} max={5}>
        <Button />
      </QuantityPicker.Root>,
      { enableMainThread: true, enableBackgroundThread: true },
    );
    await waitSchedule();

    fireEvent.touchstart(increment(), {});
    await waitSchedule();
    expect(increment()).toHaveTextContent("pressed=true");
    fireEvent.touchend(increment(), {});
    await waitSchedule();
    expect(increment()).toHaveTextContent("pressed=false");
    expect(reports.start).toHaveBeenCalledTimes(1);
    expect(reports.end).toHaveBeenCalledTimes(1);
  });

  it("forwards Root and part refs to native views", () => {
    const refs: Record<string, unknown> = {};
    render(
      <QuantityPicker.Root
        min={0}
        max={5}
        ref={(value) => {
          refs.root = value;
        }}
      >
        <QuantityPicker.DecrementButton
          ref={(value) => {
            refs.decrement = value;
          }}
        />
        <QuantityPicker.ValueDisplay
          ref={(value) => {
            refs.value = value;
          }}
        />
        <QuantityPicker.IncrementButton
          ref={(value) => {
            refs.increment = value;
          }}
        />
      </QuantityPicker.Root>,
    );

    expect(Object.keys(refs).filter((key) => refs[key])).toEqual([
      "root",
      "decrement",
      "value",
      "increment",
    ]);
  });

  it("rejects ranges and values that are not safe integers within bounds", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Picker min={3} max={1} />)).toThrow();
    expect(() => render(<Picker min={0} max={5} step={0.5} />)).toThrow();
    expect(() => render(<Picker min={0} max={5} defaultValue={6} />)).toThrow();
    expect(() => render(<Picker min={0} max={5} value={-1} />)).toThrow();
  });
});
