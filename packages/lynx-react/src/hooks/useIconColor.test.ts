import type * as ReactLynx from "@lynx-js/react";
import { renderHook } from "@lynx-js/react/testing-library";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useIconColor } from "./useIconColor";

const testState = vi.hoisted(() => ({
  theme: "light",
  workletCalls: [] as number[],
}));

vi.mock("@lynx-js/react", async (importOriginal) => {
  const actual = await importOriginal<typeof ReactLynx>();

  return {
    ...actual,
    runOnMainThread:
      () =>
      (...args: unknown[]) => {
        testState.workletCalls.push(args.length);
      },
    useGlobalProps: () => ({ theme: testState.theme }),
  };
});

describe("useIconColor", () => {
  beforeEach(() => {
    testState.theme = "light";
    testState.workletCalls.length = 0;
  });

  it("returns icon tint sync props", () => {
    const { result } = renderHook(() => useIconColor([]));

    expect(result.current).toHaveProperty("ref");
    expect(result.current["main-thread:binduiappear"]).toBeDefined();
  });

  it("avoids cross-thread calls on mount and resynchronizes after theme changes", () => {
    const { rerender } = renderHook(() => useIconColor([]));

    expect(testState.workletCalls).toEqual([]);

    testState.theme = "dark";
    rerender();

    expect(testState.workletCalls).toEqual([3]);
  });
});
