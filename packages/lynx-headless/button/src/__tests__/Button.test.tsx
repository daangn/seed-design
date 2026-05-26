import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { ButtonRoot, useButtonContext } from "../Button";

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

describe("ButtonRoot", () => {
  it("renders active and disabled state classes", () => {
    render(<ButtonRoot disabled>버튼</ButtonRoot>);

    const button = getRootView();

    expect(button).toHaveClass("ui-disabled");
    expect(button).not.toHaveClass("ui-active");
  });

  it("tracks active state while pressed", () => {
    render(<ButtonRoot>버튼</ButtonRoot>);

    const button = getRootView();

    fireEvent.touchstart(button);
    expect(button).toHaveClass("ui-active");

    fireEvent.touchend(button);
    expect(button).not.toHaveClass("ui-active");
  });

  it("resets active state when disabled during press", () => {
    const { rerender } = render(<ButtonRoot>버튼</ButtonRoot>);
    const button = getRootView();

    fireEvent.touchstart(button);
    expect(button).toHaveClass("ui-active");

    rerender(<ButtonRoot disabled>버튼</ButtonRoot>);

    expect(getRootView()).toHaveClass("ui-disabled");
    expect(getRootView()).not.toHaveClass("ui-active");
  });

  it("calls onClick when tapped", () => {
    const onClick = vi.fn();
    render(<ButtonRoot onClick={onClick}>버튼</ButtonRoot>);

    fireEvent.tap(getRootView());

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ignores tap when disabled", () => {
    const onClick = vi.fn();
    render(
      <ButtonRoot disabled onClick={onClick}>
        버튼
      </ButtonRoot>,
    );

    fireEvent.tap(getRootView());

    expect(onClick).not.toHaveBeenCalled();
  });

  it("passes state to render-prop children", () => {
    render(
      <ButtonRoot disabled>
        {(state) => <text>{state.disabled ? "disabled" : "enabled"}</text>}
      </ButtonRoot>,
    );

    expect(getRenderedQueries().getByText("disabled")).toBeInTheDocument();
  });

  it("throws when context hook is used outside provider", () => {
    function Consumer() {
      useButtonContext("Consumer");
      return null;
    }

    expect(() => render(<Consumer />)).toThrow("Consumer must be used inside <ButtonRoot/>.");
  });
});
