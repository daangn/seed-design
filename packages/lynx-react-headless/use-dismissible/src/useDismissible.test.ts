import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { useDismissible } from "./useDismissible";

describe("useDismissible", () => {
  it("closes once when uncontrolled and ignores later dismiss calls", () => {
    const onDismiss = vi.fn();
    const { result } = renderHook(() => useDismissible({ onDismiss }));

    expect(result.current.open).toBe(true);
    act(() => result.current.dismiss());
    act(() => result.current.dismiss());

    expect(result.current.open).toBe(false);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("does not notify when it starts closed", () => {
    const onDismiss = vi.fn();
    const { result } = renderHook(() => useDismissible({ defaultOpen: false, onDismiss }));

    act(() => result.current.dismiss());

    expect(result.current.open).toBe(false);
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it("notifies on every dismiss without changing a controlled open value", () => {
    const onDismiss = vi.fn();
    const { result, rerender } = renderHook(
      (props: { open: boolean }) => useDismissible({ open: props.open, onDismiss }),
      { initialProps: { open: true } },
    );

    act(() => result.current.dismiss());
    act(() => result.current.dismiss());
    expect(result.current.open).toBe(true);
    expect(onDismiss).toHaveBeenCalledTimes(2);

    rerender({ open: false });
    act(() => result.current.dismiss());
    expect(result.current.open).toBe(false);
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });
});
