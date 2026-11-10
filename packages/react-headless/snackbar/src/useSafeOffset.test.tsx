import { act, render } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { useEffect, useRef } from "react";

import { useSafeOffset } from "./useSafeOffset";

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

// region 높이도 ResizeObserver로 재므로, safe area sentinel(body 바로 아래 aria-hidden 요소의
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

// bottom: 0에 고정된 높이 120의 요소처럼, env()를 따라 움직이지 않는 영역을 흉내 내요.
const AVOIDED_HEIGHT = 120;

function Probe() {
  const { safeOffset, overlapTracker, regionRef } = useSafeOffset();
  const avoidedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const avoided = avoidedRef.current;
    if (!avoided) return;

    avoided.getBoundingClientRect = () =>
      new DOMRect(0, window.innerHeight - AVOIDED_HEIGHT, window.innerWidth, AVOIDED_HEIGHT);
    overlapTracker.upsert("avoided", avoided);
  }, [overlapTracker]);

  return (
    <>
      {/* region의 env() 선언 대신 테스트가 --seed-safe-area-bottom을 직접 정해요. */}
      <div
        ref={(node) => {
          regionRef.current = node;
        }}
        data-testid="region"
        data-offset={safeOffset}
      />
      <div ref={avoidedRef} />
    </>
  );
}

describe("useSafeOffset", () => {
  const originalResizeObserver = window.ResizeObserver;

  beforeAll(() => {
    window.ResizeObserver = FakeResizeObserver;
  });

  afterAll(() => {
    window.ResizeObserver = originalResizeObserver;
  });

  it("recomputes the offset when the bottom inset changes without a resize", () => {
    const { getByTestId } = render(<Probe />);
    const region = getByTestId("region");
    reportSafeAreaSentinel();

    region.style.setProperty("--seed-safe-area-bottom", "34px");
    reportSafeAreaSentinel();
    expect(region.getAttribute("data-offset")).toBe(String(AVOIDED_HEIGHT - 34));

    region.style.setProperty("--seed-safe-area-bottom", "58px");
    reportSafeAreaSentinel();
    expect(region.getAttribute("data-offset")).toBe(String(AVOIDED_HEIGHT - 58));
  });
});
