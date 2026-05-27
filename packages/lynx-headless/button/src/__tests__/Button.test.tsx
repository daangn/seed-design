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
  it("passes disabled state without adding automatic state classes", () => {
    render(
      <ButtonRoot disabled>
        {(state) => <text>{state.disabled ? "disabled" : "enabled"}</text>}
      </ButtonRoot>,
    );

    const button = getRootView();

    expect(getRenderedQueries().getByText("disabled")).toBeInTheDocument();
    expect(button).not.toHaveClass("ui-disabled");
    expect(button).not.toHaveClass("ui-active");
  });

  it("tracks active state while pressed without adding automatic state classes", () => {
    render(<ButtonRoot>{(state) => <text>{state.active ? "active" : "idle"}</text>}</ButtonRoot>);

    const button = getRootView();

    expect(getRenderedQueries().getByText("idle")).toBeInTheDocument();

    fireEvent.touchstart(button);
    expect(getRenderedQueries().getByText("active")).toBeInTheDocument();
    expect(button).not.toHaveClass("ui-active");

    fireEvent.touchend(button);
    expect(getRenderedQueries().getByText("idle")).toBeInTheDocument();
    expect(button).not.toHaveClass("ui-active");
  });

  it("resets active state when disabled during press", () => {
    const { rerender } = render(
      <ButtonRoot>{(state) => <text>{state.active ? "active" : "idle"}</text>}</ButtonRoot>,
    );
    const button = getRootView();

    fireEvent.touchstart(button);
    expect(getRenderedQueries().getByText("active")).toBeInTheDocument();

    rerender(
      <ButtonRoot disabled>
        {(state) => <text>{state.active ? "active" : "idle"}</text>}
      </ButtonRoot>,
    );

    expect(getRenderedQueries().getByText("idle")).toBeInTheDocument();
    expect(getRootView()).not.toHaveClass("ui-disabled");
    expect(getRootView()).not.toHaveClass("ui-active");
  });

  it("calls onClick when tapped", () => {
    const onClick = vi.fn();
    render(<ButtonRoot onClick={onClick}>버튼</ButtonRoot>);

    fireEvent.tap(getRootView());

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("composes direct native tap handler with onClick", () => {
    const bindtap = vi.fn();
    const onClick = vi.fn();
    render(
      <ButtonRoot bindtap={bindtap} onClick={onClick}>
        버튼
      </ButtonRoot>,
    );

    fireEvent.tap(getRootView());

    expect(bindtap).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ignores legacy buttonProps bucket when native props are passed directly", () => {
    const bindtap = vi.fn();
    const legacyBindtap = vi.fn();
    const onClick = vi.fn();

    render(
      <ButtonRoot
        {...({
          buttonProps: {
            bindtap: legacyBindtap,
            className: "legacy-button",
          },
        } as never)}
        bindtap={bindtap}
        className="direct-button"
        onClick={onClick}
      >
        버튼
      </ButtonRoot>,
    );

    const button = getRootView();

    fireEvent.tap(button);

    expect(button).toHaveClass("direct-button");
    expect(button).not.toHaveClass("legacy-button");
    expect(bindtap).toHaveBeenCalledTimes(1);
    expect(legacyBindtap).not.toHaveBeenCalled();
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

  it("marks the root as a Lynx accessibility button", () => {
    render(
      <ButtonRoot accessibility-label="저장" accessibility-value="준비됨">
        버튼
      </ButtonRoot>,
    );

    const button = getRootView();

    expect(button).toHaveAttribute("accessibility-element", "true");
    expect(button).toHaveAttribute("accessibility-traits", "button");
    expect(button).toHaveAttribute("accessibility-label", "저장");
    expect(button).toHaveAttribute("accessibility-value", "준비됨");
    expect(button).toHaveAttribute("event-through", "false");
  });

  it("throws when context hook is used outside provider", () => {
    function Consumer() {
      useButtonContext("Consumer");
      return null;
    }

    expect(() => render(<Consumer />)).toThrow("Consumer must be used inside <ButtonRoot/>.");
  });
});
