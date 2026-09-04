import "@testing-library/jest-dom";
import { render } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { ProgressCircle } from "./index";

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

function getProgressCircleRoot() {
  const progressCircleRoot = getRenderedRoot().firstElementChild;

  if (!progressCircleRoot) {
    throw new Error("Expected ProgressCircle to render a root element.");
  }

  return progressCircleRoot as HTMLElement;
}

describe("ProgressCircle", () => {
  it("provides determinate progress accessibility values without rounding", () => {
    render(<ProgressCircle.Root minValue={-0.25} maxValue={1.75} value={0.3333333333333333} />);

    const root = getProgressCircleRoot();

    expect(root).toHaveAttribute("accessibility-element", "true");
    expect(root).toHaveAttribute("accessibility-role-description", "progressbar");
    expect(root).toHaveAttribute(
      "accessibility-value",
      "minimum -0.25, maximum 1.75, current 0.3333333333333333",
    );
  });

  it("describes indeterminate progress without a numeric value", () => {
    render(<ProgressCircle.Root />);

    expect(getProgressCircleRoot()).toHaveAttribute("accessibility-value", "indeterminate");
  });

  it("prefers explicit accessibility props over defaults", () => {
    render(
      <ProgressCircle.Root
        minValue={0}
        maxValue={100}
        value={40}
        accessibility-element={false}
        accessibility-role-description="custom progress"
        accessibility-value="40 percent complete"
      />,
    );

    const root = getProgressCircleRoot();

    expect(root).toHaveAttribute("accessibility-element", "false");
    expect(root).toHaveAttribute("accessibility-role-description", "custom progress");
    expect(root).toHaveAttribute("accessibility-value", "40 percent complete");
  });

  it("renders a visible indeterminate range before the main-thread animation starts", () => {
    render(
      <ProgressCircle.Root>
        <ProgressCircle.Range />
      </ProgressCircle.Root>,
    );

    const root = getRenderedRoot();
    const range = root.querySelector<HTMLElement>(".seed-progress-circle__range");
    const caps = root.querySelectorAll<HTMLElement>(".seed-progress-circle__cap");
    const animationContainer = range?.parentElement;

    expect(range).toBeInTheDocument();
    expect(animationContainer?.style.transform).not.toBe("rotate(0deg)");
    expect(range?.style.clipPath).toMatch(/^path\("M 20 20 L 20 -1 A 21 21/);
    expect(caps).toHaveLength(2);
    expect(caps[1]?.style.left).not.toBe(caps[0]?.style.left);
    expect(caps[1]?.style.top).not.toBe(caps[0]?.style.top);
  });

  it("keeps the determinate range at the requested initial value", () => {
    render(
      <ProgressCircle.Root minValue={0} maxValue={100} value={40}>
        <ProgressCircle.Range />
      </ProgressCircle.Root>,
    );

    const range = getRenderedRoot().querySelector<HTMLElement>(".seed-progress-circle__range");

    expect(range?.style.clipPath).toMatch(/^path\("M 20 20 L 20 -1 A 21 21/);
  });
});
