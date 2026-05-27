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
        {(state) => <text>{state.checked ? "checked" : "unchecked"}</text>}
      </CheckboxRoot>,
    );

    const root = getRootView();

    expect(root).not.toHaveClass("ui-checked");
    expect(getRenderedQueries().getByText("unchecked")).toBeInTheDocument();

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(getRenderedQueries().getByText("checked")).toBeInTheDocument();
    expect(root).not.toHaveClass("ui-checked");
  });

  it("keeps controlled checked state until value changes", () => {
    const onCheckedChange = vi.fn();
    const { rerender } = render(
      <CheckboxRoot checked={false} onCheckedChange={onCheckedChange}>
        {(state) => <text>{state.checked ? "checked" : "unchecked"}</text>}
      </CheckboxRoot>,
    );

    const root = getRootView();

    fireEvent.tap(root);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(getRenderedQueries().getByText("unchecked")).toBeInTheDocument();
    expect(root).not.toHaveClass("ui-checked");

    rerender(
      <CheckboxRoot checked onCheckedChange={onCheckedChange}>
        {(state) => <text>{state.checked ? "checked" : "unchecked"}</text>}
      </CheckboxRoot>,
    );

    expect(getRenderedQueries().getByText("checked")).toBeInTheDocument();
    expect(root).not.toHaveClass("ui-checked");
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
    expect(root).not.toHaveClass("ui-disabled");
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

  it("marks the root with checkbox accessibility semantics", () => {
    render(
      <CheckboxRoot
        defaultChecked
        indeterminate
        accessibility-label="약관 동의"
        accessibility-value="일부 선택됨"
      >
        체크박스
      </CheckboxRoot>,
    );

    const root = getRootView();

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-traits", "button");
    expect(root).toHaveAttribute("accessibility-role-description", "checkbox");
    expect(root).toHaveAttribute("accessibility-label", "약관 동의");
    expect(root).toHaveAttribute("accessibility-value", "일부 선택됨");
  });

  it("ignores legacy checkboxProps bucket when native props are passed directly", () => {
    render(
      <CheckboxRoot
        {...({
          checkboxProps: {
            className: "legacy-checkbox",
          },
        } as never)}
        className="direct-checkbox"
      >
        체크박스
      </CheckboxRoot>,
    );

    const root = getRootView();

    expect(root).toHaveClass("direct-checkbox");
    expect(root).not.toHaveClass("legacy-checkbox");
  });

  it("shares state through control and indicator context without adding automatic state classes", () => {
    render(
      <CheckboxRoot defaultChecked indeterminate>
        <CheckboxControl>
          <CheckboxIndicator>
            {(state) => <text>{state.checked && state.indeterminate ? "mixed" : "plain"}</text>}
          </CheckboxIndicator>
        </CheckboxControl>
      </CheckboxRoot>,
    );

    const root = getRenderedRoot();

    expect(getRenderedQueries().getByText("mixed")).toBeInTheDocument();
    expect(root.querySelector("view > view")).not.toHaveClass("ui-checked");
    expect(root.querySelector("view > view")).not.toHaveClass("ui-indeterminate");
    expect(root.querySelector("view > view > view")).not.toHaveClass("ui-checked");
    expect(root.querySelector("view > view > view")).not.toHaveClass("ui-indeterminate");
  });

  it("uses direct native props on control and indicator slots", () => {
    render(
      <CheckboxRoot defaultChecked>
        <CheckboxControl
          {...({
            checkboxProps: {
              className: "legacy-control",
            },
          } as never)}
          className="direct-control"
        >
          <CheckboxIndicator
            {...({
              indicatorProps: {
                className: "legacy-indicator",
              },
            } as never)}
            className="direct-indicator"
          >
            표시
          </CheckboxIndicator>
        </CheckboxControl>
      </CheckboxRoot>,
    );

    const root = getRenderedRoot();
    const control = root.querySelector("view > view")!;
    const indicator = root.querySelector("view > view > view")!;

    expect(control).toHaveClass("direct-control");
    expect(control).not.toHaveClass("legacy-control");
    expect(indicator).toHaveClass("direct-indicator");
    expect(indicator).not.toHaveClass("legacy-indicator");
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
