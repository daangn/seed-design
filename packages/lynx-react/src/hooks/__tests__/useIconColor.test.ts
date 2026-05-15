import { renderHook } from "@lynx-js/react/testing-library";
import { describe, expect, it } from "vitest";

import { useIconColor } from "../useIconColor";

describe("useIconColor", () => {
  it("returns icon tint sync props", () => {
    const { result } = renderHook(() => useIconColor([]));

    expect(result.current).toHaveProperty("ref");
    expect(result.current["main-thread:binduiappear"]).toBeDefined();
  });
});
