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

describe("ProgressCircle", () => {
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
