import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { useControllableState } from "../use-controllable-state";

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

    it("calls onChange when value changes", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState({ defaultValue: "a", onChange }));

      act(() => {
        result.current[1]("b");
      });

      expect(onChange).toHaveBeenCalledWith("b");
      expect(onChange).toHaveBeenCalledTimes(1);
    });

    it("does not call onChange when value is unchanged", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() => useControllableState({ defaultValue: "a", onChange }));

      act(() => {
        result.current[1]("a");
      });

      expect(onChange).not.toHaveBeenCalled();
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
    it("uses the provided value", () => {
      const { result } = renderHook(() =>
        useControllableState({ value: "external", defaultValue: "default" }),
      );

      expect(result.current[0]).toBe("external");
    });

    it("calls onChange on setValue but does not update internal state", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState({
          value: "controlled",
          defaultValue: "default",
          onChange,
        }),
      );

      act(() => {
        result.current[1]("next");
      });

      expect(onChange).toHaveBeenCalledWith("next");
      expect(result.current[0]).toBe("controlled");
    });

    it("reflects external value changes on rerender", () => {
      const { result, rerender } = renderHook(
        (props: { value: string }) =>
          useControllableState({
            value: props.value,
            defaultValue: "default",
          }),
        { initialProps: { value: "first" } },
      );

      expect(result.current[0]).toBe("first");

      rerender({ value: "second" });

      expect(result.current[0]).toBe("second");
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
