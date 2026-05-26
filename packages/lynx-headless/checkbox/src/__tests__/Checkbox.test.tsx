import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { CheckboxControl, CheckboxIndicator, CheckboxRoot, useCheckboxContext } from "../Checkbox";

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

describe("CheckboxRoot", () => {
  it("toggles uncontrolled checked state on tap", () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckboxRoot defaultChecked={false} onCheckedChange={onCheckedChange}>
        체크박스
      </CheckboxRoot>,
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
      <CheckboxRoot checked={false} onCheckedChange={onCheckedChange}>
        체크박스
      </CheckboxRoot>,
    );

    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(root).not.toHaveClass("ui-checked");

    rerender(
      <CheckboxRoot checked onCheckedChange={onCheckedChange}>
        체크박스
      </CheckboxRoot>,
    );

    expect(root).toHaveClass("ui-checked");
  });

  it("ignores tap when disabled", () => {
    const onCheckedChange = vi.fn();
    render(
      <CheckboxRoot disabled defaultChecked={false} onCheckedChange={onCheckedChange}>
        체크박스
      </CheckboxRoot>,
    );

    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(root).toHaveClass("ui-disabled");
  });

  it("passes state to render-prop children", () => {
    render(
      <CheckboxRoot defaultChecked indeterminate>
        {(state) => (
          <text>{state.checked && state.indeterminate ? "checked-mixed" : "unchecked"}</text>
        )}
      </CheckboxRoot>,
    );

    expect(getRenderedQueries().getByText("checked-mixed")).toBeInTheDocument();
  });

  it("shares state through control and indicator context", () => {
    render(
      <CheckboxRoot defaultChecked indeterminate>
        <CheckboxControl>
          <CheckboxIndicator>표시</CheckboxIndicator>
        </CheckboxControl>
      </CheckboxRoot>,
    );

    const root = getRenderedRoot();

    expect(root.querySelector("view > view")).toHaveClass("ui-checked", "ui-indeterminate");
    expect(root.querySelector("view > view > view")).toHaveClass("ui-checked", "ui-indeterminate");
  });

  it("does not render indicator when unchecked unless forceMount is true", () => {
    const { rerender } = render(
      <CheckboxRoot>
        <CheckboxIndicator>표시</CheckboxIndicator>
      </CheckboxRoot>,
    );

    expect(getRenderedRoot()).not.toHaveTextContent("표시");

    rerender(
      <CheckboxRoot>
        <CheckboxIndicator forceMount>표시</CheckboxIndicator>
      </CheckboxRoot>,
    );

    expect(getRenderedQueries().getByText("표시")).toBeInTheDocument();
  });

  it("throws when context hook is used outside provider", () => {
    function Consumer() {
      useCheckboxContext("Consumer");
      return null;
    }

    expect(() => render(<Consumer />)).toThrow("Consumer must be used inside <CheckboxRoot/>.");
  });
});
