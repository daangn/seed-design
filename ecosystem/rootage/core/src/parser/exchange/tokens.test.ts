import { describe, expect, it } from "bun:test";
import * as factory from "../factory";
import type { TokensData } from "./types";
import { parseTokenDeclarations } from "./tokens";

describe("parseTokenDeclarations", () => {
  it("should parse token model", () => {
    const input: TokensData = {
      collection: "collection",
      tokens: {
        "$color.palette.gray-00": {
          values: {
            light: {
              type: "color",
              value: "#ffffff",
            },
            dark: {
              type: "color",
              value: "#000000",
            },
          },
        },
        "$color.bg.layer-1": {
          values: {
            light: {
              type: "color",
              value: "$color.palette.gray-00",
            },
            dark: {
              type: "color",
              value: "$color.palette.gray-00",
            },
          },
        },
      },
    };

    const result = parseTokenDeclarations(input);

    expect(result).toEqual([
      factory.createColorTokenDeclaration(
        "collection",
        factory.createTokenLit("$color.palette.gray-00"),
        [
          factory.createColorTokenValueDeclaration("light", factory.createColorHexLit("#ffffff")),
          factory.createColorTokenValueDeclaration("dark", factory.createColorHexLit("#000000")),
        ],
      ),
      factory.createColorTokenDeclaration(
        "collection",
        factory.createTokenLit("$color.bg.layer-1"),
        [
          factory.createColorTokenValueDeclaration(
            "light",
            factory.createTokenLit("$color.palette.gray-00"),
          ),
          factory.createColorTokenValueDeclaration(
            "dark",
            factory.createTokenLit("$color.palette.gray-00"),
          ),
        ],
      ),
    ]);
  });

  it("should parse token model with description", () => {
    const input: TokensData = {
      collection: "collection",
      tokens: {
        "$color.palette.gray-00": {
          description: "Gray color 0",
          values: {
            light: {
              type: "color",
              value: "#ffffff",
            },
            dark: {
              type: "color",
              value: "#000000",
            },
          },
        },
        "$color.bg.layer-1": {
          description: "Default background color",
          values: {
            light: {
              type: "color",
              value: "$color.palette.gray-00",
            },
            dark: {
              type: "color",
              value: "$color.palette.gray-00",
            },
          },
        },
      },
    };

    const result = parseTokenDeclarations(input);

    expect(result).toEqual([
      factory.createColorTokenDeclaration(
        "collection",
        factory.createTokenLit("$color.palette.gray-00"),
        [
          factory.createColorTokenValueDeclaration("light", factory.createColorHexLit("#ffffff")),
          factory.createColorTokenValueDeclaration("dark", factory.createColorHexLit("#000000")),
        ],
        "Gray color 0",
      ),
      factory.createColorTokenDeclaration(
        "collection",
        factory.createTokenLit("$color.bg.layer-1"),
        [
          factory.createColorTokenValueDeclaration(
            "light",
            factory.createTokenLit("$color.palette.gray-00"),
          ),
          factory.createColorTokenValueDeclaration(
            "dark",
            factory.createTokenLit("$color.palette.gray-00"),
          ),
        ],
        "Default background color",
      ),
    ]);
  });
});
