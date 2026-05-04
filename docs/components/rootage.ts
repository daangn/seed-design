import { AST, css } from "@seed-design/rootage-core";

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
