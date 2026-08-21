import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, mock } from "bun:test";
import type * as React from "react";

import { BreakpointProvider } from "../providers/BreakpointProvider";
import { useBreakpoint } from "./useBreakpoint";

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

describe("useBreakpoint", () => {
  it("returns 'base' when no media query matches", () => {
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("base");
  });

  it("returns 'md' when viewport is 768px", () => {
    currentWidth = 768;
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("md");
  });

  it("returns the largest matching breakpoint", () => {
    currentWidth = 1440;
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("xl");
  });

  it("updates when viewport changes", () => {
    const { result } = renderHook(() => useBreakpoint());
    expect(result.current).toBe("base");

    act(() => setViewport(768));
    expect(result.current).toBe("md");

    act(() => setViewport(1280));
    expect(result.current).toBe("lg");
  });

  it("respects defaultBreakpoint option", () => {
    const { result } = renderHook(() => useBreakpoint({ defaultBreakpoint: "lg" }));
    expect(result.current).toBe("base");
  });

  it("uses BreakpointProvider context when wrapped", () => {
    currentWidth = 768;
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <BreakpointProvider>{children}</BreakpointProvider>
    );
    const { result } = renderHook(() => useBreakpoint(), { wrapper });
    expect(result.current).toBe("md");
  });
});
