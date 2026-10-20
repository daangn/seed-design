import { runOnMainThread, useEffect, type MainThreadRef } from "@lynx-js/react";
import { render, waitSchedule } from "@lynx-js/react/testing-library";
import { useMotionValueRef, type MotionValue } from "@lynx-js/motion/mini";
import { PresenceState } from "@lynx-js/lynx-ui-presence";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSnap, type SnapOptions } from "./useSnap";

type TestMotion = {
  create: (value: number) => MotionValue<number>;
  animate: (value: MotionValue<number>, target: number) => { then: (callback: () => void) => void };
};
type TestGlobals = typeof globalThis & { __sheetTestMotion: TestMotion };

vi.mock("@lynx-js/motion/mini", async () => {
  const React = await vi.importActual<typeof import("@lynx-js/react")>("@lynx-js/react");
  function animate(value: MotionValue<number>, target: number) {
    "main thread";
    return (globalThis as TestGlobals).__sheetTestMotion.animate(value, target);
  }
  return {
    animate,
    useMotionValueRef(value: number) {
      const ref = React.useMainThreadRef<MotionValue<number>>();
      React.useEffect(() => {
        React.runOnMainThread(() => {
          "main thread";
          ref.current = (globalThis as TestGlobals).__sheetTestMotion.create(value);
        })();
      }, []);
      return ref;
    },
    useMotionValueRefEvent(
      ref: MainThreadRef<MotionValue<number>>,
      event: "change",
      callback: (value: number) => void,
    ) {
      React.useEffect(() => {
        React.runOnMainThread(() => {
          "main thread";
          ref.current.on(event, callback);
        })();
      }, []);
    },
  };
});

type Snap = ReturnType<typeof useSnap>;

