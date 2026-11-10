import { afterAll, beforeAll, describe, expect, it, mock } from "bun:test";

import { observeSafeAreaInsets, readSafeAreaInsets } from "./safeArea";

const observers = new Set<FakeResizeObserver>();

class FakeResizeObserver implements ResizeObserver {
  constructor(private readonly callback: ResizeObserverCallback) {
    observers.add(this);
  }

  observe() {}

  unobserve() {}

  disconnect() {
    observers.delete(this);
  }

  report() {
    this.callback([], this);
  }
}

const reportAll = () => {
  for (const observer of observers) observer.report();
};

const originalResizeObserver = window.ResizeObserver;

beforeAll(() => {
  window.ResizeObserver = FakeResizeObserver;
});

afterAll(() => {
  window.ResizeObserver = originalResizeObserver;
});

describe("readSafeAreaInsets", () => {
  it("reads the re-declared insets as px and treats a missing one as 0", () => {
    const element = document.createElement("div");
    element.style.setProperty("--seed-safe-area-top", "82px");
    element.style.setProperty("--seed-safe-area-right", "84.5px");
    document.body.append(element);

    expect(readSafeAreaInsets(element)).toEqual({ top: 82, right: 84.5, bottom: 0, left: 0 });

    element.remove();
  });
});

describe("observeSafeAreaInsets", () => {
  it("notifies on changes but not on the report that follows observe", () => {
    const listener = mock();
    const stop = observeSafeAreaInsets(listener);

    reportAll();
    expect(listener).not.toHaveBeenCalled();

    reportAll();
    expect(listener).toHaveBeenCalledTimes(1);

    stop();
  });

  it("shares one sentinel and removes it when the last subscriber stops", () => {
    const childCount = document.body.childElementCount;

    const stopFirst = observeSafeAreaInsets(() => {});
    const stopSecond = observeSafeAreaInsets(() => {});
    expect(observers.size).toBe(1);
    expect(document.body.childElementCount).toBe(childCount + 1);

    stopFirst();
    expect(observers.size).toBe(1);

    stopSecond();
    expect(observers.size).toBe(0);
    expect(document.body.childElementCount).toBe(childCount);
  });

  it("keeps two subscriptions of the same function independent", () => {
    const listener = mock();
    const stopFirst = observeSafeAreaInsets(listener);
    const stopSecond = observeSafeAreaInsets(listener);
    reportAll();

    reportAll();
    expect(listener).toHaveBeenCalledTimes(2);

    stopFirst();
    reportAll();
    expect(listener).toHaveBeenCalledTimes(3);

    stopSecond();
  });
});
