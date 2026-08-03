import { describe, expect, it, vi } from "vitest";

import {
  createKeyboardAvoidingEngine,
  type KeyboardAvoidanceRegistration,
  type KeyboardAvoidingNativeDriver,
  type KeyboardAvoidingScheduler,
} from "./engine";
import type { VerticalRect } from "./geometry";
import type { ScrollMetrics } from "./native-driver";

type TestNode = "anchor" | "control" | "field" | "native" | "scroll" | "spacer";
type ScheduledCallback = Parameters<KeyboardAvoidingScheduler["scheduleFrame"]>[0];

interface ScheduledTask {
  callback: ScheduledCallback;
  cancelled: boolean;
}

function createManualScheduler() {
  const frames: ScheduledTask[] = [];
  const timers: ScheduledTask[] = [];

  const schedule = (queue: ScheduledTask[], callback: ScheduledCallback) => {
    const task = { callback, cancelled: false };
    queue.push(task);
    return () => {
      task.cancelled = true;
    };
  };

  const scheduler = {
    scheduleFrame: vi.fn((callback: ScheduledCallback) => schedule(frames, callback)),
    scheduleTimer: vi.fn((callback: ScheduledCallback) => schedule(timers, callback)),
  } satisfies KeyboardAvoidingScheduler;

  const takeNext = (queue: ScheduledTask[]): ScheduledTask | null => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (task && !task.cancelled) return task;
    }
    return null;
  };

  return {
    scheduler,
    async flushFrame() {
      await takeNext(frames)?.callback();
    },
    startFrame() {
      const task = takeNext(frames);
      return Promise.resolve(task?.callback());
    },
    async flushTimer() {
      await takeNext(timers)?.callback();
    },
  };
}

function deferred<T>() {
  let resolvePromise: (value: T) => void = () => {};
  const promise = new Promise<T>((resolve) => {
    resolvePromise = resolve;
  });

  return { promise, resolve: resolvePromise };
}

function nodeRef(current: TestNode) {
  return { current };
}

function createRegistration(
  owner: object = {},
  options: Partial<KeyboardAvoidanceRegistration<TestNode>> = {},
): KeyboardAvoidanceRegistration<TestNode> {
  return {
    owner,
    fieldRef: nodeRef("field"),
    controlRef: nodeRef("control"),
    nativeRef: nodeRef("native"),
    anchorRef: nodeRef("anchor"),
    ...options,
  };
}

function createHarness() {
  const rects: Record<TestNode, VerticalRect | null> = {
    scroll: { top: 0, bottom: 800 },
    spacer: null,
    field: { top: 400, bottom: 520 },
    control: { top: 420, bottom: 480 },
    native: { top: 430, bottom: 470 },
    anchor: { top: 440, bottom: 460 },
  };
  let metrics: ScrollMetrics = { offsetY: 100, maxOffsetY: 1_000 };
  const manualScheduler = createManualScheduler();
  const driver = {
    measure: vi.fn(async (node: TestNode) => rects[node]),
    resolveKeyboardOcclusion: vi.fn(async (state) =>
      state.visible ? { visible: true, topInScreenPx: 500 } : null,
    ),
    setSpacerHeight: vi.fn(),
    waitForLayout: vi.fn(async () => {}),
    getScrollMetrics: vi.fn(async (): Promise<ScrollMetrics | null> => metrics),
    scrollTo: vi.fn(),
  } satisfies KeyboardAvoidingNativeDriver<TestNode>;
  const engine = createKeyboardAvoidingEngine<TestNode>({
    driver,
    scheduler: manualScheduler.scheduler,
    getScrollNode: () => "scroll",
    getSpacerNode: () => "spacer",
    getKeyboardGap: () => 24,
    getToolbarHeight: () => 0,
    getSmooth: () => true,
  });

  return {
    driver,
    engine,
    rects,
    scheduler: manualScheduler,
    setMetrics(next: ScrollMetrics) {
      metrics = next;
    },
  };
}

async function openKeyboard(
  harness: ReturnType<typeof createHarness>,
  registration = createRegistration(),
) {
  harness.engine.focus(registration);
  harness.engine.keyboardChanged({ visible: true, height: 300 });
  await harness.scheduler.flushFrame();
  return registration;
}

