import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import * as Chip from "./Chip.namespace";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getChipRoot() {
  const root = getRenderedRoot();

  if (root.classList.contains("seed-chip__root")) return root;

  const chipRoot = root.querySelector<HTMLElement>(".seed-chip__root");
  if (!chipRoot) throw new Error("Expected Chip root to exist.");

  return chipRoot;
}

describe("Chip", () => {
  it("renders the button and label recipe slots", () => {
    render(
      <Chip.Button size="large" variant="outlineStrong">
        <Chip.Label>버튼 칩</Chip.Label>
      </Chip.Button>,
    );

    const root = getChipRoot();
    const label = root.querySelector(".seed-chip__label");

    expect(root).toHaveClass("seed-chip__root--size_large");
    expect(root).toHaveClass("seed-chip__root--variant_outlineStrong");
    expect(label).toHaveTextContent("버튼 칩");
    expect(label).toHaveClass("seed-chip__label--size_large");
  });

  it("toggles uncontrolled selected state", () => {
    const onCheckedChange = vi.fn();
    render(
      <Chip.Toggle onCheckedChange={onCheckedChange}>
        <Chip.Label>토글 칩</Chip.Label>
      </Chip.Toggle>,
    );

    const root = getChipRoot();
    expect(root).toHaveClass("seed-chip__root--selected_false");

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(getChipRoot()).toHaveClass("seed-chip__root--selected_true");
    expect(getChipRoot()).toHaveAttribute("accessibility-traits", "selected");
  });

  it("does not toggle when disabled", () => {
    const onCheckedChange = vi.fn();
    render(
      <Chip.Toggle disabled onCheckedChange={onCheckedChange}>
        <Chip.Label>비활성 칩</Chip.Label>
      </Chip.Toggle>,
    );

    const root = getChipRoot();
    fireEvent.tap(root);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveClass("seed-chip__root--disabled_true");
    expect(root).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("selects one radio item and reports the value", () => {
    const onValueChange = vi.fn();
    render(
      <Chip.RadioRoot defaultValue="first" onValueChange={onValueChange}>
        <Chip.RadioItem value="first">
          <Chip.Label>첫 번째</Chip.Label>
        </Chip.RadioItem>
        <Chip.RadioItem value="second">
          <Chip.Label>두 번째</Chip.Label>
        </Chip.RadioItem>
      </Chip.RadioRoot>,
    );

    const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(roots[0]).toHaveClass("seed-chip__root--selected_true");
    expect(roots[1]).toHaveClass("seed-chip__root--selected_false");

    fireEvent.tap(roots[1] as HTMLElement);

    expect(onValueChange).toHaveBeenCalledWith("second");
    const updatedRoots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(updatedRoots[0]).toHaveClass("seed-chip__root--selected_false");
    expect(updatedRoots[1]).toHaveClass("seed-chip__root--selected_true");
  });

  it("requires radio items to be rendered inside a radio root", () => {
    expect(() => {
      render(
        <Chip.RadioItem value="orphan">
          <Chip.Label>고립된 칩</Chip.Label>
        </Chip.RadioItem>,
      );
    }).toThrow(/must be rendered inside <ChipRadioRoot\/>/);
  });
});
