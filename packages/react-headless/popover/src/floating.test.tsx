import { act, render } from "@testing-library/react";
import { describe, expect, it } from "bun:test";

import { usePositionedFloating } from "./floating";

// Flush microtasks so Floating UI position state settles.
// See: https://floating-ui.com/docs/react#testing
const waitForPositioning = () => act(async () => {});

function Floating() {
  const { refs, floatingStyles } = usePositionedFloating({ open: true });

  return (
    <>
      <button type="button" ref={refs.setReference}>
        Reference
      </button>
      <div ref={refs.setFloating} data-testid="positioner" style={floatingStyles} />
    </>
  );
}

describe("usePositionedFloating", () => {
  describe("safe area", () => {
    // Collision padding is read back from these declarations as px, so a positioner that
    // loses them positions against the bare viewport edge again.
    it("re-declares every safe-area inset on the positioner", async () => {
      const { getByTestId } = render(<Floating />);
      await waitForPositioning();

      const { style } = getByTestId("positioner");
      for (const side of ["top", "right", "bottom", "left"]) {
        expect(style.getPropertyValue(`--seed-safe-area-${side}`)).toBe(
          `env(safe-area-inset-${side})`,
        );
      }
    });
  });
});
