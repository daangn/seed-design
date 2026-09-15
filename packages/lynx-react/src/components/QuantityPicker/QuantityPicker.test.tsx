import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../types";
import { QuantityPicker } from "./index";

const TestIcon = React.forwardRef<MainThread.Element, LynxIconElementProps>((props, ref) => (
  <image {...props} {...(ref ? { "main-thread:ref": ref } : {})} />
));
TestIcon.displayName = "TestIcon";

function renderQuantityPicker(
  props: Partial<QuantityPicker.RootProps> = {},
  children?: React.ReactNode,
) {
  const rootProps = {
    min: 0,
    max: 5,
    "accessibility-label": "수량",
    ...props,
  } as QuantityPicker.RootProps;

  return render(
    <QuantityPicker.Root {...rootProps}>
      {children ?? (
        <>
          <QuantityPicker.DecrementButton accessibility-label="줄이기" />
          <QuantityPicker.ValueDisplay />
          <QuantityPicker.IncrementButton accessibility-label="늘리기" />
        </>
      )}
    </QuantityPicker.Root>,
  );
}

function getElement(container: HTMLElement, selector: string) {
  const element = container.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`Expected element matching ${selector} to exist.`);
  return element;
}

function getAction(container: HTMLElement, label: string) {
  return getElement(container, `[accessibility-label="${label}"]`);
}

function getRoot(container: HTMLElement) {
  return getAction(container, "수량");
}

function getValueText(container: HTMLElement) {
  return getElement(container, ".seed-quantity-picker__valueDisplayText");
}

function getText(container: HTMLElement, text: string) {
  const element = Array.from(container.querySelectorAll<HTMLElement>("text")).find(
    (candidate) => candidate.textContent === text,
  );
  if (!element) throw new Error(`Expected text node ${text} to exist.`);
  return element;
}

