import { expect, test, describe } from "bun:test";
import { factory } from "../parser";
import { getTailwind4CompleteThemeCode } from "./tailwind4";

describe("getTailwind4CompleteThemeCode", () => {
  describe("Gradient with TokenLit", () => {
    test("should use sourcePrefix for TokenLit references in gradient", () => {
      const tokens = [
        factory.createGradientTokenDeclaration("color", factory.createTokenLit("$gradient.test"), [
          {
            kind: "GradientTokenValueDeclaration",
            mode: "theme-light",
            value: factory.createGradientLit([
              factory.createGradientStopLit(
                factory.createTokenLit("$color.palette.black"),
                factory.createNumberLit(0),
              ),
              factory.createGradientStopLit(
                factory.createTokenLit("$color.palette.white"),
                factory.createNumberLit(1),
              ),
            ]),
          },
        ]),
      ];

      const result = getTailwind4CompleteThemeCode(tokens, [], {
        prefix: "custom",
        sourcePrefix: "seed",
      });

      expect(result).toContain("var(--seed-color-palette-black)");
      expect(result).toContain("var(--seed-color-palette-white)");
      expect(result).not.toContain("var(--custom-color-palette-black)");
    });

    test("should handle mixed ColorHexLit and TokenLit in gradient", () => {
      const tokens = [
        factory.createGradientTokenDeclaration("color", factory.createTokenLit("$gradient.mixed"), [
          {
            kind: "GradientTokenValueDeclaration",
            mode: "theme-light",
            value: factory.createGradientLit([
              factory.createGradientStopLit(
                factory.createColorHexLit("#FF0000"),
                factory.createNumberLit(0),
              ),
              factory.createGradientStopLit(
                factory.createTokenLit("$color.palette.blue"),
                factory.createNumberLit(1),
              ),
            ]),
          },
        ]),
      ];

      const result = getTailwind4CompleteThemeCode(tokens, [], {
        sourcePrefix: "seed",
      });

      expect(result).toContain("#FF0000");
      expect(result).toContain("var(--seed-color-palette-blue)");
    });

    test("should generate directional gradient utilities", () => {
      const tokens = [
        factory.createGradientTokenDeclaration("color", factory.createTokenLit("$gradient.brand"), [
          {
            kind: "GradientTokenValueDeclaration",
            mode: "theme-light",
            value: factory.createGradientLit([
              factory.createGradientStopLit(
                factory.createColorHexLit("#FF6600"),
                factory.createNumberLit(0),
              ),
              factory.createGradientStopLit(
                factory.createColorHexLit("#FF9A56"),
                factory.createNumberLit(1),
              ),
            ]),
          },
        ]),
      ];

      const result = getTailwind4CompleteThemeCode(tokens, []);

      expect(result).toContain("brand-to-t");
      expect(result).toContain("brand-to-r");
      expect(result).toContain("brand-to-b");
      expect(result).toContain("brand-to-l");
      expect(result).toContain("brand-to-tr");
      expect(result).toContain("brand-to-br");
      expect(result).toContain("brand-to-bl");
      expect(result).toContain("brand-to-tl");
    });

    test("should generate arbitrary gradient utilities", () => {
      const tokens = [
        factory.createGradientTokenDeclaration(
          "color",
          factory.createTokenLit("$gradient.custom"),
          [
            {
              kind: "GradientTokenValueDeclaration",
              mode: "theme-light",
              value: factory.createGradientLit([
                factory.createGradientStopLit(
                  factory.createColorHexLit("#000000"),
                  factory.createNumberLit(0),
                ),
                factory.createGradientStopLit(
                  factory.createColorHexLit("#FFFFFF"),
                  factory.createNumberLit(1),
                ),
              ]),
            },
          ],
        ),
      ];

      const result = getTailwind4CompleteThemeCode(tokens, []);

      expect(result).toContain("@utility bg-gradient-custom-*");
    });
  });

  describe("Prefix handling", () => {
    test("should use sourcePrefix for referencing original tokens", () => {
      const tokens = [
        factory.createColorTokenDeclaration("color", factory.createTokenLit("$color.bg.primary"), [
          {
            kind: "ColorTokenValueDeclaration",
            mode: "theme-light",
            value: factory.createColorHexLit("#FFFFFF"),
          },
        ]),
      ];

      const result = getTailwind4CompleteThemeCode(tokens, [], {
        prefix: "custom",
        sourcePrefix: "seed",
      });

      expect(result).toContain("--seed-color-bg-primary");
      expect(result).toContain("--custom-color-bg-primary");
    });

    test("should work with empty prefixes", () => {
      const tokens = [
        factory.createColorTokenDeclaration("color", factory.createTokenLit("$color.bg.primary"), [
          {
            kind: "ColorTokenValueDeclaration",
            mode: "theme-light",
            value: factory.createColorHexLit("#FFFFFF"),
          },
        ]),
      ];

      const result = getTailwind4CompleteThemeCode(tokens, []);

      expect(result).toContain("--color-bg-primary");
    });
  });

  describe("Color tokens", () => {
    test("should process color tokens correctly", () => {
      const tokens = [
        factory.createColorTokenDeclaration("color", factory.createTokenLit("$color.fg.brand"), [
          {
            kind: "ColorTokenValueDeclaration",
            mode: "theme-light",
            value: factory.createColorHexLit("#FF6600"),
          },
        ]),
      ];

      const result = getTailwind4CompleteThemeCode(tokens, []);

      expect(result).toContain("--color-fg-brand");
    });
  });
});
