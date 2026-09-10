import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { RadioGroup } from "./index";

function getItems(container: HTMLElement) {
  return container.querySelectorAll<HTMLElement>(".seed-radio__root");
}

describe("RadioGroup", () => {
  it("exposes group and item accessibility defaults while preserving selection", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <RadioGroup.Root
        accessibility-label="과일"
        defaultValue="apple"
        onValueChange={onValueChange}
      >
        <RadioGroup.Item value="apple" accessibility-label="사과" />
        <RadioGroup.Item value="banana" accessibility-label="바나나" />
      </RadioGroup.Root>,
    );
    const root = container.firstElementChild;
    const [apple, banana] = getItems(container);

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-role-description", "radiogroup");
    expect(root).toHaveAttribute("accessibility-label", "과일");
    expect(apple).toHaveAttribute("accessibility-element", "true");
    expect(apple).toHaveAttribute("accessibility-role-description", "radio");
    expect(apple).toHaveAttribute("accessibility-label", "사과");
    expect(apple).toHaveAttribute("accessibility-value", "selected");
    expect(banana).toHaveAttribute("accessibility-value", "not selected");

    fireEvent.tap(banana);

    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(apple).toHaveAttribute("accessibility-value", "not selected");
    expect(banana).toHaveAttribute("accessibility-value", "selected");
  });

  it("exposes disabled state and allows accessibility overrides", () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(
      <RadioGroup.Root disabled onValueChange={onValueChange}>
        <RadioGroup.Item value="apple" />
      </RadioGroup.Root>,
    );
    const root = container.firstElementChild;
    const [disabledItem] = getItems(container);

    expect(root).toHaveAttribute("accessibility-traits", "disabled");
    expect(disabledItem).toHaveAttribute("accessibility-traits", "disabled");

    fireEvent.tap(disabledItem);

    expect(onValueChange).not.toHaveBeenCalled();

    rerender(
      <RadioGroup.Root
        disabled
        accessibility-element={false}
        accessibility-role-description="custom group"
        accessibility-traits="button"
      >
        <RadioGroup.Item
          value="apple"
          accessibility-element={false}
          accessibility-role-description="custom radio"
          accessibility-traits="button"
          accessibility-value="custom selection"
        />
      </RadioGroup.Root>,
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
