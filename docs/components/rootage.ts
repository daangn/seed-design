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

/**
 * Get rootage metadata for a specific component
 */
export async function getRootageMetadata(componentId: string) {
  const rootage = await getRootage();
  const sourceFile = rootage.sourceFiles.find(
    (f) => f.ast.kind === "ComponentSpecDocument" && f.ast.data.id === componentId,
  );

  if (!sourceFile?.ast.metadata) return null;

  const deprecatedField = sourceFile.ast.metadata.fields.find(
    (field) => field.key === "deprecated",
  );
  const experimentalField = sourceFile.ast.metadata.fields.find(
    (field) => field.key === "experimental",
  );

  return {
    deprecated: Boolean(deprecatedField?.value),
    deprecatedMessage: typeof deprecatedField?.value === "string" ? deprecatedField.value : null,
    experimental: Boolean(experimentalField?.value),
    experimentalMessage: null,
  };
}

export async function getComponentStatus(
  params: { slug?: string[] },
  pageData?: { deprecated?: string; experimental?: boolean },
) {
  const result = {
    deprecated: false,
    deprecatedMessage: null as string | null,
    experimental: false,
    experimentalMessage: null as string | null,
  };

  if (pageData?.deprecated) {
    result.deprecated = true;
    result.deprecatedMessage = pageData.deprecated;
  }

  if (pageData?.experimental) {
    result.experimental = true;
    result.experimentalMessage = null;
  }

  const componentId = params.slug?.[1];
  if (componentId && params.slug?.[0] === "components") {
    const metadata = await getRootageMetadata(componentId);
    if (metadata) {
      if (metadata.deprecated) {
        result.deprecated = true;
        result.deprecatedMessage = metadata.deprecatedMessage;
      }
      if (metadata.experimental) {
        result.experimental = true;
        result.experimentalMessage = null;
      }
    }
  }

  return result;
}
