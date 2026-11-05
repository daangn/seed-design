import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "bun:test";
import { useSyncedTab } from "./use-synced-tab";

describe("useSyncedTab", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("defaults to the first value", () => {
    const { result } = renderHook(() => useSyncedTab(["npm", "yarn"]));
    expect(result.current[0]).toBe("npm");
  });

  it("without a groupId, changing the value does not persist", () => {
    const { result } = renderHook(() => useSyncedTab(["npm", "yarn"]));
    act(() => result.current[1]("yarn"));
    expect(result.current[0]).toBe("yarn");
    expect(window.localStorage.length).toBe(0);
  });

  it("with a groupId, persists the selection and hydrates a fresh group from it", () => {
    const first = renderHook(() => useSyncedTab(["npm", "yarn", "pnpm"], "pm"));
    act(() => first.result.current[1]("pnpm"));
    expect(window.localStorage.getItem("seed-tabs-sync:pm")).toBe("pnpm");

    const second = renderHook(() => useSyncedTab(["npm", "yarn", "pnpm"], "pm"));
    expect(second.result.current[0]).toBe("pnpm");
  });

  it("broadcasts to sibling groups with the same id", () => {
    const a = renderHook(() => useSyncedTab(["npm", "yarn"], "pm"));
    const b = renderHook(() => useSyncedTab(["npm", "yarn"], "pm"));
    act(() => a.result.current[1]("yarn"));
    expect(b.result.current[0]).toBe("yarn");
  });

  it("ignores a stored value that is not in its own value set", () => {
    window.localStorage.setItem("seed-tabs-sync:pm", "deno");
    const { result } = renderHook(() => useSyncedTab(["npm", "yarn"], "pm"));
    expect(result.current[0]).toBe("npm");
  });
});
