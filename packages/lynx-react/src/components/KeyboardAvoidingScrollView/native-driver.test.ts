import type { NodesRef } from "@lynx-js/types";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  lynxKeyboardAvoidingNativeDriver,
  normalizeScrollMetrics,
  resolveKeyboardOcclusionTop,
} from "./native-driver";

interface TestGlobal {
  SystemInfo?: {
    pixelHeight?: number;
    pixelRatio?: number;
    platform?: string;
  };
}

const originalSystemInfo = (globalThis as TestGlobal).SystemInfo;

afterEach(() => {
  const global = globalThis as TestGlobal;
  if (originalSystemInfo === undefined) {
    delete global.SystemInfo;
  } else {
    global.SystemInfo = originalSystemInfo;
  }
});

function createNode(onInvoke?: (options: Parameters<NodesRef["invoke"]>[0]) => void) {
  const exec = vi.fn();
  const query = { exec } as unknown as ReturnType<NodesRef["invoke"]>;
  const invoke = vi.fn((options: Parameters<NodesRef["invoke"]>[0]) => {
    onInvoke?.(options);
    return query;
  });
  const setNativeProps = vi.fn(() => query);
  const node = { invoke, setNativeProps } as unknown as NodesRef;

  return { exec, invoke, node, setNativeProps };
}

describe("normalizeScrollMetrics", () => {
  it("normalizes the Android default-path response", () => {
    expect(
      normalizeScrollMetrics(
        {
          scrollY: 120,
          scrollRange: 560,
        },
        "Android",
        400,
      ),
    ).toEqual({ offsetY: 120, maxOffsetY: 560 });
  });

  it("prefers the iOS maxScrollOffset over the legacy content-size range", () => {
    expect(
      normalizeScrollMetrics(
        {
          scrollY: 120,
          scrollRange: 960,
          maxScrollOffset: 560,
        },
        "iOS",
        400,
      ),
    ).toEqual({ offsetY: 120, maxOffsetY: 560 });
  });

  it("derives an iOS max offset from a legacy content-size range", () => {
    expect(
      normalizeScrollMetrics(
        {
          scrollY: 120,
          scrollRange: 960,
        },
        "iOS",
        400,
      ),
    ).toEqual({ offsetY: 120, maxOffsetY: 560 });
  });

  it("normalizes the Android new-architecture response", () => {
    expect(
      normalizeScrollMetrics(
        {
          scrollTop: 120,
          scrollHeight: 560,
        },
        "Android",
        400,
      ),
    ).toEqual({ offsetY: 120, maxOffsetY: 560 });
  });

  it("derives an iOS max offset from new-architecture content height", () => {
    expect(
      normalizeScrollMetrics(
        {
          scrollTop: 120,
          scrollHeight: 960,
        },
        "iOS",
        400,
      ),
    ).toEqual({ offsetY: 120, maxOffsetY: 560 });
  });

  it("returns null for incomplete or non-finite responses", () => {
    expect(normalizeScrollMetrics({ scrollY: 10 }, "Android", 400)).toBeNull();
    expect(
      normalizeScrollMetrics({ scrollY: Number.NaN, scrollRange: 10 }, "Android", 400),
    ).toBeNull();
  });

  it("clamps negative offsets and ranges", () => {
    expect(
      normalizeScrollMetrics(
        {
          scrollY: -20,
          scrollRange: -10,
        },
        "Android",
        400,
      ),
    ).toEqual({ offsetY: 0, maxOffsetY: 0 });
  });
});

describe("resolveKeyboardOcclusionTop", () => {
  it("uses the Lynx root bottom for Android relative keyboard height", () => {
    expect(
      resolveKeyboardOcclusionTop({ visible: true, height: 280 }, "Android", 844, {
        top: 44,
        bottom: 800,
      }),
    ).toBe(520);
  });

  it("uses the physical screen height in CSS pixels for iOS", () => {
    expect(
      resolveKeyboardOcclusionTop({ visible: true, height: 280 }, "iOS", 844, {
        top: 44,
        bottom: 800,
      }),
    ).toBe(564);
  });

  it("returns null for hidden or invalid keyboard geometry", () => {
    expect(
      resolveKeyboardOcclusionTop({ visible: false, height: 280 }, "iOS", 844, {
        top: 0,
        bottom: 844,
      }),
    ).toBeNull();
    expect(
      resolveKeyboardOcclusionTop({ visible: true, height: 0 }, "Android", 844, {
        top: 0,
        bottom: 844,
      }),
    ).toBeNull();
    expect(
      resolveKeyboardOcclusionTop({ visible: true, height: 280 }, "Android", 844, null),
    ).toBeNull();
  });
});

describe("lynxKeyboardAvoidingNativeDriver", () => {
  it("executes native spacer and absolute scroll mutations", () => {
    const { exec, invoke, node, setNativeProps } = createNode();

    lynxKeyboardAvoidingNativeDriver.setSpacerHeight(node, -10);
    lynxKeyboardAvoidingNativeDriver.scrollTo(node, -20, false);

    expect(setNativeProps).toHaveBeenCalledWith({ height: "0px" });
    expect(invoke).toHaveBeenCalledWith({
      method: "scrollTo",
      params: {
        offset: 0,
        smooth: false,
      },
    });
    expect(exec).toHaveBeenCalledTimes(2);
  });

  it("measures nodes in screen coordinates and executes the query", async () => {
    const { exec, invoke, node } = createNode((options) => {
      options.success?.({ top: 120, bottom: 280 });
    });

    await expect(lynxKeyboardAvoidingNativeDriver.measure(node)).resolves.toEqual({
      top: 120,
      bottom: 280,
    });
    expect(invoke).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "boundingClientRect",
        params: {
          relativeTo: "screen",
          androidEnableTransformProps: true,
        },
      }),
    );
    expect(exec).toHaveBeenCalledOnce();
  });

  it("normalizes getScrollInfo using the runtime platform", async () => {
    (globalThis as TestGlobal).SystemInfo = {
      platform: "iOS",
      pixelHeight: 844,
      pixelRatio: 1,
    };
    const { exec, node } = createNode((options) => {
      options.success?.({ scrollY: 120, scrollRange: 960 });
    });

    await expect(lynxKeyboardAvoidingNativeDriver.getScrollMetrics(node, 400)).resolves.toEqual({
      offsetY: 120,
      maxOffsetY: 560,
    });
    expect(exec).toHaveBeenCalledOnce();
  });
});
