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
    expect(root).toHaveAttribute("accessibility-role-description", "button");
    expect(label).toHaveTextContent("버튼 칩");
    expect(label).toHaveClass("seed-chip__label--size_large");
  });

  it("toggles uncontrolled checked state after the consumer tap handler", () => {
    const calls: string[] = [];
    render(
      <Chip.Toggle
        bindtap={() => calls.push("tap")}
        onCheckedChange={(checked) => calls.push(`checked:${checked}`)}
      >
        <Chip.Label>토글 칩</Chip.Label>
      </Chip.Toggle>,
    );

    const root = getChipRoot();
    expect(root).toHaveClass("seed-chip__root--selected_false");
    expect(root).toHaveAttribute("accessibility-role-description", "checkbox");
    expect(root).toHaveAttribute("accessibility-value", "not checked");

    fireEvent.tap(root);

    expect(calls).toEqual(["tap", "checked:true"]);
    expect(getChipRoot()).toHaveClass("seed-chip__root--selected_true");
    expect(getChipRoot()).toHaveAttribute("accessibility-value", "checked");
  });

  it("does not toggle or call the consumer tap handler when disabled", () => {
    const onCheckedChange = vi.fn();
    const onTap = vi.fn();
    render(
      <Chip.Toggle disabled bindtap={onTap} onCheckedChange={onCheckedChange}>
        <Chip.Label>비활성 칩</Chip.Label>
      </Chip.Toggle>,
    );

    const root = getChipRoot();
    fireEvent.tap(root);

    expect(onTap).not.toHaveBeenCalled();
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveClass("seed-chip__root--disabled_true");
    expect(root).toHaveAttribute("accessibility-traits", "disabled");
  });

  it("selects one radio item after the consumer tap handler and reports the value", () => {
    const calls: string[] = [];
    render(
      <Chip.RadioRoot defaultValue="first" onValueChange={(value) => calls.push(`value:${value}`)}>
        <Chip.RadioItem value="first">
          <Chip.Label>첫 번째</Chip.Label>
        </Chip.RadioItem>
        <Chip.RadioItem value="second" bindtap={() => calls.push("tap")}>
          <Chip.Label>두 번째</Chip.Label>
        </Chip.RadioItem>
      </Chip.RadioRoot>,
    );

    const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(roots[0]?.parentElement).toHaveAttribute("accessibility-role-description", "radiogroup");
    expect(roots[0]).toHaveClass("seed-chip__root--selected_true");
    expect(roots[1]).toHaveClass("seed-chip__root--selected_false");
    expect(roots[0]).toHaveAttribute("accessibility-role-description", "radio");
    expect(roots[0]).toHaveAttribute("accessibility-value", "selected");
    expect(roots[1]).toHaveAttribute("accessibility-value", "not selected");

    fireEvent.tap(roots[1] as HTMLElement);

    expect(calls).toEqual(["tap", "value:second"]);
    const updatedRoots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(updatedRoots[0]).toHaveClass("seed-chip__root--selected_false");
    expect(updatedRoots[1]).toHaveClass("seed-chip__root--selected_true");
    expect(updatedRoots[0]).toHaveAttribute("accessibility-value", "not selected");
    expect(updatedRoots[1]).toHaveAttribute("accessibility-value", "selected");
  });

  it("prefers custom accessibility props to defaults", () => {
    render(
      <view>
        <Chip.Button
          disabled
          accessibility-role-description="custom button"
          accessibility-traits="link"
        />
        <Chip.Toggle
          disabled
          defaultChecked
          accessibility-role-description="custom toggle"
          accessibility-traits="link"
          accessibility-value="custom checked"
        />
        <Chip.RadioRoot defaultValue="selected" disabled>
          <Chip.RadioItem
            value="selected"
            accessibility-role-description="custom radio"
            accessibility-traits="link"
            accessibility-value="custom selected"
          />
        </Chip.RadioRoot>
      </view>,
    );

    const roots = getRenderedRoot().querySelectorAll(".seed-chip__root");
    expect(roots[0]).toHaveAttribute("accessibility-role-description", "custom button");
    expect(roots[0]).toHaveAttribute("accessibility-traits", "link");
    expect(roots[1]).toHaveAttribute("accessibility-role-description", "custom toggle");
    expect(roots[1]).toHaveAttribute("accessibility-traits", "link");
    expect(roots[1]).toHaveAttribute("accessibility-value", "custom checked");
    expect(roots[2]).toHaveAttribute("accessibility-role-description", "custom radio");
    expect(roots[2]).toHaveAttribute("accessibility-traits", "link");
    expect(roots[2]).toHaveAttribute("accessibility-value", "custom selected");
  });

  it("requires radio items to be rendered inside a radio root", () => {
    expect(() => {
      render(
        <Chip.RadioItem value="orphan">
          <Chip.Label>고립된 칩</Chip.Label>
        </Chip.RadioItem>,
      );
    }).toThrow();
  });
});
