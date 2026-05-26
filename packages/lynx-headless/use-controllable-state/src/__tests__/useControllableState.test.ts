import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { useControllableState } from "../useControllableState";

describe("useControllableState", () => {
  it("uses defaultValue when uncontrolled", () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: false }));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  it("uses value when controlled", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ value }) => useControllableState({ value, defaultValue: false, onChange }),
      { initialProps: { value: true } },
    );

    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](false);
    });

    expect(onChange).toHaveBeenCalledWith(false);
    expect(result.current[0]).toBe(true);

    rerender({ value: false });
    expect(result.current[0]).toBe(false);
  });

  it("does not call onChange when value does not change", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() => useControllableState({ defaultValue: true, onChange }));

    act(() => {
      result.current[1](true);
    });

    expect(onChange).not.toHaveBeenCalled();
  });
});
