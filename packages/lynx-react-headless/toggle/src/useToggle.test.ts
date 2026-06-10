import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { useToggle } from "./useToggle";

const fakeEvent = {} as Parameters<ReturnType<typeof useToggle>["rootProps"]["bindtap"]>[0];

describe("useToggle", () => {
  describe("uncontrolled", () => {
    it("starts from defaultPressed", () => {
      const { result } = renderHook(() => useToggle({ defaultPressed: true }));
      expect(result.current.pressed).toBe(true);
    });

    it("defaults to false", () => {
      const { result } = renderHook(() => useToggle({}));
      expect(result.current.pressed).toBe(false);
    });

    it("toggles pressed", () => {
      const { result } = renderHook(() => useToggle({ defaultPressed: false }));
      act(() => result.current.toggle());
      expect(result.current.pressed).toBe(true);
    });

    it("calls onPressedChange on toggle", () => {
      const onPressedChange = vi.fn();
      const { result } = renderHook(() => useToggle({ onPressedChange }));
      act(() => result.current.toggle());
      expect(onPressedChange).toHaveBeenCalledWith(true);
    });
  });

  describe("controlled", () => {
    it("uses the pressed prop", () => {
      const { result } = renderHook(() => useToggle({ pressed: true }));
      expect(result.current.pressed).toBe(true);
    });

    it("calls onPressedChange but does not update internal state", () => {
      const onPressedChange = vi.fn();
      const { result } = renderHook(() => useToggle({ pressed: false, onPressedChange }));
      act(() => result.current.toggle());
      expect(onPressedChange).toHaveBeenCalledWith(true);
      expect(result.current.pressed).toBe(false);
    });
  });

  describe("interaction via rootProps", () => {
    it("toggles on bindtap", () => {
      const { result } = renderHook(() => useToggle({ defaultPressed: false }));
      act(() => result.current.rootProps.bindtap(fakeEvent));
      expect(result.current.pressed).toBe(true);
    });

    it("does not toggle on bindtap when disabled", () => {
      const onPressedChange = vi.fn();
      const { result } = renderHook(() =>
        useToggle({ disabled: true, defaultPressed: false, onPressedChange }),
      );
      act(() => result.current.rootProps.bindtap(fakeEvent));
      expect(result.current.pressed).toBe(false);
      expect(onPressedChange).not.toHaveBeenCalled();
    });

    it("tracks active (pressed-down) state via touch", () => {
      const { result } = renderHook(() => useToggle({}));
      act(() => result.current.rootProps.bindtouchstart(fakeEvent));
      expect(result.current.active).toBe(true);
      act(() => result.current.rootProps.bindtouchend(fakeEvent));
      expect(result.current.active).toBe(false);
    });
  });
});
