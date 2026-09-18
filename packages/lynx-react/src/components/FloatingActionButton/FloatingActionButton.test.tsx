import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { FloatingActionButtonLabel, FloatingActionButtonRoot } from "./FloatingActionButton";

function getFloatingActionButtonRoot(container: HTMLElement) {
  const root = container.querySelector<HTMLElement>(".seed-floating-action-button__root");

  if (!root) {
    throw new Error("Expected FloatingActionButton root to exist.");
  }

  return root;
}

describe("FloatingActionButton", () => {
  it("removes and restores the label node while preserving the root accessibility name", () => {
    const { container, rerender } = render(
      <FloatingActionButtonRoot extended accessibility-label="새 글 작성">
        <FloatingActionButtonLabel>Extended</FloatingActionButtonLabel>
      </FloatingActionButtonRoot>,
    );

    expect(container.querySelector(".seed-floating-action-button__label")).toHaveTextContent(
      "Extended",
    );
    expect(getFloatingActionButtonRoot(container)).toHaveAttribute(
      "accessibility-label",
      "새 글 작성",
    );

    rerender(
      <FloatingActionButtonRoot extended={false} accessibility-label="새 글 작성">
        <FloatingActionButtonLabel>Extended</FloatingActionButtonLabel>
      </FloatingActionButtonRoot>,
    );

    expect(container.querySelector(".seed-floating-action-button__label")).not.toBeInTheDocument();
    expect(getFloatingActionButtonRoot(container)).toHaveAttribute(
      "accessibility-label",
      "새 글 작성",
    );

    rerender(
      <FloatingActionButtonRoot extended accessibility-label="새 글 작성">
        <FloatingActionButtonLabel>Extended</FloatingActionButtonLabel>
      </FloatingActionButtonRoot>,
    );

    expect(container.querySelector(".seed-floating-action-button__label")).toHaveTextContent(
      "Extended",
    );
    expect(getFloatingActionButtonRoot(container)).toHaveAttribute(
      "accessibility-label",
      "새 글 작성",
    );
  });
});
