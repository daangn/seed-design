import { act, render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";

import { usePositionedFloating } from "./index";

// Flush microtasks so Floating UI position state settles.
// See: https://floating-ui.com/docs/react#testing
const waitForPositioning = () => act(async () => {});

const observers = new Set<FakeResizeObserver>();

class FakeResizeObserver implements ResizeObserver {
  readonly targets: Element[] = [];

  constructor(private readonly callback: ResizeObserverCallback) {
    observers.add(this);
  }

  observe(target: Element) {
    this.targets.push(target);
  }

  unobserve() {}

  disconnect() {
    observers.delete(this);
  }

  report() {
    this.callback([], this);
  }
}

// autoUpdate도 ResizeObserver를 쓰므로, safe area sentinel(body 바로 아래 aria-hidden 요소의
// 자식)을 관찰하는 observer에게만 보고해요.
function reportSafeAreaSentinel() {
  for (const observer of observers) {
    const watchesSentinel = observer.targets.some(
      (target) =>
        target.parentElement?.getAttribute("aria-hidden") === "true" &&
        target.parentElement.parentElement === document.body,
    );
    if (watchesSentinel) act(() => observer.report());
  }
}

const getAvailableHeight = (positioner: HTMLElement) =>
  Number.parseFloat(positioner.style.getPropertyValue("--seed-popover-available-height"));

function Floating({ open = true }: { open?: boolean }) {
  const { refs, floatingStyles } = usePositionedFloating({ open });

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
    const originalResizeObserver = window.ResizeObserver;

    beforeAll(() => {
      window.ResizeObserver = FakeResizeObserver;
      // happy-dom은 layout이 없어 viewport가 0×0이라, 가용 높이를 잴 수 있게 크기를 줘요.
      Object.defineProperty(document.documentElement, "clientWidth", {
        configurable: true,
        value: 1024,
      });
      Object.defineProperty(document.documentElement, "clientHeight", {
        configurable: true,
        value: 768,
      });
    });

    afterAll(() => {
      window.ResizeObserver = originalResizeObserver;
      Reflect.deleteProperty(document.documentElement, "clientWidth");
      Reflect.deleteProperty(document.documentElement, "clientHeight");
    });

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

    it("uses the inset at the time it opens, not the one at mount", async () => {
      const { getByTestId, rerender } = render(<Floating open={false} />);
      await waitForPositioning();

      const positioner = getByTestId("positioner");
      positioner.style.setProperty("--seed-safe-area-bottom", "0px");
      rerender(<Floating open />);
      await waitForPositioning();
      const withoutInset = getAvailableHeight(positioner);

      rerender(<Floating open={false} />);
      await waitForPositioning();
      positioner.style.setProperty("--seed-safe-area-bottom", "34px");
      rerender(<Floating open />);
      await waitForPositioning();

      expect(getAvailableHeight(positioner)).toBe(withoutInset - 34);
    });

    it("repositions when an inset changes while open, without a resize", async () => {
      const { getByTestId } = render(<Floating />);
      await waitForPositioning();
      reportSafeAreaSentinel();

      const positioner = getByTestId("positioner");
      positioner.style.setProperty("--seed-safe-area-bottom", "0px");
      reportSafeAreaSentinel();
      await waitForPositioning();
      const withoutInset = getAvailableHeight(positioner);

      positioner.style.setProperty("--seed-safe-area-bottom", "34px");
      reportSafeAreaSentinel();
      await waitForPositioning();

      expect(getAvailableHeight(positioner)).toBe(withoutInset - 34);
    });
  });
});