describe("QuantityPicker", () => {
  it("initializes from min and clamps uncontrolled changes", () => {
    const { container } = renderQuantityPicker({ min: 1, max: 3, step: 2 });
    const increment = getAction(container, "늘리기");

    expect(getValueText(container)).toHaveTextContent("1");
    fireEvent.tap(increment);
    expect(getValueText(container)).toHaveTextContent("3");
    fireEvent.tap(increment);
    expect(getValueText(container)).toHaveTextContent("3");
  });

  it("calls back without changing a controlled value", () => {
    const onValueChange = vi.fn();
    const { container } = renderQuantityPicker({ value: 2, onValueChange });

    fireEvent.tap(getAction(container, "늘리기"));
    expect(onValueChange).toHaveBeenCalledWith(3);
    expect(getValueText(container)).toHaveTextContent("2");
  });
  it("uses the decrement action as remove at min", () => {
    const onRemove = vi.fn();
    const onValueChange = vi.fn();
    const { container } = renderQuantityPicker({
      min: 1,
      defaultValue: 1,
      removable: true,
      removeAccessibilityLabel: "상품 삭제",
      onRemove,
      onValueChange,
    });

    fireEvent.tap(getAction(container, "상품 삭제"));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(getValueText(container)).toHaveTextContent("1");
  });

  it("blocks per-action loading and readOnly taps", () => {
    const onValueChange = vi.fn();
    const { container } = renderQuantityPicker({
      defaultValue: 2,
      loading: { increment: true },
      readOnly: true,
      onValueChange,
    });

    const decrement = getAction(container, "줄이기");
    const increment = getAction(container, "늘리기");
    expect(decrement).toHaveAttribute("accessibility-traits", "disabled");
    expect(increment).toHaveAttribute("accessibility-traits", "disabled");
    fireEvent.tap(increment);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("applies disabled icon state at action boundaries", () => {
    const { container } = renderQuantityPicker(
      { defaultValue: 0 },
      <>
        <QuantityPicker.DecrementButton accessibility-label="줄이기" icon={<TestIcon />} />
        <QuantityPicker.ValueDisplay />
        <QuantityPicker.IncrementButton accessibility-label="늘리기" icon={<TestIcon />} />
      </>,
    );

    const decrement = getAction(container, "줄이기");
    const increment = getAction(container, "늘리기");
    expect(decrement).toHaveAttribute("accessibility-traits", "disabled");
    expect(increment).toHaveAttribute("accessibility-traits", "button");
    expect(getElement(container, ".seed-quantity-picker__decrementIcon")).toHaveClass(
      "seed-quantity-picker__decrementIcon--disabled_true",
    );
    expect(getElement(container, ".seed-quantity-picker__incrementIcon")).not.toHaveClass(
      "seed-quantity-picker__incrementIcon--disabled_true",
    );
    fireEvent.tap(decrement);
    expect(getValueText(container)).toHaveTextContent("0");
    fireEvent.tap(increment);
    expect(getValueText(container)).toHaveTextContent("1");
  });

  it("renders loading indicators as ordinary nodes and primitive content as text", () => {
    const { container } = renderQuantityPicker(
      { defaultValue: 1, loading: { increment: true } },
      <>
        <QuantityPicker.DecrementButton>−</QuantityPicker.DecrementButton>
        <QuantityPicker.ValueDisplay />
        <QuantityPicker.IncrementButton loadingIndicator={<view className="loading-node" />}>
          +
        </QuantityPicker.IncrementButton>
      </>,
    );

    expect(getText(container, "−").tagName.toLowerCase()).toBe("text");
    const loadingNode = getElement(container, ".loading-node");
    expect(loadingNode).not.toHaveClass("seed-quantity-picker__incrementIcon");
    expect(loadingNode.parentElement).toHaveClass("seed-quantity-picker__incrementIcon");
  });

  it("formats the value and reserves width for a negative minimum", () => {
    const { container } = renderQuantityPicker({
      min: -999,
      max: 5,
      defaultValue: -2,
      getValueText: (valueText, value) => `${valueText}개(${value})`,
    });

    expect(getValueText(container)).toHaveTextContent("-2개(-2)");
    expect(
      getElement(container, ".seed-quantity-picker__valueDisplayPlaceholder"),
    ).toHaveTextContent("-000개(-000)");
  });

  it("inserts dividers only between adjacent actions and value, and reverses RTL children", () => {
    const { container } = renderQuantityPicker(
      { dir: "rtl" },
      <>
        <QuantityPicker.DecrementButton accessibility-label="줄이기" />
        <QuantityPicker.ValueDisplay />
        <QuantityPicker.IncrementButton accessibility-label="늘리기" />
      </>,
    );

    const root = getRoot(container);
    expect(root.children[0]).toBe(getAction(container, "늘리기"));
    expect(root.children[1]).toHaveClass("seed-quantity-picker__divider");
    expect(root.children[2]).toHaveClass("seed-quantity-picker__valueDisplay");
    expect(root.children[3]).toHaveClass("seed-quantity-picker__divider");
    expect(root.children[4]).toBe(getAction(container, "줄이기"));
    expect(container.querySelectorAll<HTMLElement>(".seed-quantity-picker__divider")).toHaveLength(
      2,
    );
  });

  it("exposes native accessibility defaults without leaking recipe props", () => {
    const { container } = renderQuantityPicker({
      disabled: true,
      invalid: true,
      layout: "fill",
      size: "large",
      defaultValue: 2,
    });
    const root = getRoot(container);
    const valueDisplay = getElement(container, ".seed-quantity-picker__valueDisplay");

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-role-description", "quantity picker");
    expect(root).toHaveAttribute("accessibility-traits", "disabled");
    expect(root).toHaveAttribute("accessibility-value", "2");
    expect(root).not.toHaveAttribute("layout");
    expect(root).not.toHaveAttribute("size");
    expect(root).not.toHaveAttribute("data-invalid");
    expect(valueDisplay).toHaveAttribute("accessibility-elements-hidden", "true");
  });

  it("allows ValueDisplay accessibility override", () => {
    const { container } = renderQuantityPicker(
      {},
      <>
        <QuantityPicker.DecrementButton />
        <QuantityPicker.ValueDisplay accessibility-elements-hidden={false} />
        <QuantityPicker.IncrementButton />
      </>,
    );

    expect(getElement(container, ".seed-quantity-picker__valueDisplay")).toHaveAttribute(
      "accessibility-elements-hidden",
      "false",
    );
  });
});
