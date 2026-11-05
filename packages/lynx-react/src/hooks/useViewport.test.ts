import { act, renderHook } from "@lynx-js/react/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useViewport } from "./useViewport";

type RectCallback = (rect: { width: number; height: number }) => void;

function installLynx() {
  const pendingMeasurements: RectCallback[] = [];
  const selectRoot = vi.fn(() => ({
    invoke: ({ success }: { success: RectCallback }) => {
      pendingMeasurements.push(success);
      return { exec: () => {} };
    },
  }));
  const overrides = { createSelectorQuery: () => ({ selectRoot }) };
  vi.stubGlobal("lynx", { ...globalThis.lynx, ...overrides });
  for (const testGlobal of [
    lynxTestingEnv.backgroundThread.globalThis,
    lynxTestingEnv.mainThread.globalThis,
  ]) {
    testGlobal["lynx"] = { ...testGlobal["lynx"], ...overrides };
  }

  return {
    selectRoot,
    resolveMeasurement: (rect: { width: number; height: number }) =>
      act(() => pendingMeasurements.shift()?.(rect)),
    resize: (width: number, height: number) =>
      act(() => lynx.getJSModule("GlobalEventEmitter").emit("onWindowResize", [width, height])),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useViewport", () => {
  it("starts from the device logical size, then follows the measured root and resizes", () => {
    const lynxMock = installLynx();
    const { result, unmount } = renderHook(() => useViewport());

    expect(result.current).toEqual({
      width: SystemInfo.pixelWidth / SystemInfo.pixelRatio,
      height: SystemInfo.pixelHeight / SystemInfo.pixelRatio,
    });

    lynxMock.resolveMeasurement({ width: 320, height: 540 });
    expect(result.current).toEqual({ width: 320, height: 540 });

    lynxMock.resize(540, 320);
    expect(result.current).toEqual({ width: 540, height: 320 });

    unmount();
  });

  it("shares one root measurement across consumers", () => {
    const lynxMock = installLynx();
    const { result, unmount } = renderHook(() => [useViewport(), useViewport()]);

    lynxMock.resolveMeasurement({ width: 320, height: 540 });

    expect(lynxMock.selectRoot).toHaveBeenCalledTimes(1);
    expect(result.current).toEqual([
      { width: 320, height: 540 },
      { width: 320, height: 540 },
    ]);

    unmount();
  });

  it("ignores a measurement that arrives after the last consumer unmounts", () => {
    const lynxMock = installLynx();
    renderHook(() => useViewport()).unmount();
    lynxMock.resolveMeasurement({ width: 1, height: 1 });

    const { result, unmount } = renderHook(() => useViewport());
    lynxMock.resize(540, 320);

    expect(lynxMock.selectRoot).toHaveBeenCalledTimes(2);
    expect(result.current).toEqual({ width: 540, height: 320 });

    unmount();
  });
});
