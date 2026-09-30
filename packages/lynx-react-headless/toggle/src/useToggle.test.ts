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
      const bindtap = vi.fn();
      function mainThreadTap() {
        "main thread";
      }
      const { result } = renderHook(() =>
        useToggle({
          disabled: true,
          defaultPressed: false,
          onPressedChange,
          bindtap,
          "main-thread:bindtap": mainThreadTap,
        }),
      );
      act(() => result.current.rootProps.bindtap(fakeEvent));
      expect(result.current.pressed).toBe(false);
      expect(onPressedChange).not.toHaveBeenCalled();
      expect(bindtap).not.toHaveBeenCalled();
      expect(result.current.rootProps["main-thread:bindtap"]).toBeUndefined();
      expect(result.current.rootProps["accessibility-traits"]).toBe("disabled");
    });

    it("runs the consumer bindtap before the pressed change", () => {
      const calls: string[] = [];
      const { result } = renderHook(() =>
        useToggle({
          bindtap: () => calls.push("bindtap"),
          onPressedChange: (pressed) => calls.push(`pressed:${pressed}`),
        }),
      );
      act(() => result.current.rootProps.bindtap(fakeEvent));
      expect(calls).toEqual(["bindtap", "pressed:true"]);
      expect(result.current.rootProps["accessibility-value"]).toBe("pressed");
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

it("preserves consecutive uncontrolled toggles before a render", () => {
  const onPressedChange = vi.fn();
  const { result } = renderHook(() => useToggle({ onPressedChange }));
  act(() => {
    result.current.toggle();
    result.current.toggle();
  });
  expect(result.current.pressed).toBe(false);
  expect(onPressedChange.mock.calls).toEqual([[true], [false]]);
});

it("uses the latest controlled value and callback", () => {
  const first = vi.fn();
  const next = vi.fn();
  const { result, rerender } = renderHook((props) => useToggle(props), {
    initialProps: { pressed: false, onPressedChange: first },
  });
  const tap = result.current.rootProps.bindtap;
  rerender({ pressed: true, onPressedChange: next });
  act(() => tap(fakeEvent));
  expect(next).toHaveBeenCalledExactlyOnceWith(false);
  expect(first).not.toHaveBeenCalled();
  expect(result.current.pressed).toBe(true);
});

it("clears active when disabled during a press and keeps tap disabled", () => {
  const onPressedChange = vi.fn();
  const { result, rerender } = renderHook(
    ({ disabled }) => useToggle({ disabled, onPressedChange }),
    {
      initialProps: { disabled: false },
    },
  );
  act(() => result.current.rootProps.bindtouchstart(fakeEvent));
  expect(result.current.active).toBe(true);
  rerender({ disabled: true });
  act(() => result.current.rootProps.bindtap(fakeEvent));
  expect(result.current.active).toBe(false);
  expect(onPressedChange).not.toHaveBeenCalled();
  rerender({ disabled: false });
  expect(result.current.active).toBe(false);
});

it("cancels active without toggling selected state", () => {
  const { result } = renderHook(() => useToggle({}));
  act(() => result.current.rootProps.bindtouchstart(fakeEvent));
  act(() => result.current.rootProps.bindtouchcancel(fakeEvent));
  expect(result.current.active).toBe(false);
  expect(result.current.pressed).toBe(false);
});
