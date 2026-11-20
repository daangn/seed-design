import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "./useControllableState";

describe("useControllableState", () => {
  describe("uncontrolled mode", () => {
    it("initializes with defaultValue", () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: "initial" }));

      expect(result.current[0]).toBe("initial");
    });

    it("updates value on setValue", () => {
      const { result } = renderHook(() => useControllableState({ defaultValue: 0 }));

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
    });

    it("calls onChange only once per unique value", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState({ defaultValue: 0, onChange }));

      act(() => {
        result.current[1](1);
      });
      act(() => {
        result.current[1](1);
      });
      act(() => {
        result.current[1](2);
      });

      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(1, 1);
      expect(onChange).toHaveBeenNthCalledWith(2, 2);
    });
  });

  describe("controlled mode", () => {
    it.each([false, true])("notifies after an external change from %s", (initialValue) => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(
        (props: { value: boolean }) =>
          useControllableState({ value: props.value, defaultValue: false, onChange }),
        { initialProps: { value: initialValue } },
      );

      rerender({ value: !initialValue });
      expect(result.current[0]).toBe(!initialValue);
      expect(onChange).not.toHaveBeenCalled();

      act(() => result.current[1](!result.current[0]));

      expect(onChange).toHaveBeenCalledExactlyOnceWith(initialValue);
      rerender({ value: initialValue });
      act(() => result.current[1](!result.current[0]));
      expect(onChange).toHaveBeenNthCalledWith(2, !initialValue);
      expect(onChange).toHaveBeenCalledTimes(2);
    });

    it("notifies again when the parent does not accept a change", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState({ value: false, defaultValue: false, onChange }),
      );

      act(() => result.current[1](true));
      act(() => result.current[1](true));

      expect(result.current[0]).toBe(false);
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(onChange).toHaveBeenNthCalledWith(1, true);
      expect(onChange).toHaveBeenNthCalledWith(2, true);
    });

    it("does not notify for the current prop after an unaccepted change", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState({ value: false, defaultValue: false, onChange }),
      );

      act(() => result.current[1](false));
      expect(onChange).not.toHaveBeenCalled();
      act(() => result.current[1](true));
      act(() => result.current[1](false));

      expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
    });
  });

  it("returns a stable setValue reference", () => {
    const { result, rerender } = renderHook(() => useControllableState({ defaultValue: 0 }));

    const setValueFirst = result.current[1];
    rerender();
    const setValueSecond = result.current[1];

    expect(setValueFirst).toBe(setValueSecond);
  });
});