describe("createKeyboardAvoidingEngine", () => {
  it("coalesces invalidations into one frame and applies one native transaction", async () => {
    const harness = createHarness();
    const registration = createRegistration();

    harness.engine.focus(registration);
    harness.engine.keyboardChanged({ visible: true, height: 300 });
    harness.engine.layoutChanged(registration.owner);
    harness.engine.viewportChanged();

    expect(harness.scheduler.scheduler.scheduleFrame).toHaveBeenCalledTimes(1);

    await harness.scheduler.flushFrame();

    expect(harness.driver.setSpacerHeight).toHaveBeenCalledOnce();
    expect(harness.driver.setSpacerHeight).toHaveBeenCalledWith("spacer", 324);
    expect(harness.driver.scrollTo).toHaveBeenCalledWith("scroll", 144, true);
  });

  it("does not cross the bridge while closed with no applied spacer", async () => {
    const harness = createHarness();

    harness.engine.focus(createRegistration());
    await harness.scheduler.flushFrame();

    expect(harness.driver.measure).not.toHaveBeenCalled();
    expect(harness.driver.getScrollMetrics).not.toHaveBeenCalled();
    expect(harness.driver.setSpacerHeight).not.toHaveBeenCalled();
  });

  it("updates the spacer but skips scrollTo when the target is already visible", async () => {
    const harness = createHarness();
    harness.rects.field = { top: 240, bottom: 360 };

    await openKeyboard(harness);

    expect(harness.driver.setSpacerHeight).toHaveBeenCalledWith("spacer", 324);
    expect(harness.driver.scrollTo).not.toHaveBeenCalled();
  });

  it("retries a synchronous spacer mutation failure on the next invalidation", async () => {
    const harness = createHarness();
    harness.driver.setSpacerHeight.mockImplementationOnce(() => {
      throw new Error("detached");
    });

    await openKeyboard(harness);
    expect(harness.driver.setSpacerHeight).toHaveBeenCalledTimes(1);

    harness.engine.viewportChanged();
    await harness.scheduler.flushFrame();

    expect(harness.driver.setSpacerHeight).toHaveBeenCalledTimes(2);
    expect(harness.driver.setSpacerHeight).toHaveBeenLastCalledWith("spacer", 324);
  });

  it("discards an in-flight measurement after focus changes", async () => {
    const harness = createHarness();
    const pendingViewport = deferred<VerticalRect | null>();
    harness.driver.measure.mockImplementationOnce(() => pendingViewport.promise);
    harness.engine.focus(createRegistration({ name: "first" }));
    harness.engine.keyboardChanged({ visible: true, height: 300 });

    const staleTransaction = harness.scheduler.startFrame();
    harness.engine.focus(createRegistration({ name: "second" }));
    pendingViewport.resolve({ top: 0, bottom: 800 });
    await staleTransaction;

    expect(harness.driver.setSpacerHeight).not.toHaveBeenCalled();

    await harness.scheduler.flushFrame();
    expect(harness.driver.setSpacerHeight).toHaveBeenCalledWith("spacer", 324);
  });

  it("pauses pending work during a user scroll and reevaluates after scrollend", async () => {
    const harness = createHarness();
    harness.engine.focus(createRegistration());
    harness.engine.keyboardChanged({ visible: true, height: 300 });

    harness.engine.userScrollStarted();
    await harness.scheduler.flushFrame();

    expect(harness.driver.measure).not.toHaveBeenCalled();

    harness.engine.userScrollEnded();
    await harness.scheduler.flushFrame();

    expect(harness.driver.measure).toHaveBeenCalled();
    expect(harness.driver.scrollTo).toHaveBeenCalledOnce();
  });

  it("removes the spacer and clamps an out-of-range offset when the keyboard closes", async () => {
    const harness = createHarness();
    await openKeyboard(harness);
    harness.driver.setSpacerHeight.mockClear();
    harness.driver.scrollTo.mockClear();
    harness.setMetrics({ offsetY: 500, maxOffsetY: 200 });

    harness.engine.keyboardChanged({ visible: false, height: 0 });
    await harness.scheduler.flushFrame();

    expect(harness.driver.setSpacerHeight).toHaveBeenCalledWith("spacer", 0);
    expect(harness.driver.scrollTo).toHaveBeenCalledWith("scroll", 200, true);
  });

  it("retries close clamping when native metrics are temporarily unavailable", async () => {
    const harness = createHarness();
    await openKeyboard(harness);
    harness.driver.getScrollMetrics.mockClear();
    harness.driver.getScrollMetrics.mockResolvedValueOnce(null);
    harness.setMetrics({ offsetY: 500, maxOffsetY: 200 });

    harness.engine.keyboardChanged({ visible: false, height: 0 });
    await harness.scheduler.flushFrame();

    expect(harness.driver.scrollTo).not.toHaveBeenCalledWith("scroll", 200, true);

    harness.engine.viewportChanged();
    await harness.scheduler.flushFrame();

    expect(harness.driver.getScrollMetrics).toHaveBeenCalledTimes(2);
    expect(harness.driver.scrollTo).toHaveBeenLastCalledWith("scroll", 200, true);
  });

  it("clears the previous target when a disabled target receives focus", async () => {
    const harness = createHarness();
    await openKeyboard(harness, createRegistration({ name: "enabled" }));
    harness.driver.setSpacerHeight.mockClear();

    harness.engine.focus(
      createRegistration(
        { name: "disabled" },
        {
          enabled: false,
        },
      ),
    );
    await harness.scheduler.flushFrame();

    expect(harness.driver.setSpacerHeight).toHaveBeenCalledWith("spacer", 0);
  });

  it("keeps the spacer during a blur-to-focus handoff", async () => {
    const harness = createHarness();
    const first = await openKeyboard(harness, createRegistration({ name: "first" }));
    harness.driver.setSpacerHeight.mockClear();

    harness.engine.blur(first.owner);
    harness.engine.focus(createRegistration({ name: "second" }));
    await harness.scheduler.flushTimer();
    await harness.scheduler.flushFrame();

    expect(harness.driver.setSpacerHeight).not.toHaveBeenCalledWith("spacer", 0);
  });

  it("keeps a Field downgrade stable for the current keyboard session", async () => {
    const harness = createHarness();
    const registration = createRegistration();
    harness.rects.field = { top: 0, bottom: 600 };
    harness.rects.control = { top: 420, bottom: 500 };
    await openKeyboard(harness, registration);
    harness.driver.measure.mockClear();
    harness.driver.scrollTo.mockClear();

    harness.rects.field = { top: 400, bottom: 500 };
    harness.rects.control = { top: 430, bottom: 510 };
    harness.engine.layoutChanged(registration.owner);
    await harness.scheduler.flushFrame();

    expect(harness.driver.measure).not.toHaveBeenCalledWith("field");
    expect(harness.driver.scrollTo).toHaveBeenCalledWith("scroll", 134, true);
  });

  it("remeasures Field after every candidate was temporarily oversized", async () => {
    const harness = createHarness();
    const registration = createRegistration();
    harness.rects.field = { top: 0, bottom: 600 };
    harness.rects.control = { top: 0, bottom: 600 };
    harness.rects.native = { top: 0, bottom: 600 };
    harness.rects.anchor = { top: 0, bottom: 600 };
    await openKeyboard(harness, registration);
    harness.driver.measure.mockClear();

    harness.rects.field = { top: 400, bottom: 500 };
    harness.engine.layoutChanged(registration.owner);
    await harness.scheduler.flushFrame();

    expect(harness.driver.measure).toHaveBeenCalledWith("field");
  });

  it("does not follow a layout-only target height decrease", async () => {
    const harness = createHarness();
    const registration = await openKeyboard(harness);
    harness.driver.scrollTo.mockClear();
    harness.driver.getScrollMetrics.mockClear();

    harness.rects.field = { top: 450, bottom: 500 };
    harness.engine.layoutChanged(registration.owner);
    await harness.scheduler.flushFrame();

    expect(harness.driver.getScrollMetrics).not.toHaveBeenCalled();
    expect(harness.driver.scrollTo).not.toHaveBeenCalled();
  });
});
