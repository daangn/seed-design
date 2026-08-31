import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as CheckSelectBox from "./CheckSelectBox.namespace";
import * as RadioSelectBox from "./RadioSelectBox.namespace";

function find(className: string): HTMLElement {
  const element = elementTree.root?.querySelector<HTMLElement>(className);
  if (!element) throw new Error(`Expected ${className} to exist.`);
  return element;
}

describe("SelectBox", () => {
  it("toggles a check select box and updates conditional footer visibility", () => {
    const onCheckedChange = vi.fn();

    render(
      <CheckSelectBox.Root onCheckedChange={onCheckedChange}>
        <CheckSelectBox.Trigger>
          <CheckSelectBox.Label>Option</CheckSelectBox.Label>
          <CheckSelectBox.CheckmarkControl />
        </CheckSelectBox.Trigger>
        <CheckSelectBox.Footer>Details</CheckSelectBox.Footer>
      </CheckSelectBox.Root>,
    );

    const root = find(".seed-select-box__root");
    expect(root).toHaveClass("seed-select-box__root--selected_false");
    expect(find(".seed-select-box-checkmark__root")).toHaveClass(
      "seed-select-box-checkmark__root--selected_false",
    );
    expect(root.querySelector(".seed-select-box__footer")).toBeNull();

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).toHaveClass("seed-select-box__root--selected_true");
    expect(root.querySelector(".seed-select-box__footer")).not.toBeNull();
  });

  it("keeps a single selected value in a radio select box group", () => {
    const onValueChange = vi.fn();

    render(
      <RadioSelectBox.Group onValueChange={onValueChange}>
        <RadioSelectBox.Item value="first">
          <RadioSelectBox.Label>First</RadioSelectBox.Label>
          <RadioSelectBox.Radiomark />
        </RadioSelectBox.Item>
        <RadioSelectBox.Item value="second">
          <RadioSelectBox.Label>Second</RadioSelectBox.Label>
          <RadioSelectBox.Radiomark />
        </RadioSelectBox.Item>
      </RadioSelectBox.Group>,
    );

    const items = elementTree.root?.querySelectorAll<HTMLElement>(".seed-select-box__root");
    if (!items || items.length !== 2) throw new Error("Expected two radio select box items.");

    fireEvent.tap(items[1]);

    expect(onValueChange).toHaveBeenCalledWith("second");
    expect(items[0]).toHaveClass("seed-select-box__root--selected_false");
    expect(items[1]).toHaveClass("seed-select-box__root--selected_true");

    const radiomarks = elementTree.root?.querySelectorAll<HTMLElement>(".seed-radiomark__root");
    if (!radiomarks || radiomarks.length !== 2) throw new Error("Expected two radiomarks.");
    expect(radiomarks[0]).toHaveClass("seed-radiomark__root--checked_false");
    expect(radiomarks[1]).toHaveClass("seed-radiomark__root--checked_true");
  });

  it("does not change disabled items", () => {
    const onCheckedChange = vi.fn();

    render(<CheckSelectBox.Root disabled onCheckedChange={onCheckedChange} />);
    fireEvent.tap(find(".seed-select-box__root"));

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(find(".seed-select-box__root")).toHaveClass("seed-select-box__root--disabled_true");
  });
});
