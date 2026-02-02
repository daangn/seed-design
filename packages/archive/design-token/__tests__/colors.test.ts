import { describe, it, expect } from "bun:test";

import type { ColorToken, ColorScheme, KnownColorGroup } from "../src";
import { colors, parseColorToken, populateSemanticColors } from "../src";

type ColorStyle = [Token: ColorToken, Value: string];
type ColorStyleMap = Record<KnownColorGroup, ColorStyle>;

function toStyleMap(scheme: ColorScheme) {
  return Object.entries(scheme).reduce((acc, [k, v]) => {
    const [token, group] = parseColorToken(k);
    return {
      ...acc,
      [group]: [...(acc[group] || []), [token, v]],
    };
  }, {} as ColorStyleMap);
}

describe("color scheme", () => {
  it("light", () => {
    expect(toStyleMap(colors.light.scheme)).toMatchSnapshot();
  });

  it("dark", () => {
    expect(toStyleMap(colors.dark.scheme)).toMatchSnapshot();
  });
});

describe("semantic colors", () => {
  it("light", () => {
    expect(
      populateSemanticColors(colors.light.scheme, colors.light.semanticScheme),
    ).toMatchSnapshot();
  });

  it("dark", () => {
    expect(
      populateSemanticColors(colors.dark.scheme, colors.dark.semanticScheme),
    ).toMatchSnapshot();
  });
});

describe("parseColorToken", () => {
  it("validate - should not throw for valid tokens", () => {
    for (const token of Object.keys(colors.light.scheme)) {
      expect(() => parseColorToken(token)).not.toThrow();
    }
  });

  it("invalid values - should throw", () => {
    expect(() => parseColorToken("a")).toThrow();
    expect(() => parseColorToken("1213")).toThrow();
    expect(() => parseColorToken("$asdf123")).toThrow();
  });
});
