import { AST, css, type RootageCtx } from "@seed-design/rootage-core";

/**
 * Build a modes map covering every token collection, using each collection's
 * first mode as the default (global → default, color → theme-light, motion →
 * preferred, ...). Use this when resolving arbitrary tokens whose collection
 * isn't known ahead of time, so a newly added collection can't break the build.
 */
export function getDefaultModes(
  rootage: Pick<RootageCtx, "tokenCollectionEntities">,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(rootage.tokenCollectionEntities).map(([collection, entity]) => {
      const mode = entity.modes[0];
      if (!mode) throw new Error(`Collection ${collection} has no modes`);

      return [collection, mode.id];
    }),
  );
}

export function stringifyVariants(variants: AST.VariantExpression[]) {
  if (variants.length === 0) {
    return "base";
  }

  return variants.map(({ name, value }) => `${name}=${value}`).join(", ");
}

export function stringifyStates(states: AST.StateExpression[]) {
  return states.map(({ value }) => value).join(", ");
}

export function stringifyTokenLit(token: AST.TokenLit): AST.TokenRef {
  return `$${[...token.group, token.key].join(".")}`;
}

/**
 * A stop/layer colour that is still a token reference after resolution points at the
 * CSS variable `@seed-design/css` emits for it, so the browser applies the live value.
 */
function stringifyColor(color: AST.ColorHexLit | AST.TokenLit): string {
  if (color.kind === "ColorHexLit") return color.value;

  return `var(--seed-${[...color.group, color.key].join("-")})`;
}

const stringifyDimension = (dimension: AST.DimensionLit) => `${dimension.value}${dimension.unit}`;

export function gradientToCss(gradient: AST.GradientLit): string {
  const stops = gradient.stops
    .map((stop) => `${stringifyColor(stop.color)} ${(stop.position.value * 100).toFixed(1)}%`)
    .join(", ");

  return `linear-gradient(to right, ${stops})`;
}

export function shadowToCss(shadow: AST.ShadowLit): string {
  return shadow.layers
    .map(
      (layer) =>
        `${stringifyDimension(layer.offsetX)} ${stringifyDimension(layer.offsetY)} ${stringifyDimension(layer.blur)} ${stringifyDimension(layer.spread)} ${stringifyColor(layer.color)}`,
    )
    .join(", ");
}

export function stringifyValueLit(lit: AST.ValueLit): string {
  const tokenReference = (token: AST.TokenLit) => stringifyTokenLit(token);

  switch (lit.kind) {
    case "DimensionLit":
      return lit.unit === "rem"
        ? `${css.staticStringifier.value(lit, tokenReference)} (${lit.value * 16}px)`
        : css.staticStringifier.value(lit, tokenReference);
    default:
      return css.staticStringifier.value(lit, tokenReference);
  }
}
