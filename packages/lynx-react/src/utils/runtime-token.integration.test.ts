import { describe, expect, it } from "vitest";
import { vars } from "@seed-design/lynx-css/vars";
import * as runtime from "@seed-design/lynx-css/vars/runtime";
import { lookupToken } from "./runtime-token";

type TokenTree = { readonly [key: string]: string | TokenTree };

function flatten(tree: TokenTree, path = ""): Record<string, string> {
  return Object.fromEntries(
    Object.entries(tree).flatMap(([key, value]) => {
      const name = path ? `${path}.${key}` : key;
      return typeof value === "string" ? [[name, value]] : Object.entries(flatten(value, name));
    }),
  );
}

describe("React runtime lookup integration with installed CSS tokens", () => {
  for (const [name, source, prefix] of [
    ["colorTokens", vars.$color, "var(--seed-color-"],
    ["dimensionTokens", vars.$dimension, "var(--seed-dimension-"],
    ["radiusTokens", vars.$radius, "var(--seed-radius-"],
    ["fontSizeTokens", vars.$fontSize, "var(--seed-font-size-"],
    ["fontWeightTokens", vars.$fontWeight, "var(--seed-font-weight-"],
    ["lineHeightTokens", vars.$lineHeight, "var(--seed-line-height-"],
  ] as const) {
    it(`resolves every ${name} value exactly before and after caching`, () => {
      const expected = flatten(source);
      for (let pass = 0; pass < 2; pass++) {
        expect(
          Object.fromEntries(
            Object.keys(expected).map((key) => [key, lookupToken(runtime[name], key, prefix)]),
          ),
        ).toEqual(expected);
      }
    });
  }
});
