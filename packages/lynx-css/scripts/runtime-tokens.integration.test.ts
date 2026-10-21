import { describe, expect, it } from "bun:test";
import { vars } from "@seed-design/lynx-css/vars";
import { vars as typography } from "@seed-design/lynx-css/vars/component/typography";
import * as generated from "@seed-design/lynx-css/vars/runtime";
import { typographyTokens, type EncodedToken } from "@seed-design/lynx-css/vars/runtime";
import {
  compactTokens,
  compactTypography,
  deriveTokenSuffix,
  type TokenTree,
} from "./runtime-tokens";

function expandToken(token: EncodedToken, prefix: string) {
  return typeof token === "string" ? `${prefix}${token})` : token[0];
}

function flatten(tree: TokenTree, path = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tree).flatMap(([key, value]) => {
      const name = path ? `${path}.${key}` : key;
      return typeof value === "string" ? [[name, value]] : Object.entries(flatten(value, name));
    }),
  );
}

describe("generated runtime token parity with public CSS exports", () => {
  for (const [name, source, prefix] of [
    ["colorTokens", vars.$color, "var(--seed-color-"],
    ["dimensionTokens", vars.$dimension, "var(--seed-dimension-"],
    ["radiusTokens", vars.$radius, "var(--seed-radius-"],
    ["fontSizeTokens", vars.$fontSize, "var(--seed-font-size-"],
    ["fontWeightTokens", vars.$fontWeight, "var(--seed-font-weight-"],
    ["lineHeightTokens", vars.$lineHeight, "var(--seed-line-height-"],
  ] as const) {
    it(`preserves every ${name} value and detects stale generated data`, () => {
      expect(generated[name]).toEqual(compactTokens(source, prefix));
      const expected = flatten(source);
      expect(
        Object.fromEntries(
          Object.keys(expected).map((key) => {
            const token = generated[name][key]!;
            return [key, expandToken(token === 0 ? deriveTokenSuffix(key) : token, prefix)];
          }),
        ),
      ).toEqual(expected);
    });
  }

  it("preserves every typography style and detects stale generated data", () => {
    expect(typographyTokens).toEqual(compactTypography(typography));
    const actual = Object.fromEntries(
      Object.entries(typographyTokens).map(([key, [fontSize, lineHeight, fontWeight]]) => [
        `textStyle${key}`,
        {
          enabled: {
            root: {
              fontSize: expandToken(fontSize, "var(--seed-font-size-"),
              lineHeight: expandToken(lineHeight, "var(--seed-line-height-"),
              fontWeight: expandToken(fontWeight, "var(--seed-font-weight-"),
            },
          },
        },
      ]),
    );
    expect(actual).toEqual(typography);
  });
});
