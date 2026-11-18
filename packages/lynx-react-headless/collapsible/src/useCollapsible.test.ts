import { act, renderHook } from "@lynx-js/react/testing-library";
import { expect, it, vi } from "vitest";
import { useCollapsible } from "./useCollapsible";

it("caches closed measurements without rendering and uses the latest height on open", () => {
  const rendered = vi.fn();
  const { result, rerender } = renderHook(
    ({ open }) => {
      rendered();
      return useCollapsible({ open });
    },
    { initialProps: { open: false } },
  );
  const measure = (height: number) =>
    act(() => {
      result.current.contentInnerProps.bindlayoutchange({
        detail: { width: 320, height },
      } as Parameters<typeof result.current.contentInnerProps.bindlayoutchange>[0]);
    });
  const initialRenders = rendered.mock.calls.length;
  measure(40);
  measure(60);
  expect(rendered).toHaveBeenCalledTimes(initialRenders);
  expect(result.current.contentProps.style.height).toBe("0px");
  rerender({ open: true });
  expect(result.current.contentProps.style.height).toBe("60px");
  const openRenders = rendered.mock.calls.length;
  measure(60);
  expect(rendered).toHaveBeenCalledTimes(openRenders);
  measure(80);
  expect(result.current.contentProps.style.height).toBe("80px");
  rerender({ open: false });
  measure(20);
  rerender({ open: true });
  expect(result.current.contentProps.style.height).toBe("20px");
});
