import { describe, it, expect } from "vitest";
import { handlePaddingWithSafeArea } from "./styled";

describe("handlePaddingWithSafeArea", () => {
  it("should handle padding='safeArea' correctly", () => {
    const result = handlePaddingWithSafeArea("safeArea", undefined, "top");
    expect(result).toBe("var(--seed-safe-area-top)");
  });

  it("should handle padding='safeArea' for bottom", () => {
    const result = handlePaddingWithSafeArea("safeArea", undefined, "bottom");
    expect(result).toBe("var(--seed-safe-area-bottom)");
  });

  it("should handle safeArea boolean prop correctly", () => {
    const result = handlePaddingWithSafeArea(undefined, true, "top");
    expect(result).toBe("var(--seed-safe-area-top)");
  });

  it("should combine safeArea with padding value", () => {
    const result = handlePaddingWithSafeArea("10px", true, "top");
    expect(result).toBe("calc(10px + var(--seed-safe-area-top))");
  });

  it("should combine safeArea with numeric padding", () => {
    const result = handlePaddingWithSafeArea("20px", true, "bottom");
    expect(result).toBe("calc(20px + var(--seed-safe-area-bottom))");
  });

  it("should handle zero padding with safe area", () => {
    const result = handlePaddingWithSafeArea(0, true, "top");
    expect(result).toBe("calc(0px + var(--seed-safe-area-top))");
  });

  it("should not double apply safe area when both safeArea boolean and padding='safeArea' are used", () => {
    const result = handlePaddingWithSafeArea("safeArea", true, "top");
    expect(result).toBe("var(--seed-safe-area-top)");
  });

  it("should return padding value when safeArea is false", () => {
    const result = handlePaddingWithSafeArea("15px", false, "top");
    expect(result).toBe("15px");
  });

  it("should return undefined when both padding and safeArea are undefined", () => {
    const result = handlePaddingWithSafeArea(undefined, undefined, "top");
    expect(result).toBeUndefined();
  });

  it("should handle null padding", () => {
    const result = handlePaddingWithSafeArea(null as any, true, "top");
    expect(result).toBe("var(--seed-safe-area-top)");
  });
});
