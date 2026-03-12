import { describe, expect, it } from "bun:test";
import * as factory from "../factory";
import type * as Document from "./types";
import { parseValue } from "./value";

describe("parseValue", () => {
  it("should parse a 24bit hex color value", () => {
    const colorValue: Document.Color = { type: "color", value: "#ff0000" };
    const result = parseValue(colorValue);
    expect(result).toEqual(factory.createColorHexLit("#ff0000"));
  });

  it("should parse a 24+8bit hex color value", () => {
    const colorValue: Document.Color = { type: "color", value: "#ff0000ff" };
    const result = parseValue(colorValue);
    expect(result).toEqual(factory.createColorHexLit("#ff0000ff"));
  });

  it("should parse a dimension value", () => {
    const dimensionValue: Document.Dimension = {
      type: "dimension",
      value: { value: 10, unit: "px" },
    };
    const result = parseValue(dimensionValue);
    expect(result).toEqual(factory.createDimensionLit(10, "px"));
  });

  it("should parse a number value", () => {
    const numberValue: Document.Number = { type: "number", value: 42 };
    const result = parseValue(numberValue);
    expect(result).toEqual(factory.createNumberLit(42));
  });

  it("should parse a duration value", () => {
    const durationValue: Document.Duration = {
      type: "duration",
      value: { value: 300, unit: "ms" },
    };
    const result = parseValue(durationValue);
    expect(result).toEqual(factory.createDurationLit(300, "ms"));
  });

  it("should parse a cubicBezier value", () => {
    const cubicBezierValue: Document.CubicBezier = {
      type: "cubicBezier",
      value: [0.25, 0.1, 0.25, 1.0],
    };
    const result = parseValue(cubicBezierValue);
    expect(result).toEqual(factory.createCubicBezierLit([0.25, 0.1, 0.25, 1.0]));
  });

  it("should parse a shadow value", () => {
    const shadowValue: Document.Shadow = {
      type: "shadow",
      value: [
        {
          color: "#000000",
          offsetX: { value: 5, unit: "px" },
          offsetY: { value: 5, unit: "px" },
          blur: { value: 10, unit: "px" },
          spread: { value: 0, unit: "px" },
        },
      ],
    };
    const result = parseValue(shadowValue);
    expect(result).toEqual(
      factory.createShadowLit([
        factory.createShadowLayerLit(
          factory.createColorHexLit("#000000"),
          factory.createDimensionLit(5, "px"),
          factory.createDimensionLit(5, "px"),
          factory.createDimensionLit(10, "px"),
          factory.createDimensionLit(0, "px"),
        ),
      ]),
    );
  });

  it("should parse a gradient value", () => {
    const gradientValue: Document.Gradient = {
      type: "gradient",
      value: [
        { color: "#ff0000", position: 0 },
        { color: "#00ff00", position: 1 },
      ],
    };
    const result = parseValue(gradientValue);
    expect(result).toEqual(
      factory.createGradientLit([
        factory.createGradientStopLit(
          factory.createColorHexLit("#ff0000"),
          factory.createNumberLit(0),
        ),
        factory.createGradientStopLit(
          factory.createColorHexLit("#00ff00"),
          factory.createNumberLit(1),
        ),
      ]),
    );
  });

  it("should parse a token reference string", () => {
    const tokenRef = "$colors.primary";
    const result = parseValue(tokenRef);
    expect(result).toEqual(factory.createTokenLit("$colors.primary"));
  });
});
