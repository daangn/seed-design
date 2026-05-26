import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { ProgressCircleRange, ProgressCircleRoot } from "../ProgressCircle";

vi.mock("@lynx-js/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@lynx-js/react")>();

  return {
    ...actual,
    runOnMainThread: () => () => undefined,
  };
});

function getRenderedRoot() {
  const root = elementTree.root;

  if (!root) {
    throw new Error("Expected Lynx render root to exist.");
  }

  return root;
}

function getRenderedElement(selector: string) {
  const root = getRenderedRoot();

  if (root.matches(selector)) return root;

  const element = root.querySelector(selector);
  if (!element) {
    throw new Error(`Expected ${selector} to be rendered.`);
  }

  return element;
}

describe("ProgressCircle", () => {
  it("renders an indeterminate range with root classes and size-owned dimensions", () => {
    render(
      <ProgressCircleRoot
        size="24"
        className="custom-progress"
        style={{ width: "1px", height: "1px", opacity: 0.5 }}
      >
        <ProgressCircleRange />
      </ProgressCircleRoot>,
    );

    const root = getRenderedElement(".seed-progress-circle__root");

    expect(root).toHaveClass("custom-progress");
    expect(root).toHaveStyle({ width: "24px", height: "24px", opacity: "0.5" });
    expect(root.querySelector(".seed-progress-circle__range")).toBeInTheDocument();
    expect(root.querySelectorAll(".seed-progress-circle__cap")).toHaveLength(2);
  });

  it("renders a determinate range without depending on source string assertions", () => {
    render(
      <ProgressCircleRoot size="40" minValue={0} maxValue={1} value={0.5}>
        <ProgressCircleRange />
      </ProgressCircleRoot>,
    );

    const root = getRenderedElement(".seed-progress-circle__root");

    expect(root).toHaveStyle({ width: "40px", height: "40px" });
    expect(root.querySelector(".seed-progress-circle__range")).toBeInTheDocument();
    expect(root.querySelectorAll(".seed-progress-circle__cap")).toHaveLength(2);
  });
});
