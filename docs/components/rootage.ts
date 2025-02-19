import { AST, buildContext, css, Exchange } from "@seed-design/rootage-core";

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
  switch (lit.kind) {
    case "DimensionLit":
      return lit.unit === "rem"
        ? `${lit.value * 16}px (${css.staticStringifier.value(lit)})`
        : css.staticStringifier.value(lit);
    default:
      return css.staticStringifier.value(lit);
  }
}

export const getRootage = async () => {
  const index: { resources: { path: string }[] } = await import("@/public/rootage/index.json").then(
    (module) => {
      return module.default;
    },
  );
  const sourceFiles = await Promise.all(
    index.resources.map((resource) =>
      import(`@/public/rootage${resource.path}`).then((res: Exchange.Model) => ({
        fileName: resource.path,
        ast: Exchange.fromObject(res),
      })),
    ),
  );
  return buildContext(sourceFiles);
};
