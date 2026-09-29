import "@testing-library/jest-dom";
import { fireEvent, render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { FloatingActionButtonLabel, FloatingActionButtonRoot } from "./FloatingActionButton";

vi.mock("@lynx-js/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@lynx-js/react")>();

  return {
    ...actual,
    runOnMainThread: () => () => undefined,
  };
});

function getFloatingActionButtonRoot(container: HTMLElement) {
  const root = container.querySelector<HTMLElement>(".seed-floating-action-button__root");

  if (!root) {
    throw new Error("Expected FloatingActionButton root to exist.");
  }

  return root;
}

describe("FloatingActionButton", () => {
  it("keeps the collapsed label mounted for its fade while the root keeps the accessibility name", () => {
    const { container, rerender } = render(
      <FloatingActionButtonRoot extended accessibility-label="새 글 작성">
        <FloatingActionButtonLabel>Extended</FloatingActionButtonLabel>
      </FloatingActionButtonRoot>,
    );

    rerender(
      <FloatingActionButtonRoot extended={false} accessibility-label="새 글 작성">
        <FloatingActionButtonLabel>Extended</FloatingActionButtonLabel>
      </FloatingActionButtonRoot>,
    );

    const label = container.querySelector(".seed-floating-action-button__label");
    expect(label).toHaveTextContent("Extended");
    expect(label).toHaveClass("seed-floating-action-button__label--extended_false");
    expect(label).toHaveAttribute("accessibility-elements-hidden", "true");
    expect(getFloatingActionButtonRoot(container)).toHaveAttribute(
      "accessibility-label",
      "새 글 작성",
    );
  });

  it("blocks tap and pressed state while disabled and announces the disabled trait", () => {
    const handleTap = vi.fn();
    const { container, rerender } = render(
      <FloatingActionButtonRoot bindtap={handleTap}>
        <FloatingActionButtonLabel>Extended</FloatingActionButtonLabel>
      </FloatingActionButtonRoot>,
    );
    const root = getFloatingActionButtonRoot(container);

    expect(root).toHaveAttribute("accessibility-traits", "button");
    fireEvent.touchstart(root);
    expect(root).toHaveClass("seed-floating-action-button__root--pressed_true");
    fireEvent.touchend(root);
    fireEvent.tap(root);
    expect(handleTap).toHaveBeenCalledTimes(1);

    rerender(
      <FloatingActionButtonRoot disabled bindtap={handleTap}>
        <FloatingActionButtonLabel>Extended</FloatingActionButtonLabel>
      </FloatingActionButtonRoot>,
    );

    expect(root).toHaveAttribute("accessibility-traits", "disabled");
    fireEvent.touchstart(root);
    expect(root).toHaveClass("seed-floating-action-button__root--pressed_false");
    fireEvent.touchend(root);
    fireEvent.tap(root);
    expect(handleTap).toHaveBeenCalledTimes(1);
  });

  it("enables the width transition only after the initially extended label is measured", () => {
    const { container } = render(
      <FloatingActionButtonRoot>
        <FloatingActionButtonLabel>Extended</FloatingActionButtonLabel>
      </FloatingActionButtonRoot>,
    );
    const root = getFloatingActionButtonRoot(container);
    const label = container.querySelector(".seed-floating-action-button__label");

    if (!label) {
      throw new Error("Expected FloatingActionButton label to exist.");
    }

    expect(root).toHaveClass("seed-floating-action-button__root--transitionEnabled_false");
    fireEvent.layoutchange(label, { detail: { width: Number.NaN } });
    expect(root).toHaveClass("seed-floating-action-button__root--transitionEnabled_false");
    fireEvent.layoutchange(label, { detail: { width: 72 } });
    expect(root).toHaveClass("seed-floating-action-button__root--transitionEnabled_true");
  });
});
