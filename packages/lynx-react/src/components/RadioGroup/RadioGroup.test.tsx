import "@testing-library/jest-dom";
import { Fragment } from "@lynx-js/react";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { RadioGroupField } from "../RadioGroupField";
import { RadioGroup } from "./index";

function getItems(container: HTMLElement) {
  return container.querySelectorAll<HTMLElement>(".seed-radio__root");
}

describe("RadioGroup", () => {
  it("exposes group and item accessibility defaults while preserving selection", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RadioGroupField.Root
        accessibility-label="과일"
        defaultValue="apple"
        onValueChange={onValueChange}
      >
        <RadioGroup.Root>
          <RadioGroup.Item value="apple" accessibility-label="사과">
            <RadioGroup.ItemControl>
              <RadioGroup.ItemIndicator />
            </RadioGroup.ItemControl>
          </RadioGroup.Item>
          <RadioGroup.Item value="banana" accessibility-label="바나나" />
        </RadioGroup.Root>
      </RadioGroupField.Root>,
    );
    const root = container.firstElementChild;
    const [apple, banana] = getItems(container);

    expect(root).toHaveAttribute("accessibility-element", "false");
    expect(root).toHaveAttribute("accessibility-role-description", "radiogroup");
    expect(root).toHaveAttribute("accessibility-label", "과일");
    expect(apple).toHaveAttribute("accessibility-element", "true");
    expect(apple).toHaveAttribute("flatten", "false");
    expect(apple).toHaveAttribute("accessibility-role-description", "radio");
    expect(apple).toHaveAttribute("accessibility-label", "사과");
    expect(apple).toHaveAttribute("accessibility-value", "selected");
    expect(banana).toHaveAttribute("accessibility-value", "not selected");
    expect(apple.querySelector(".seed-radiomark__root")).toHaveClass("seed-radio__control");

    fireEvent.tap(banana);

    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(apple).toHaveAttribute("accessibility-value", "not selected");
    expect(banana).toHaveAttribute("accessibility-value", "selected");
  });

  it("derives item names from nested label text and hides repeated label elements", () => {
    const { container } = render(
      <RadioGroupField.Root accessibility-label="과일">
        <RadioGroup.Root>
          <RadioGroup.Item value="apple">
            <RadioGroup.ItemLabel>
              <Fragment>사과</Fragment>
            </RadioGroup.ItemLabel>
            <RadioGroup.ItemLabel accessibility-elements-hidden>장식</RadioGroup.ItemLabel>
          </RadioGroup.Item>
          <RadioGroup.Item value="banana" accessibility-label="바나나 선택" flatten>
            <RadioGroup.ItemLabel accessibility-element accessibility-elements-hidden={false}>
              바나나
            </RadioGroup.ItemLabel>
          </RadioGroup.Item>
        </RadioGroup.Root>
      </RadioGroupField.Root>,
    );
    const [apple, banana] = getItems(container);
    const appleLabel = apple.querySelector(".seed-radio__label");
    const bananaLabel = banana.querySelector(".seed-radio__label");

    expect(container.querySelector(".seed-radio-group__root")).toHaveAttribute(
      "accessibility-element",
      "false",
    );
    expect(apple).toHaveAttribute("accessibility-label", "사과");
    expect(appleLabel).toHaveAttribute("accessibility-element", "false");
    expect(appleLabel).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(banana).toHaveAttribute("accessibility-label", "바나나 선택");
    expect(banana).toHaveAttribute("flatten", "true");
    expect(bananaLabel).toHaveAttribute("accessibility-element", "true");
    expect(bananaLabel).toHaveAttribute("accessibility-elements-hidden", "false");
  });

  it("warns only when an exposed item has no accessible name", () => {
    const accessibilityWarnings = vi.fn();
    const warn = vi.spyOn(console, "warn").mockImplementation((message) => {
      if (String(message).startsWith("RadioGroupItem:")) accessibilityWarnings();
    });
    try {
      const { container, rerender } = render(
        <RadioGroupField.Root>
          <RadioGroup.Item value="apple">
            <text>사과</text>
          </RadioGroup.Item>
        </RadioGroupField.Root>,
      );
      expect(getItems(container)[0]).not.toHaveAttribute("accessibility-label");
      expect(accessibilityWarnings).toHaveBeenCalled();
      accessibilityWarnings.mockClear();

      rerender(
        <RadioGroupField.Root>
          <RadioGroup.Item value="apple" accessibility-element={false} />
        </RadioGroupField.Root>,
      );
      expect(accessibilityWarnings).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });

  it("exposes disabled state and allows accessibility overrides", () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(
      <RadioGroupField.Root disabled onValueChange={onValueChange}>
        <RadioGroup.Root>
          <RadioGroup.Item value="apple" />
        </RadioGroup.Root>
      </RadioGroupField.Root>,
    );
    const root = container.firstElementChild;
    const [disabledItem] = getItems(container);

    expect(root).toHaveAttribute("accessibility-traits", "disabled");
    expect(disabledItem).toHaveAttribute("accessibility-traits", "disabled");

    fireEvent.tap(disabledItem);

    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <RadioGroupField.Root
        disabled
        accessibility-element={false}
        accessibility-role-description="custom group"
        accessibility-traits="button"
      >
        <RadioGroup.Root>
          <RadioGroup.Item
            value="apple"
            accessibility-element={false}
            accessibility-role-description="custom radio"
            accessibility-traits="button"
            accessibility-value="custom selection"
          />
        </RadioGroup.Root>
      </RadioGroupField.Root>,
    );
    const overriddenRoot = container.firstElementChild;
    const [overriddenItem] = getItems(container);

    expect(overriddenRoot).toHaveAttribute("accessibility-element", "false");
    expect(overriddenRoot).toHaveAttribute("accessibility-role-description", "custom group");
    expect(overriddenRoot).toHaveAttribute("accessibility-traits", "button");
    expect(overriddenItem).toHaveAttribute("accessibility-element", "false");
    expect(overriddenItem).toHaveAttribute("accessibility-role-description", "custom radio");
    expect(overriddenItem).toHaveAttribute("accessibility-traits", "button");
    expect(overriddenItem).toHaveAttribute("accessibility-value", "custom selection");
  });
});
