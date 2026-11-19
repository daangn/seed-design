import { act, renderHook } from "@lynx-js/react/testing-library";
import { expect, it, vi } from "vitest";
import { useTabs } from "./useTabs";

it("ignores unchanged or unregistered trigger disabled updates", () => {
  const rendered = vi.fn();
  const { result } = renderHook(() => {
    rendered();
    return useTabs({ defaultValue: "a" });
  });
  act(() => {
    result.current.registerTrigger("a", false);
  });
  const first = result.current;
  const renders = rendered.mock.calls.length;
  act(() => result.current.updateTriggerDisabled("a", false));
  act(() => result.current.updateTriggerDisabled("missing", true));
  expect(rendered).toHaveBeenCalledTimes(renders);
  expect(result.current).toBe(first);
  act(() => result.current.updateTriggerDisabled("a", true));
  expect(result.current.items).toEqual([{ value: "a", disabled: true }]);
});
