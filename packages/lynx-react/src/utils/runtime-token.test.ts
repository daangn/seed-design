import { describe, expect, it } from "vitest";
import { expandToken, lookupToken } from "./runtime-token";

describe("runtime token expansion", () => {
  it("caches derived suffixes without changing tables or retaining the caller's prefix", () => {
    const tokens = Object.freeze({ "fg.brandContrast": 0, "palette.gray100": 0 } as const);
    expect(lookupToken(tokens, "fg.brandContrast", "var(--first-")).toBe(
      "var(--first-fg-brand-contrast)",
    );
    expect(lookupToken(tokens, "fg.brandContrast", "var(--second-")).toBe(
      "var(--second-fg-brand-contrast)",
    );
    expect(lookupToken(tokens, "palette.gray100", "var(--first-")).toBe(
      "var(--first-palette-gray-100)",
    );
    expect(tokens).toEqual({ "fg.brandContrast": 0, "palette.gray100": 0 });
    expect(
      lookupToken({ "fg.brandContrast": "different" }, "fg.brandContrast", "var(--next-"),
    ).toBe("var(--next-different)");
  });

  it("restores variable references and preserves literal tokens", () => {
    expect(expandToken("example", "var(--test-")).toBe("var(--test-example)");
    expect(expandToken(["1.5"], "var(--test-")).toBe("1.5");
    expect(lookupToken({ alias: "example" }, "alias", "var(--test-")).toBe("var(--test-example)");
  });

  it("does not resolve missing or inherited keys", () => {
    expect(lookupToken({ known: "example" }, "unknown", "var(--test-")).toBeUndefined();
    expect(lookupToken({ known: "example" }, "constructor", "var(--test-")).toBeUndefined();
  });
});
