import { describe, expect, it } from "vitest";
import {
  handleColor,
  handleDimension,
  handleFontSize,
  handleFontWeight,
  handleLineHeight,
  handleRadius,
} from "./styled";

describe("style token lookup fallbacks", () => {
  it("preserves arbitrary CSS values and unknown token names", () => {
    for (const value of ["inherit", "var(--custom)", "unknown.token", "calc(100% - 2px)"]) {
      expect(handleColor(value)).toBe(value);
      expect(handleDimension(value)).toBe(value);
      expect(handleFontSize(value)).toBe(value);
      expect(handleFontWeight(value)).toBe(value);
      expect(handleLineHeight(value)).toBe(value);
      expect(handleRadius(value)).toBe(value);
    }
    expect(handleColor("rgba(0, 0, 0, 0.5)")).toBe("rgba(0, 0, 0, 0.5)");
  });

  it("preserves numeric dimensions, full size, empty strings, and omitted values", () => {
    expect(handleDimension(0)).toBe("0px");
    expect(handleDimension(12.5)).toBe("12.5px");
    expect(handleDimension("full")).toBe("100%");
    expect(handleDimension("")).toBe("");
    expect(handleRadius(0)).toBe(0);
    expect(handleRadius("")).toBe("");
    expect(handleColor("")).toBeUndefined();
    expect(handleFontSize("")).toBeUndefined();
    expect(handleFontWeight("")).toBeUndefined();
    expect(handleLineHeight("")).toBeUndefined();
    for (const handle of [
      handleColor,
      handleDimension,
      handleFontSize,
      handleFontWeight,
      handleLineHeight,
      handleRadius,
    ]) {
      expect(handle(undefined)).toBeUndefined();
    }
  });
});
