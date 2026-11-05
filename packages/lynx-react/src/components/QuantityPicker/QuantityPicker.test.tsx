import "@testing-library/jest-dom";
import * as React from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import type { MainThread } from "@lynx-js/types";
import { describe, expect, it, vi } from "vitest";

import type { LynxIconElementProps } from "../../types";
import { AccessibilityElementScope } from "../../utils/accessibility";
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
  return getElement(container, ".seed-quantity-picker__root");
}

function getValueText(container: HTMLElement) {
  return getElement(container, ".seed-quantity-picker__valueDisplayText");
}

function getValueDisplay(container: HTMLElement) {
  return getElement(container, ".seed-quantity-picker__valueDisplay");
}

function getText(container: HTMLElement, text: string) {
  const element = Array.from(container.querySelectorAll<HTMLElement>("text")).find(
    (candidate) => candidate.textContent === text,
  );
  if (!element) throw new Error(`Expected text node ${text} to exist.`);
  return element;
}

function isQuantityPickerWarning([message]: unknown[]) {
  return typeof message === "string" && message.startsWith("QuantityPicker");
}

describe("QuantityPicker", () => {
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
    expect(getValueDisplay(container)).toHaveAttribute("accessibility-value", "-2개(-2)");
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
    const valueDisplay = getValueDisplay(container);

    expect(root).toHaveAttribute("accessibility-element", "false");
    expect(root).not.toHaveAttribute("accessibility-label");
    expect(root).not.toHaveAttribute("accessibility-value");
    expect(root).not.toHaveAttribute("layout");
    expect(root).not.toHaveAttribute("size");
    expect(root).not.toHaveAttribute("data-invalid");
    for (const label of ["줄이기", "늘리기"]) {
      const button = getAction(container, label);
      expect(button).toHaveAttribute("accessibility-element", "true");
      expect(button).toHaveAttribute("accessibility-role-description", "button");
      expect(button).toHaveAttribute("accessibility-traits", "disabled");
      expect(button).toHaveAttribute("flatten", "false");
    }
    expect(valueDisplay).toHaveAttribute("accessibility-element", "true");
    expect(valueDisplay).toHaveAttribute("accessibility-label", "수량");
    expect(valueDisplay).toHaveAttribute("accessibility-value", "2");
    expect(valueDisplay).toHaveAttribute("flatten", "false");
    expect(valueDisplay).not.toHaveAttribute("accessibility-elements-hidden");
    for (const text of [
      getValueText(container),
      getElement(container, ".seed-quantity-picker__valueDisplayPlaceholder"),
    ]) {
      expect(text).toHaveAttribute("accessibility-element", "false");
      expect(text).toHaveAttribute("accessibility-elements-hidden", "true");
    }
  });

  it("updates the independent value accessibility text after quantity changes", () => {
    const { container } = renderQuantityPicker({
      defaultValue: 2,
      getValueText: (text) => `${text}개`,
    });

    expect(getValueDisplay(container)).toHaveAttribute("accessibility-value", "2개");
    fireEvent.tap(getAction(container, "늘리기"));
    expect(getValueDisplay(container)).toHaveAttribute("accessibility-value", "3개");
    fireEvent.tap(getAction(container, "줄이기"));
    expect(getValueDisplay(container)).toHaveAttribute("accessibility-value", "2개");
  });

  it("preserves native overrides on the root and each independent element", () => {
    const { container } = renderQuantityPicker(
      {
        defaultValue: 2,
        "accessibility-element": true,
        "accessibility-role-description": "custom picker",
        "accessibility-traits": "header",
        "accessibility-value": "root value",
        flatten: true,
      },
      <>
        <QuantityPicker.DecrementButton
          accessibility-element={false}
          accessibility-label="custom decrease"
          accessibility-role-description="custom action"
          accessibility-traits="header"
          flatten={true}
        />
        <QuantityPicker.ValueDisplay
          accessibility-element={false}
          accessibility-label="custom value"
          accessibility-value="value override"
          accessibility-elements-hidden={true}
          flatten={true}
        />
        <QuantityPicker.IncrementButton
          accessibility-element={false}
          accessibility-label="custom increase"
          accessibility-role-description="custom action"
          accessibility-traits="header"
          flatten={true}
        />
      </>,
    );
    const root = getRoot(container);
    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-role-description", "custom picker");
    expect(root).toHaveAttribute("accessibility-traits", "header");
    expect(root).toHaveAttribute("accessibility-value", "root value");
    expect(root).toHaveAttribute("flatten", "true");
    for (const label of ["custom decrease", "custom increase"]) {
      const button = getAction(container, label);
      expect(button).toHaveAttribute("accessibility-element", "false");
      expect(button).toHaveAttribute("accessibility-role-description", "custom action");
      expect(button).toHaveAttribute("accessibility-traits", "header");
      expect(button).toHaveAttribute("flatten", "true");
    }
    const valueDisplay = getValueDisplay(container);
    expect(valueDisplay).toHaveAttribute("accessibility-element", "false");
    expect(valueDisplay).toHaveAttribute("accessibility-label", "custom value");
    expect(valueDisplay).toHaveAttribute("accessibility-value", "value override");
    expect(valueDisplay).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(valueDisplay).toHaveAttribute("flatten", "true");
  });

  it("warns for unnamed independent elements and respects element overrides", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const { rerender } = render(
        <QuantityPicker.Root min={0} max={5}>
          <QuantityPicker.DecrementButton />
          <QuantityPicker.ValueDisplay />
          <QuantityPicker.IncrementButton />
        </QuantityPicker.Root>,
      );
      expect(warn.mock.calls.filter(isQuantityPickerWarning)).not.toHaveLength(0);

      warn.mockClear();
      rerender(
        <QuantityPicker.Root min={0} max={5}>
          <QuantityPicker.DecrementButton accessibility-element={false} />
          <QuantityPicker.ValueDisplay accessibility-element={false} />
          <QuantityPicker.IncrementButton accessibility-element={false} />
        </QuantityPicker.Root>,
      );
      expect(warn.mock.calls.filter(isQuantityPickerWarning)).toHaveLength(0);

      rerender(
        <QuantityPicker.Root min={0} max={5} accessibility-label="수량">
          <QuantityPicker.DecrementButton accessibility-label="줄이기" />
          <QuantityPicker.ValueDisplay />
          <QuantityPicker.IncrementButton accessibility-label="늘리기" />
        </QuantityPicker.Root>,
      );
      expect(warn.mock.calls.filter(isQuantityPickerWarning)).toHaveLength(0);
    } finally {
      warn.mockRestore();
    }
  });

  it("does not warn inside an accessibility element scope or for a named remove action", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const { rerender } = render(
        <AccessibilityElementScope>
          <QuantityPicker.Root min={0} max={5}>
            <QuantityPicker.DecrementButton />
            <QuantityPicker.ValueDisplay />
            <QuantityPicker.IncrementButton />
          </QuantityPicker.Root>
        </AccessibilityElementScope>,
      );
      expect(warn.mock.calls.filter(isQuantityPickerWarning)).toHaveLength(0);

      rerender(
        <QuantityPicker.Root
          min={0}
          max={5}
          removable
          removeAccessibilityLabel="상품 삭제"
          onRemove={() => {}}
        >
          <QuantityPicker.DecrementButton />
          <QuantityPicker.ValueDisplay accessibility-label="수량" />
          <QuantityPicker.IncrementButton accessibility-label="늘리기" />
        </QuantityPicker.Root>,
      );
      expect(warn.mock.calls.filter(isQuantityPickerWarning)).toHaveLength(0);
    } finally {
      warn.mockRestore();
    }
  });
});
