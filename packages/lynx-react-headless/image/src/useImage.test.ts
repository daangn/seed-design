import { act, renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it, vi } from "vitest";
import { useImage } from "./useImage";

describe("useImage", () => {
  it("tracks load and error transitions without duplicate notifications", () => {
    const onLoadingStatusChange = vi.fn();
    const { result } = renderHook(() => useImage({ src: "a.png", onLoadingStatusChange }));
    expect(result.current.loadingStatus).toBe("loading");
    act(() => result.current.handleLoad());
    act(() => result.current.handleLoad());
    expect(result.current.isLoaded).toBe(true);
    expect(onLoadingStatusChange.mock.calls).toEqual([["loading"], ["loaded"]]);
    act(() => result.current.handleError());
    expect(result.current.loadingStatus).toBe("error");
  });

  it("ignores a previous source's callbacks after replacement", () => {
    const { result, rerender } = renderHook(({ src }) => useImage({ src }), {
      initialProps: { src: "a.png" },
    });
    const previous = result.current;
    act(() => previous.handleLoad());
    rerender({ src: "b.png" });
    expect(result.current.loadingStatus).toBe("loading");
    act(() => previous.handleError());
    expect(result.current.loadingStatus).toBe("loading");
    act(() => previous.handleLoad());
    expect(result.current.loadingStatus).toBe("loading");
    act(() => result.current.handleLoad());
    expect(result.current.isLoaded).toBe(true);
  });

  it("does not accept load events without a source", () => {
    const { result } = renderHook(() => useImage({}));
    act(() => result.current.handleLoad());
    expect(result.current.loadingStatus).toBe("error");
  });

  it("keeps old requests stale even when the same source is selected again", () => {
    const { result, rerender } = renderHook(({ src }) => useImage({ src }), {
      initialProps: { src: "a.png" },
    });
    const firstLoad = result.current.handleLoad;
    rerender({ src: "b.png" });
    rerender({ src: "a.png" });
    act(() => firstLoad());
    expect(result.current.loadingStatus).toBe("loading");
  });

  it("uses the latest notification callback without replaying the status", () => {
    const first = vi.fn();
    const next = vi.fn();
    const { result, rerender } = renderHook(
      ({ onLoadingStatusChange }) => useImage({ src: "a.png", onLoadingStatusChange }),
      {
        initialProps: { onLoadingStatusChange: first },
      },
    );
    rerender({ onLoadingStatusChange: next });
    expect(next).not.toHaveBeenCalled();
    act(() => result.current.handleLoad());
    expect(next).toHaveBeenCalledExactlyOnceWith("loaded");
    expect(first.mock.calls).toEqual([["loading"]]);
  });
});
