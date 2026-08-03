import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";

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
});
