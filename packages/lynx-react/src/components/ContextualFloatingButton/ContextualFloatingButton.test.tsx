import "@testing-library/jest-dom";
import { fireEvent, getQueriesForElement, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { ContextualFloatingButton } from "./ContextualFloatingButton";

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getContextualFloatingButtonRoot() {
  const root = getRenderedRoot();

  if (root.classList.contains("seed-contextual-floating-button__root")) return root;

  const button = root.querySelector<HTMLElement>(".seed-contextual-floating-button__root");
  if (!button) {
    throw new Error("Expected ContextualFloatingButton root to exist.");
  }

  return button;
}

describe("ContextualFloatingButton", () => {
  it("preserves its label under the loading indicator while blocking taps", () => {
    const onTap = vi.fn();
    render(
      <ContextualFloatingButton loading bindtap={onTap}>
        저장하기
      </ContextualFloatingButton>,
    );

    const root = getContextualFloatingButtonRoot();

    expect(getQueriesForElement(getRenderedRoot()).getByText("저장하기")).toBeInTheDocument();
    expect(root.querySelector(".seed-progress-circle__root")).toBeInTheDocument();

    fireEvent.tap(root);

    expect(onTap).not.toHaveBeenCalled();
  });

  it("blocks taps and exposes disabled accessibility state when disabled", () => {
    const onTap = vi.fn();
    render(
      <ContextualFloatingButton disabled bindtap={onTap}>
        저장하기
      </ContextualFloatingButton>,
    );

    const root = getContextualFloatingButtonRoot();
    fireEvent.tap(root);

    expect(onTap).not.toHaveBeenCalled();
    expect(root).toHaveAttribute("accessibility-traits", "disabled");
  });
});
