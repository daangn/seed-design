import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";

import { useBreakpointValue } from "./useBreakpointValue";

type ChangeHandler = (e: { matches: boolean }) => void;

let currentWidth = 0;
const entries = new Map<string, { minWidth: number; handlers: Set<ChangeHandler> }>();

function mockMatchMedia(query: string) {
  const match = query.match(/min-width:\s*(\d+)px/);
  const minWidth = match ? Number(match[1]) : 0;
  const entry = entries.get(query) ?? { minWidth, handlers: new Set<ChangeHandler>() };
  entries.set(query, entry);
  return {
    get matches() {
      return currentWidth >= entry.minWidth;
    },
    media: query,
    addEventListener(_: string, handler: ChangeHandler) {
      entry.handlers.add(handler);
    },
    removeEventListener(_: string, handler: ChangeHandler) {
      entry.handlers.delete(handler);
    },
    onchange: null,
    addListener: mock(),
    removeListener: mock(),
    dispatchEvent: () => false,
  };
}

function setViewport(minWidthPx: number) {
  currentWidth = minWidthPx;
  for (const [, entry] of entries) {
    const nowMatches = currentWidth >= entry.minWidth;
    for (const handler of entry.handlers) {
      handler({ matches: nowMatches });
    }
  }
}

beforeEach(() => {
  currentWidth = 0;
  entries.clear();
  window.matchMedia = mockMatchMedia as unknown as typeof window.matchMedia;
});

describe("useBreakpointValue", () => {
  it("passes through a single value", () => {
    const { result } = renderHook(() => useBreakpointValue(42));
    expect(result.current).toBe(42);
  });

  it("passes through a string value", () => {
    const { result } = renderHook(() => useBreakpointValue("hello"));
    expect(result.current).toBe("hello");
  });

  it("resolves base value at base breakpoint", () => {
    const { result } = renderHook(() => useBreakpointValue({ base: 1, md: 2, xl: 4 }));
    expect(result.current).toBe(1);
  });

  it("falls back to base when current breakpoint has no value", () => {
    currentWidth = 480; // sm
    const { result } = renderHook(() => useBreakpointValue({ base: 1, md: 2 }));
    // sm is not defined, falls back to base
    expect(result.current).toBe(1);
  });

  it("resolves md value at md breakpoint", () => {
    currentWidth = 768;
    const { result } = renderHook(() => useBreakpointValue({ base: 1, md: 2, xl: 4 }));
    expect(result.current).toBe(2);
  });

  it("falls back to md at lg when lg is not defined", () => {
    currentWidth = 1280; // lg
    const { result } = renderHook(() => useBreakpointValue({ base: 1, md: 2, xl: 4 }));
    // lg not defined, falls back to md
    expect(result.current).toBe(2);
  });

  it("resolves xl value at xl breakpoint", () => {
    currentWidth = 1440;
    const { result } = renderHook(() => useBreakpointValue({ base: 1, md: 2, xl: 4 }));
    expect(result.current).toBe(4);
  });

  it("updates when viewport changes", () => {
    const { result } = renderHook(() => useBreakpointValue({ base: "compact", md: "full" }));
    expect(result.current).toBe("compact");

    act(() => setViewport(768));
    expect(result.current).toBe("full");

    act(() => setViewport(0));
    expect(result.current).toBe("compact");
  });
});
