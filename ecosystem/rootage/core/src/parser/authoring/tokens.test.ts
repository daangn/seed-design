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
            light: "#ffffff",
            dark: "#000000",
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
    ]);
  });

  it("should parse token model with alias", () => {
    const input: TokensData = {
      collection: "collection",
      tokens: {
        "$color.palette.gray-00": {
          values: {
            light: "#ffffff",
            dark: "#000000",
          },
        },
        "$color.bg.layer-1": {
          values: {
            light: "$color.palette.gray-00",
            dark: "$color.palette.gray-00",
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
      factory.createUnresolvedTokenDeclaration(
        "collection",
        factory.createTokenLit("$color.bg.layer-1"),
        [
          factory.createUnresolvedTokenValueDeclaration(
            "light",
            factory.createTokenLit("$color.palette.gray-00"),
          ),
          factory.createUnresolvedTokenValueDeclaration(
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
            light: "#ffffff",
            dark: "#000000",
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
    ]);
  });

  it("should parse token model with haptic values", () => {
    const input: TokensData = {
      collection: "global",
      tokens: {
        "$haptic.primitive.sharp-weak": {
          values: {
            default: { type: "haptic", value: { sharpness: 0.9, intensity: 0.3 } },
          },
        },
        "$haptic.preset.success": {
          values: {
            default: { type: "haptic", value: { system: "success" } },
          },
        },
      },
    };

    const result = parseTokenDeclarations(input);

    expect(result).toEqual([
      factory.createHapticTokenDeclaration(
        "global",
        factory.createTokenLit("$haptic.primitive.sharp-weak"),
        [
          factory.createHapticTokenValueDeclaration(
            "default",
            factory.createHapticLit({ sharpness: 0.9, intensity: 0.3 }),
          ),
        ],
      ),
      factory.createHapticTokenDeclaration(
        "global",
        factory.createTokenLit("$haptic.preset.success"),
        [
          factory.createHapticTokenValueDeclaration(
            "default",
            factory.createHapticLit({ system: "success" }),
          ),
        ],
      ),
    ]);
  });
});
