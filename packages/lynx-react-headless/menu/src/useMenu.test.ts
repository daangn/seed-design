import { act, renderHook } from "@lynx-js/react/testing-library";
import type { Position, Rect } from "@seed-design/lynx-react-floating";
import { expect, it, vi } from "vitest";
import { useMenu } from "./useMenu";

it("does not render again for unchanged geometry but publishes changed rects", () => {
  const rendered = vi.fn();
  const { result } = renderHook(() => {
    rendered();
    return useMenu({ defaultOpen: true });
  });
  const rect: Rect = { left: 0, top: 0, right: 100, bottom: 40, width: 100, height: 40 };
  const position: Position = {
    left: 0,
    top: 40,
    width: 100,
    height: 80,
    placement: "bottom",
    transformOrigin: "top center",
    availableWidth: 320,
    availableHeight: 640,
  };
  act(() => result.current.setPosition(position, rect, rect));
  const renders = rendered.mock.calls.length;
  const previous = result.current;
  act(() => result.current.setPosition({ ...position }, { ...rect }, { ...rect }));
  expect(rendered).toHaveBeenCalledTimes(renders);
  expect(result.current).toBe(previous);
  const shifted = { ...rect, left: 10, right: 110 };
  act(() => result.current.setPosition(position, shifted, rect));
  expect(result.current.layerRect).toEqual(shifted);
  expect(result.current.triggerRect).toBe(previous.triggerRect);
});
