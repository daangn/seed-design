import { afterAll, afterEach, beforeAll, describe, expect, it, mock } from "bun:test";

import { observeSafeAreaInsets, readSafeAreaInsets } from "./safeArea";

// happy-dom은 layout이 없어서, sentinel 자식의 크기를 여기에 두고 `getBoundingClientRect`와
// 가짜 observer의 보고가 모두 이 값을 읽게 해요.
const sizes = new Map<Element, { width: number; height: number }>();
const sizeOf = (target: Element) => sizes.get(target) ?? { width: 0, height: 0 };

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
    const entries = this.targets.map((target) => {
      const { width, height } = sizeOf(target);

      return {
        target,
        contentRect: new DOMRect(0, 0, width, height),
        borderBoxSize: [],
        contentBoxSize: [],
        devicePixelContentBoxSize: [],
      };
    });
    this.callback(entries, this);
  }
}

const reportAll = () => {
  for (const observer of observers) observer.report();
};

const getSentinels = () => document.body.querySelectorAll(":scope > [aria-hidden='true']");

// 첫 번째 자식의 높이가 top inset이에요.
function setTopInset(height: number) {
  const [start] = getSentinels()[0]?.children ?? [];
  if (!start) throw new Error("no sentinel");

  sizes.set(start, { width: 0, height });
}

const originalResizeObserver = window.ResizeObserver;
const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;

beforeAll(() => {
  window.ResizeObserver = FakeResizeObserver;
  Element.prototype.getBoundingClientRect = function (this: Element) {
    const { width, height } = sizeOf(this);
    return new DOMRect(0, 0, width, height);
  };
});

afterEach(() => {
  sizes.clear();
});

afterAll(() => {
  window.ResizeObserver = originalResizeObserver;
  Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
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
  it("notifies only when a size differs from the last one it saw", () => {
    const listener = mock();
    const stop = observeSafeAreaInsets(listener);

    reportAll();
    expect(listener).not.toHaveBeenCalled();

    setTopInset(82);
    reportAll();
    expect(listener).toHaveBeenCalledTimes(1);

    reportAll();
    expect(listener).toHaveBeenCalledTimes(1);

    setTopInset(0);
    reportAll();
    expect(listener).toHaveBeenCalledTimes(2);

    stop();
  });

  it("notifies when an inset changes before the first report", () => {
    const listener = mock();
    const stop = observeSafeAreaInsets(listener);

    setTopInset(82);
    reportAll();
    expect(listener).toHaveBeenCalledTimes(1);

    stop();
  });

  it("takes a new baseline when it starts observing again", () => {
    observeSafeAreaInsets(() => {})();
    setTopInset(82);

    const listener = mock();
    const stop = observeSafeAreaInsets(listener);
    reportAll();
    expect(listener).not.toHaveBeenCalled();

    stop();
  });

  it("shares one sentinel and keeps it after the last subscriber stops", () => {
    const stopFirst = observeSafeAreaInsets(() => {});
    const stopSecond = observeSafeAreaInsets(() => {});
    expect(observers.size).toBe(1);
    expect(getSentinels()).toHaveLength(1);
    const [sentinel] = getSentinels();

    stopFirst();
    expect(observers.size).toBe(1);

    stopSecond();
    expect(observers.size).toBe(0);
    expect(sentinel?.isConnected).toBe(true);

    const stopThird = observeSafeAreaInsets(() => {});
    expect(getSentinels()).toHaveLength(1);
    expect(getSentinels()[0]).toBe(sentinel);

    stopThird();
  });

  it("re-attaches the sentinel when something removed it", () => {
    observeSafeAreaInsets(() => {})();
    getSentinels()[0]?.remove();

    const stop = observeSafeAreaInsets(() => {});
    expect(getSentinels()).toHaveLength(1);

    stop();
  });

  it("keeps two subscriptions of the same function independent", () => {
    const listener = mock();
    const stopFirst = observeSafeAreaInsets(listener);
    const stopSecond = observeSafeAreaInsets(listener);

    setTopInset(82);
    reportAll();
    expect(listener).toHaveBeenCalledTimes(2);

    stopFirst();
    setTopInset(0);
    reportAll();
    expect(listener).toHaveBeenCalledTimes(3);

    stopSecond();
  });
});
