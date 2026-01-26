import type {
  ColorHexLit,
  CubicBezierLit,
  DimensionLit,
  DurationLit,
  GradientLit,
  GradientStopLit,
  NumberLit,
  ShadowLayerLit,
  ShadowLit,
  TokenLit,
} from "../ast";
import * as factory from "../factory";
import type * as Document from "./types";
import { isTokenRef } from "./is-token-ref";

/* ------------------------------------------------------------------
   Value -> AST "literal" or token reference
   Helpers below parse each type of Document.Value
   into the corresponding AST node via the factory functions.
   ------------------------------------------------------------------ */

/**
 * Main entry point for property/mode values (Document.Value or tokenRef string).
 * If it's a token string ("$..."), we create a TokenLit. Otherwise,
 * we call the specialized parse function based on value.type.
 */
export function parseValue(
  v: Document.Value | string,
):
  | ColorHexLit
  | DimensionLit
  | DurationLit
  | NumberLit
  | CubicBezierLit
  | ShadowLit
  | GradientLit
  | TokenLit {
  if (typeof v === "string") {
    // It's a token reference
    return factory.createTokenLit(v);
  }

  // Otherwise, it's a Document.Value
  switch (v.type) {
    case "color":
      return parseColorValue(v);
    case "dimension":
      return parseDimensionValue(v);
    case "number":
      return parseNumberValue(v);
    case "duration":
      return parseDurationValue(v);
    case "cubicBezier":
      return parseCubicBezierValue(v);
    case "shadow":
      return parseShadowValue(v);
    case "gradient":
      return parseGradientValue(v);
  }
}

/* ------------------ Color ------------------ */

export function parseColorValue(colorVal: Document.Color): ColorHexLit | TokenLit {
  const c = colorVal.value;
  if (isTokenRef(c)) {
    // It's a token reference
    return factory.createTokenLit(c);
  }
  // Otherwise c is `#...`
  return factory.createColorHexLit(c as `#${string}`);
}

/* ------------------ Dimension ------------------ */

export function parseDimensionValue(dimVal: Document.Dimension): DimensionLit | TokenLit {
  const d = dimVal.value;
  if (isTokenRef(d)) {
    return factory.createTokenLit(d);
  }
  // Otherwise d is { value: number, unit: "px"|"rem" }
  return factory.createDimensionLit(d.value, d.unit);
}

/* ------------------ Number ------------------ */

export function parseNumberValue(numVal: Document.Number): NumberLit | TokenLit {
  const n = numVal.value;
  if (typeof n === "string" && n.startsWith("$")) {
    return factory.createTokenLit(n);
  }
  return factory.createNumberLit(n as number);
}

/* ------------------ Duration ------------------ */

export function parseDurationValue(durVal: Document.Duration): DurationLit | TokenLit {
  const d = durVal.value;
  if (isTokenRef(d)) {
    return factory.createTokenLit(d);
  }
  return factory.createDurationLit(d.value, d.unit);
}

/* ------------------ CubicBezier ------------------ */

export function parseCubicBezierValue(cbVal: Document.CubicBezier): CubicBezierLit | TokenLit {
  const c = cbVal.value;
  if (isTokenRef(c)) {
    return factory.createTokenLit(c);
  }
  // otherwise it's an array of [n1,n2,n3,n4]
  return factory.createCubicBezierLit(c as [number, number, number, number]);
}

/* ------------------ Shadow ------------------ */

export function parseShadowValue(shVal: Document.Shadow): ShadowLit | TokenLit {
  const s = shVal.value;
  if (isTokenRef(s)) {
    return factory.createTokenLit(s);
  }
  // Otherwise it's an array of shadow layers
  const layers = (s as Document.ShadowLayer[]).map(parseShadowLayer);
  return factory.createShadowLit(layers);
}

export function parseShadowLayer(layer: Document.ShadowLayer): ShadowLayerLit {
  const colorLit = parseColorValue({ type: "color", value: layer.color });
  const offsetXLit = parseDimensionValue({
    type: "dimension",
    value: layer.offsetX,
  });
  const offsetYLit = parseDimensionValue({
    type: "dimension",
    value: layer.offsetY,
  });
  const blurLit = parseDimensionValue({ type: "dimension", value: layer.blur });
  const spreadLit = parseDimensionValue({
    type: "dimension",
    value: layer.spread,
  });

  return factory.createShadowLayerLit(
    colorLit,
    offsetXLit as DimensionLit,
    offsetYLit as DimensionLit,
    blurLit as DimensionLit,
    spreadLit as DimensionLit,
  );
}

/* ------------------ Gradient ------------------ */

export function parseGradientValue(grVal: Document.Gradient): GradientLit | TokenLit {
  const g = grVal.value;
  if (isTokenRef(g)) {
    return factory.createTokenLit(g);
  }
  // Otherwise it's an array of gradient stops
  const stops = (g as Document.GradientStop[]).map(parseGradientStop);
  return factory.createGradientLit(stops);
}

export function parseGradientStop(stop: Document.GradientStop): GradientStopLit {
  const colorLit = parseColorValue({ type: "color", value: stop.color });
  const positionLit = parseNumberValue({ type: "number", value: stop.position });
  return factory.createGradientStopLit(colorLit, positionLit as NumberLit);
}
