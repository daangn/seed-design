import * as FloatingUI from "@floating-ui/react";
import { render, waitFor } from "@testing-library/react";
import { afterAll, beforeEach, describe, expect, it, mock } from "bun:test";

import { usePositionedFloating } from "./index";

const actualFloatingUI = { ...FloatingUI };

let setups = 0;
let teardowns = 0;

mock.module("@floating-ui/react", () => ({
  ...actualFloatingUI,
  autoUpdate: (...args: Parameters<typeof actualFloatingUI.autoUpdate>) => {
    setups += 1;
    const cleanup = actualFloatingUI.autoUpdate(...args);

    return () => {
      teardowns += 1;
      cleanup();
    };
  },
}));

// Module mocks outlive this file and `mock.restore()` leaves them in place, so hand the
// real exports back to the test files that run after this one.
afterAll(() => {
  mock.module("@floating-ui/react", () => actualFloatingUI);
});

beforeEach(() => {
  setups = 0;
  teardowns = 0;
});

function Harness({ open }: { open: boolean }) {
  const { refs, context, floatingStyles } = usePositionedFloating({ open });
  const { status } = FloatingUI.useTransitionStatus(context);

  return (
    <>
      <button type="button" ref={refs.setReference}>
        reference
      </button>
      <div
        ref={refs.setFloating}
        data-testid="positioner"
        data-status={status}
        style={floatingStyles}
      />
    </>
  );
}

// happy-dom has no layout, so stand in for a page scroll that carries the reference elsewhere.
function scrollReferenceTo(reference: HTMLElement, top: number) {
  reference.getBoundingClientRect = () => new DOMRect(0, top, 40, 20);
  window.dispatchEvent(new Event("scroll"));
}

async function renderOpen() {
  const result = render(<Harness open />);
  const positioner = result.getByTestId("positioner");

  await waitFor(() => expect(positioner).toHaveAttribute("data-status", "open"));
  expect(setups - teardowns).toBe(1);

  return { ...result, reference: result.getByRole("button"), positioner };
}

describe("usePositionedFloating autoUpdate lifecycle", () => {
  it("keeps one autoUpdate subscription across position updates", async () => {
    const { reference, positioner } = await renderOpen();
    const counts = { setups, teardowns };
    const transform = positioner.style.transform;

    scrollReferenceTo(reference, 200);

    await waitFor(() => expect(positioner.style.transform).not.toBe(transform));
    expect({ setups, teardowns }).toEqual(counts);
  });

  it("keeps following the reference while the exit transition runs", async () => {
    const { reference, positioner, rerender } = await renderOpen();

    rerender(<Harness open={false} />);
    expect(positioner).toHaveAttribute("data-status", "close");

    const transform = positioner.style.transform;
    scrollReferenceTo(reference, 200);

    await waitFor(() => expect(positioner.style.transform).not.toBe(transform));
    expect(positioner).toHaveAttribute("data-status", "close");
  });

  it("stops autoUpdate once the exit transition finishes", async () => {
    const { positioner, rerender } = await renderOpen();

    rerender(<Harness open={false} />);

    await waitFor(() => {
      expect(positioner).toHaveAttribute("data-status", "unmounted");
      expect(setups - teardowns).toBe(0);
    });
  });
});
