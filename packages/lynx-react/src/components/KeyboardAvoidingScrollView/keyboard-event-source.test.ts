import type { GlobalEventEmitter } from "@lynx-js/types";
import { describe, expect, it, vi } from "vitest";

import { createKeyboardEventSource } from "./keyboard-event-source";

function createEmitter() {
  let listener: ((...args: unknown[]) => void) | null = null;
  const emitter = {
    addListener: vi.fn((_eventName: string, nextListener: (...args: unknown[]) => void) => {
      listener = nextListener;
    }),
    removeListener: vi.fn(),
  } as unknown as GlobalEventEmitter;

  return {
    emitter,
    emit(...args: unknown[]) {
      listener?.(...args);
    },
  };
}

describe("createKeyboardEventSource", () => {
  it("shares one native subscription across subscribers", () => {
    const { emitter, emit } = createEmitter();
    const source = createKeyboardEventSource(() => emitter);
    const first = vi.fn();
    const second = vi.fn();

    const unsubscribeFirst = source.subscribe(first);
    const unsubscribeSecond = source.subscribe(second);

    expect(emitter.addListener).toHaveBeenCalledTimes(1);
    expect(first).toHaveBeenLastCalledWith({ visible: false, height: 0 });
    expect(second).toHaveBeenLastCalledWith({ visible: false, height: 0 });

    emit("on", 320);

    expect(first).toHaveBeenLastCalledWith({ visible: true, height: 320 });
    expect(second).toHaveBeenLastCalledWith({ visible: true, height: 320 });

    unsubscribeFirst();
    expect(emitter.removeListener).not.toHaveBeenCalled();

    unsubscribeSecond();
    expect(emitter.removeListener).not.toHaveBeenCalled();
  });

  it("replays the latest state to a late subscriber", () => {
    const { emitter, emit } = createEmitter();
    const source = createKeyboardEventSource(() => emitter);
    const first = vi.fn();
    const second = vi.fn();

    source.subscribe(first);
    emit("on", 280);
    source.subscribe(second);

    expect(second).toHaveBeenCalledWith({ visible: true, height: 280 });
  });

  it("tracks duplicate listener subscriptions independently", () => {
    const { emitter, emit } = createEmitter();
    const source = createKeyboardEventSource(() => emitter);
    const listener = vi.fn();

    const unsubscribeFirst = source.subscribe(listener);
    const unsubscribeSecond = source.subscribe(listener);
    listener.mockClear();

    unsubscribeFirst();
    emit("on", 280);

    expect(listener).toHaveBeenCalledTimes(1);
    expect(emitter.removeListener).not.toHaveBeenCalled();

    unsubscribeSecond();
    expect(emitter.removeListener).not.toHaveBeenCalled();
  });

  it("keeps tracking keyboard state while there are no component subscribers", () => {
    const { emitter, emit } = createEmitter();
    const source = createKeyboardEventSource(() => emitter);
    const first = vi.fn();
    const second = vi.fn();

    const unsubscribe = source.subscribe(first);
    unsubscribe();
    emit("on", 280);
    source.subscribe(second);

    expect(emitter.addListener).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledWith({ visible: true, height: 280 });
  });

  it("fails softly when the native emitter is unavailable", () => {
    const source = createKeyboardEventSource(() => {
      throw new Error("unsupported");
    });
    const listener = vi.fn();

    const unsubscribe = source.subscribe(listener);

    expect(listener).toHaveBeenCalledWith({ visible: false, height: 0 });
    expect(unsubscribe).not.toThrow();
  });

  it("normalizes invalid or off payloads", () => {
    const { emitter, emit } = createEmitter();
    const source = createKeyboardEventSource(() => emitter);
    const listener = vi.fn();

    source.subscribe(listener);
    emit("on", -10);
    emit("off", 320);
    emit("unexpected", 320);

    expect(listener).toHaveBeenNthCalledWith(2, { visible: true, height: 0 });
    expect(listener).toHaveBeenNthCalledWith(3, { visible: false, height: 0 });
    expect(listener).toHaveBeenNthCalledWith(4, { visible: false, height: 0 });
  });
});