// mini animate.stop()은 완료 callback도 동기 호출한다. 취소 중 presence 전이까지 재현한다.
const pending = new Map<MotionValue<number>, () => void>();
const motion: TestMotion = {
  create(initial) {
    let value = initial;
    let velocity = 0;
    const listeners = new Set<(value: number) => void>();
    const instance: MotionValue<number> = {
      get: () => value,
      getVelocity: () => velocity,
      updateVelocity(next) {
        velocity = next;
      },
      isAnimating: () => pending.has(instance),
      clearListeners: () => listeners.clear(),
      destroy() {
        instance.stop();
        listeners.clear();
      },
      onChange(listener) {
        return instance.on("change", listener);
      },
      set(next: number) {
        value = next;
        for (const listener of listeners) listener(value);
      },
      jump(next: number) {
        instance.stop();
        instance.set(next);
      },
      stop() {
        const complete = pending.get(instance);
        pending.delete(instance);
        complete?.();
      },
      on(_event: string, listener: (value: number) => void) {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
    };
    return instance;
  },
  animate(value) {
    value.stop();
    return {
      then: (callback) => {
        pending.set(value, callback);
      },
    };
  },
};

beforeEach(() => {
  pending.clear();
  Object.assign(lynxTestingEnv.mainThread.globalThis, { __sheetTestMotion: motion });
});
afterEach(() => {
  pending.clear();
  delete (lynxTestingEnv.mainThread.globalThis as Partial<TestGlobals>).__sheetTestMotion;
});

async function setup(options: Partial<SnapOptions> = {}) {
  let api: Snap | undefined;
  let progressRef: MainThreadRef<MotionValue<number>> | undefined;
  function Harness() {
    const progress = useMotionValueRef(0);
    const snap = useSnap({
      snapPoints: ["fit"],
      screenHeight: 800,
      sheetProgress: progress,
      ...options,
    });
    useEffect(() => {
      api = snap;
      progressRef = progress;
    }, []);
    return <view main-thread:ref={snap.setSheetMTRef} />;
  }
  render(<Harness />, { enableMainThread: true, enableBackgroundThread: true });
  await waitSchedule();
  if (!api || !progressRef) throw new Error("Expected the sheet hook to mount");
  const snap = api;
  const progress = progressRef;
  const yRef = snap.yRef;
  const presence = snap.presenceStateMTRef;
  async function state() {
    return (await runOnMainThread(() => {
      "main thread";
      return {
        position: yRef.current.get(),
        progress: progress.current.get(),
        presence: presence.current,
      };
    })()) as { position: number; progress: number; presence: PresenceState };
  }
  async function frame(position: number) {
    await runOnMainThread((value: number) => {
      "main thread";
      yRef.current.set(value);
    })(position);
  }
  return {
    snap,
    state,
    frame,
    layout: (height: number) =>
      runOnMainThread(snap.handleSheetLayoutChangeMT)({ detail: { height } }),
    show: (animate = true) => runOnMainThread(snap.showMT)({ animate }),
    close: (animate = true) => runOnMainThread(snap.closeMT)({ animate }),
    drag: () => runOnMainThread(snap.onDragStartMT)(),
    snapTo: (index: number, animate = true) => runOnMainThread(snap.snapToMT)(index, { animate }),
  };
}

describe("sheet progress across layout changes", () => {
  it("keeps an animate:false initial fit request when layout resolves", async () => {
    const sheet = await setup();
    await sheet.show(false);
    await sheet.layout(300);
    expect(await sheet.state()).toEqual({
      position: 300,
      progress: 1,
      presence: PresenceState.Entered,
    });
  });

  it("keeps entering progress moving forward when the fit height grows", async () => {
    const sheet = await setup();
    await sheet.layout(300);
    await sheet.show();
    await sheet.frame(150);
    expect((await sheet.state()).progress).toBeCloseTo(0.5);
    await sheet.layout(500);
    expect((await sheet.state()).position).toBe(150);
    await sheet.frame(180);
    expect((await sheet.state()).progress).toBeCloseTo(0.6);
  });

  it("preserves partial-snap opacity when only the maximum height changes", async () => {
    const sheet = await setup({ snapPoints: [300, "fit"] });
    await sheet.layout(600);
    await sheet.show(false);
    expect((await sheet.state()).progress).toBeCloseTo(0.5);
    await sheet.layout(900);
    expect(await sheet.state()).toMatchObject({ position: 300, progress: 0.5 });
    await sheet.close();
    await sheet.frame(270);
    expect((await sheet.state()).progress).toBeCloseTo(0.45);
  });

  it("starts fading immediately when close interrupts a growing fitted sheet", async () => {
    const sheet = await setup();
    await sheet.layout(300);
    await sheet.show(false);
    await sheet.layout(500);
    await sheet.snapTo(0);
    await sheet.frame(400);
    expect((await sheet.state()).progress).toBe(1);
    await sheet.close();
    expect((await sheet.state()).presence).toBe(PresenceState.Leaving);
    await sheet.frame(360);
    expect((await sheet.state()).progress).toBeCloseTo(0.9);
    await sheet.layout(700);
    await sheet.frame(320);
    expect((await sheet.state()).progress).toBeCloseTo(0.8);
  });

  it("anchors drag opacity to the interruption point and ignores later layout changes", async () => {
    const sheet = await setup();
    await sheet.layout(300);
    await sheet.show(false);
    await sheet.layout(500);
    await sheet.snapTo(0);
    await sheet.frame(400);
    await sheet.drag();
    expect((await sheet.state()).progress).toBe(1);
    await sheet.frame(360);
    expect((await sheet.state()).progress).toBeCloseTo(0.9);
    await sheet.layout(600);
    await sheet.frame(320);
    expect((await sheet.state()).progress).toBeCloseTo(0.8);
  });

  it("drops an unresolved fit request on close and creates a fresh mapping on reopen", async () => {
    const sheet = await setup();
    await sheet.show(false);
    await sheet.close(false);
    await sheet.layout(300);
    expect(await sheet.state()).toEqual({ position: 0, progress: 0, presence: PresenceState.Left });
    await sheet.show(false);
    expect(await sheet.state()).toEqual({
      position: 300,
      progress: 1,
      presence: PresenceState.Entered,
    });
  });

  it("does not complete a canceled enter or close when a drag resurrects the sheet", async () => {
    const onEntered = vi.fn();
    const onDismiss = vi.fn();
    const onResurrected = vi.fn();
    const sheet = await setup({ onEntered, onDismiss, onResurrected });
    await sheet.layout(300);
    await sheet.show();
    await sheet.frame(150);
    await sheet.close();
    await sheet.frame(120);
    expect((await sheet.state()).progress).toBeCloseTo(0.4);
    await sheet.drag();
    await waitSchedule();
    expect((await sheet.state()).presence).toBe(PresenceState.Entering);
    expect(onEntered).not.toHaveBeenCalled();
    expect(onDismiss).not.toHaveBeenCalled();
    expect(onResurrected).toHaveBeenCalledOnce();
    await sheet.frame(90);
    expect((await sheet.state()).progress).toBeCloseTo(0.3);
  });

  it("preserves opacity through shrink and uses the new geometry for a later explicit snap", async () => {
    const sheet = await setup({ snapPoints: [150, "fit"], initialSnap: 1 });
    await sheet.layout(500);
    await sheet.show(false);
    await sheet.layout(300);
    expect(await sheet.state()).toMatchObject({ position: 500, progress: 1 });
    await sheet.snapTo(1);
    await sheet.frame(400);
    expect((await sheet.state()).progress).toBe(1);
    await sheet.snapTo(0, false);
    expect(await sheet.state()).toMatchObject({ position: 150, progress: 0.5 });
  });

  it("updates a zero-distance explicit snap to the current geometry policy", async () => {
    const sheet = await setup({ snapPoints: [300, "fit"] });
    await sheet.layout(600);
    await sheet.show(false);
    await sheet.layout(900);
    expect((await sheet.state()).progress).toBeCloseTo(0.5);
    await sheet.snapTo(0);
    expect((await sheet.state()).position).toBe(300);
    expect((await sheet.state()).progress).toBeCloseTo(1 / 3);
  });

  it("clamps spring overshoot opacity to zero and one", async () => {
    const sheet = await setup();
    await sheet.layout(300);
    await sheet.show();
    await sheet.frame(330);
    expect((await sheet.state()).progress).toBe(1);
    await sheet.frame(-30);
    expect((await sheet.state()).progress).toBe(0);
    await sheet.frame(150);
    await sheet.close();
    await sheet.frame(-30);
    expect((await sheet.state()).progress).toBe(0);
  });

  it("preserves position divided by maximum height through ordinary snaps and drags", async () => {
    const sheet = await setup({ snapPoints: [300, 600] });
    await sheet.layout(600);
    await sheet.show(false);
    expect((await sheet.state()).progress).toBeCloseTo(0.5);
    await sheet.snapTo(1);
    await sheet.frame(450);
    expect((await sheet.state()).progress).toBeCloseTo(0.75);
    await sheet.drag();
    await sheet.frame(420);
    expect((await sheet.state()).progress).toBeCloseTo(0.7);
    await sheet.close();
    await sheet.frame(300);
    expect((await sheet.state()).progress).toBeCloseTo(0.5);
  });
});
