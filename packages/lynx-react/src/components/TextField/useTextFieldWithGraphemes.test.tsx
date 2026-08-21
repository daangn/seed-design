import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

import { NATIVE_TEXT_MAX_LENGTH_UNLIMITED } from "./context";
import { useTextFieldWithGraphemes } from "./useTextFieldWithGraphemes";

describe("useTextFieldWithGraphemes", () => {
  it("counts extended grapheme clusters", () => {
    const { result } = renderHook(() =>
      useTextFieldWithGraphemes({ defaultValue: "👨‍👩‍👧‍👦🏳️‍🌈é" }),
    );

    expect(result.current.graphemes).toEqual(["👨‍👩‍👧‍👦", "🏳️‍🌈", "é"]);
    expect(result.current.counterProps).toEqual({ current: 3, max: 0 });
  });

  it("reports the original and grapheme-sliced values", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useTextFieldWithGraphemes({ maxGraphemeCount: 2, onValueChange }),
    );

    act(() => {
      result.current.textFieldRootProps.onValueChange("A👨‍👩‍👧‍👦B");
    });

    expect(onValueChange).toHaveBeenCalledWith({
      value: "A👨‍👩‍👧‍👦B",
      graphemes: ["A", "👨‍👩‍👧‍👦", "B"],
      slicedValue: "A👨‍👩‍👧‍👦",
      slicedGraphemes: ["A", "👨‍👩‍👧‍👦"],
    });
    expect(result.current.counterProps).toEqual({ current: 3, max: 2 });
  });

  it("keeps a controlled value fixed", () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useTextFieldWithGraphemes({ value: "고정", onValueChange }),
    );

    act(() => {
      result.current.textFieldRootProps.onValueChange("변경");
    });

    expect(result.current.textFieldRootProps.value).toBe("고정");
    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it("leaves native insertion maxlength unmanaged without a grapheme limit", () => {
    const { result } = renderHook(() => useTextFieldWithGraphemes({ defaultValue: "제한 없음" }));

    expect(result.current.textFieldRootProps.nativeInsertionMaxLength).toBeUndefined();
  });

  it("provides a UTF-16 native insertion cap only at the grapheme limit", () => {
    const family = "👨‍👩‍👧‍👦";
    const { result, rerender } = renderHook(
      ({ value }: { value: string }) => useTextFieldWithGraphemes({ value, maxGraphemeCount: 2 }),
      { initialProps: { value: family } },
    );

    expect(result.current.textFieldRootProps.nativeInsertionMaxLength).toBe(
      NATIVE_TEXT_MAX_LENGTH_UNLIMITED,
    );

    const valueAtLimit = `${family}A`;
    rerender({ value: valueAtLimit });

    expect(result.current.graphemes).toEqual([family, "A"]);
    expect(result.current.textFieldRootProps.nativeInsertionMaxLength).toBe(valueAtLimit.length);
    expect(result.current.textFieldRootProps.nativeInsertionMaxLength).toBeGreaterThan(2);

    rerender({ value: "A" });

    expect(result.current.textFieldRootProps.nativeInsertionMaxLength).toBe(
      NATIVE_TEXT_MAX_LENGTH_UNLIMITED,
    );
  });
});
