import { generateTokenRules, type Theme } from "@seed-design/qvism-core";

const tokenReferencePattern = /var\((--[\w\\.-]+)\)/g;

function resolveDeclarations(declarations: Map<string, string>): Map<string, string> {
  const resolved = new Map<string, string>();
  const resolving = new Set<string>();

  function resolveProperty(property: string): string {
    const cached = resolved.get(property);
    if (cached !== undefined) return cached;

    const value = declarations.get(property);
    if (value === undefined) return `var(${property})`;
    if (resolving.has(property)) {
      throw new Error(`Circular CSS variable reference: ${property}`);
    }

    resolving.add(property);
    const resolvedValue = value.replace(
      tokenReferencePattern,
      (_reference, referencedProperty: string) => resolveProperty(referencedProperty),
    );
    resolving.delete(property);
    resolved.set(property, resolvedValue);

    return resolvedValue;
  }

  for (const property of declarations.keys()) {
    resolveProperty(property);
  }

  return resolved;
}

export function resolveTokenReferences(tokens: Theme["tokens"]): Theme["tokens"] {
  const rules = generateTokenRules(tokens);
  let rootDeclarations = new Map<string, string>();

  for (const node of rules) {
    if (node.type !== "rule") continue;

    const declarations = new Map(rootDeclarations);
    node.walkDecls((declaration) => {
      if (declaration.prop.startsWith("--")) {
        declarations.set(declaration.prop, declaration.value);
      }
    });

    const resolved = resolveDeclarations(declarations);
    node.walkDecls((declaration) => {
      if (declaration.prop.startsWith("--")) {
        declaration.value = resolved.get(declaration.prop) ?? declaration.value;
      }
    });

    if (node.selectors.includes(":root")) {
      rootDeclarations = resolved;
    }
  }

  return {
    _raw: rules.map((node) => node.toString()).join("\n\n"),
  };
}
