import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { SwitchControl, SwitchRoot, SwitchThumb, useSwitchContext } from "../Switch";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getRenderedQueries() {
  return getQueriesForElement(getRenderedRoot());
}

function getRootView() {
  const root = getRenderedRoot();
  return root.matches("view") ? root : root.querySelector("view")!;
}

describe("SwitchRoot", () => {
  it("toggles uncontrolled checked state on tap", () => {
    const onCheckedChange = vi.fn();
    render(
      <SwitchRoot defaultChecked={false} onCheckedChange={onCheckedChange}>
        스위치
      </SwitchRoot>,
    );

    const root = getRootView();

    expect(root).not.toHaveClass("ui-checked");

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).toHaveClass("ui-checked");
  });

  it("keeps controlled checked state until value changes", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <SwitchRoot checked={false} onCheckedChange={onCheckedChange}>
        스위치
      </SwitchRoot>,
    );

    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).not.toHaveClass("ui-checked");

    rerender(
      <SwitchRoot checked onCheckedChange={onCheckedChange}>
        스위치
      </SwitchRoot>,
    );

    expect(root).toHaveClass("ui-checked");
  });

  it("ignores tap when disabled", () => {
    const onCheckedChange = vi.fn();
    render(
      <SwitchRoot disabled defaultChecked={false} onCheckedChange={onCheckedChange}>
        스위치
      </SwitchRoot>,
    );

    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveClass("ui-disabled");
  });

  it("passes state to render-prop children", () => {
    render(
      <SwitchRoot defaultChecked disabled>
        {(state) => <text>{state.checked && state.disabled ? "on-disabled" : "off"}</text>}
      </SwitchRoot>,
    );

    expect(getRenderedQueries().getByText("on-disabled")).toBeInTheDocument();
  });

  it("shares state through control and thumb context", () => {
    render(
      <SwitchRoot defaultChecked>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
      </SwitchRoot>,
    );

    const root = getRenderedRoot();

    expect(root.querySelector("view > view")).toHaveClass("ui-checked");
    expect(root.querySelector("view > view > view")).toHaveClass("ui-checked");
  });

  it("throws when context hook is used outside provider", () => {
    function Consumer() {
      useSwitchContext("Consumer");
      return null;
    }

    expect(() => render(<Consumer />)).toThrow("Consumer must be used inside <SwitchRoot/>.");
  });
});
