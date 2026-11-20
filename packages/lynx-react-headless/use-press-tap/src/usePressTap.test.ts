import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { usePressTap, type UsePressTapOptions } from "./usePressTap";

const fakeEvent = {} as Parameters<ReturnType<typeof usePressTap>["bindtap"]>[0];

describe("usePressTap", () => {
  describe("pressed state", () => {
    it("starts as false", () => {
      const { result } = renderHook(() => usePressTap());
      expect(result.current.pressed).toBe(false);
    });

    it("becomes true on bindtouchstart", () => {
      const { result } = renderHook(() => usePressTap());

      act(() => {
        result.current.bindtouchstart(fakeEvent);
      });

      expect(result.current.pressed).toBe(true);
    });

    it("becomes false on bindtouchend", () => {
      const { result } = renderHook(() => usePressTap());

      act(() => {
        result.current.bindtouchstart(fakeEvent);
      });
      act(() => {
        result.current.bindtouchend(fakeEvent);
      });

      expect(result.current.pressed).toBe(false);
    });

    it("becomes false on bindtouchcancel", () => {
      const { result } = renderHook(() => usePressTap());

      act(() => {
        result.current.bindtouchstart(fakeEvent);
      });
      act(() => {
        result.current.bindtouchcancel(fakeEvent);
      });

      expect(result.current.pressed).toBe(false);
    });
  });

  describe("onTap", () => {
    it("is called when bindtap fires", () => {
      const onTap = vi.fn();
      const { result } = renderHook(() => usePressTap({ onTap }));

      act(() => {
        result.current.bindtap(fakeEvent);
      });

      expect(onTap).toHaveBeenCalledTimes(1);
    });

    it("clears pressed when bindtap fires before touchend", () => {
      const { result } = renderHook(() => usePressTap({ onTap: vi.fn() }));

      act(() => {
        result.current.bindtouchstart(fakeEvent);
      });
      act(() => {
        result.current.bindtap(fakeEvent);
      });

      expect(result.current.pressed).toBe(false);
    });

    it("clears pressed on tap without requiring a callback", () => {
      const { result } = renderHook(() => usePressTap());

      act(() => {
        result.current.bindtouchstart(fakeEvent);
      });
      act(() => {
        result.current.bindtap(fakeEvent);
      });

      expect(result.current.pressed).toBe(false);
    });
  });

  describe("disabled", () => {
    it("does not update pressed on bindtouchstart", () => {
      const { result } = renderHook(() => usePressTap({ disabled: true }));

      act(() => {
        result.current.bindtouchstart(fakeEvent);
      });

      expect(result.current.pressed).toBe(false);
    });

    it("does not call onTap on bindtap", () => {
      const onTap = vi.fn();
      const { result } = renderHook(() => usePressTap({ disabled: true, onTap }));

      act(() => {
        result.current.bindtap(fakeEvent);
      });

      expect(onTap).not.toHaveBeenCalled();
    });
  });

  it("does not bind main-thread:bindtap when mainThreadOnTap is omitted", () => {
    const { result } = renderHook(() => usePressTap());

    expect(result.current).not.toHaveProperty("main-thread:bindtap");
  });
});

it("clears an active press when disabled and does not restore it when re-enabled", () => {
  const { result, rerender } = renderHook(({ disabled }) => usePressTap({ disabled }), {
    initialProps: { disabled: false },
  });
  act(() => result.current.bindtouchstart());
  expect(result.current.pressed).toBe(true);
  rerender({ disabled: true });
  expect(result.current.pressed).toBe(false);
  rerender({ disabled: false });
  expect(result.current.pressed).toBe(false);
  act(() => result.current.bindtouchstart());
  expect(result.current.pressed).toBe(true);
});

it("reuses composed main-thread handlers across press state changes", () => {
  const handler = () => {
    "main thread";
  };
  const initialProps: UsePressTapOptions = {
    mainThreadOnTouchStart: handler,
    mainThreadOnTouchEnd: handler,
    mainThreadOnTouchCancel: handler,
  };
  const { result, rerender } = renderHook((options) => usePressTap(options), { initialProps });
  const first = result.current;
  rerender({ ...initialProps });
  expect(result.current).toBe(first);
  act(() => result.current.bindtouchstart());
  expect(result.current.pressed).toBe(true);
  for (const key of [
    "main-thread:bindtouchstart",
    "main-thread:bindtouchend",
    "main-thread:bindtouchcancel",
  ] as const) {
    expect(result.current[key]).toBe(first[key]);
  }
  const replacement = () => {
    "main thread";
  };
  rerender({ ...initialProps, mainThreadOnTouchStart: replacement });
  expect(result.current["main-thread:bindtouchstart"]).not.toBe(
    first["main-thread:bindtouchstart"],
  );
  expect(result.current["main-thread:bindtouchend"]).toBe(first["main-thread:bindtouchend"]);
  rerender({});
  expect(result.current).not.toHaveProperty("main-thread:bindtouchstart");
});
