import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { usePressTap } from "../use-press-tap";

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

    it("clears pressed when bindtap fires", () => {
      const { result } = renderHook(() => usePressTap());

      act(() => {
        result.current.bindtouchstart(fakeEvent);
      });
      expect(result.current.pressed).toBe(true);

      act(() => {
        result.current.bindtap(fakeEvent);
      });

      expect(result.current.pressed).toBe(false);
    });

    it("can be omitted without error", () => {
      const { result } = renderHook(() => usePressTap());

      expect(() => {
        act(() => {
          result.current.bindtap(fakeEvent);
        });
      }).not.toThrow();
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

    it("clears pressed when disabled changes to true", () => {
      const { result, rerender } = renderHook(
        ({ disabled }) => usePressTap({ disabled }),
        { initialProps: { disabled: false } },
      );

      act(() => {
        result.current.bindtouchstart(fakeEvent);
      });
      expect(result.current.pressed).toBe(true);

      rerender({ disabled: true });

      expect(result.current.pressed).toBe(false);
    });
  });

  describe("main-thread:bindtap", () => {
    it("is included when enabled and mainThreadOnTap is provided", () => {
      const mainThreadOnTap = () => {};
      const { result } = renderHook(() => usePressTap({ mainThreadOnTap }));

      expect(result.current["main-thread:bindtap"]).toBe(mainThreadOnTap);
    });

    it("is not included when mainThreadOnTap is omitted", () => {
      const { result } = renderHook(() => usePressTap());

      expect(result.current).not.toHaveProperty("main-thread:bindtap");
    });

    it("is not included when disabled is true", () => {
      const mainThreadOnTap = () => {};
      const { result } = renderHook(() => usePressTap({ disabled: true, mainThreadOnTap }));

      expect(result.current).not.toHaveProperty("main-thread:bindtap");
    });
  });

  it("returns stable handler references across renders", () => {
    const { result, rerender } = renderHook(() => usePressTap());

    const firstBindtap = result.current.bindtap;
    const firstBindtouchstart = result.current.bindtouchstart;
    rerender();

    expect(result.current.bindtap).toBe(firstBindtap);
    expect(result.current.bindtouchstart).toBe(firstBindtouchstart);
  });
});
