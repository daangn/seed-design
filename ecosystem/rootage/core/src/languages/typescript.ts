import { camelCase } from "change-case";
import type {
  ComponentSpecDeclaration,
  StateExpression,
  TokenDeclaration,
  TokenLit,
  VariantExpression,
} from "../parser/ast";
import { createStringifier as createCssStringifier } from "./css";

interface TokenDefinition {
  key: string;
  value: string;
}

interface TokenGroup {
  dir: string;
  code: TokenDefinition[];
}

/**
 * camelCase but preserve underscore between numbers.
 * temporary workaround to avoid x1_5 -> x15
 * @example "color-1_5" -> "color1_5"
 */
function camelCasePreserveUnderscoreBetweenNumbers(input: string) {
  return camelCase(input, {
    mergeAmbiguousCharacters: false,
  })
    .replaceAll(/(\D)_(\d)/g, "$1$2")
    .replaceAll(/(\d)_(\D)/g, "$1$2");
}

function stringifyVariantKey(variants: VariantExpression[]): string {
  const asKebab = variants.map(({ name, value }) => `${name}-${value}`).join("-");

  if (asKebab === "") {
    return "base";
  }

  return camelCase(asKebab, { mergeAmbiguousCharacters: true });
}

function stringifyStateKey(state: StateExpression[]): string {
  return camelCase(state.map((s) => s.value).join("-"));
}

export function createStringifier(options: { prefix?: string } = {}) {
  const cssStringifier = createCssStringifier(options);

  function getComponentSpec(decl: ComponentSpecDeclaration) {
    const body = decl.body;

    const result: Record<string, Record<string, Record<string, Record<string, string>>>> = {};

    for (const variantDecl of body) {
      const variantKey = stringifyVariantKey(variantDecl.variants);
      const variant: Record<string, Record<string, Record<string, string>>> = {};

      for (const stateDecl of variantDecl.body) {
        const stateKey = stringifyStateKey(stateDecl.states);
        const slot: Record<string, Record<string, string>> = {};

        for (const slotDecl of stateDecl.body) {
          const slotKey = slotDecl.slot;
          const property: Record<string, string> = {};

          for (const propertyDecl of slotDecl.body) {
            const propertyKey = propertyDecl.property;
            const expr = propertyDecl.value;

            property[propertyKey] = cssStringifier.valueOrToken(expr);
          }

          slot[slotKey] = property;
        }

        variant[stateKey] = slot;
      }

      result[variantKey] = variant;
    }

    return result;
  }

  function getComponentSpecMjs(decl: ComponentSpecDeclaration) {
    const result = getComponentSpec(decl);
    return `export const vars = ${JSON.stringify(result, null, 2)}`;
  }

  function getComponentSpecDts(decl: ComponentSpecDeclaration) {
    const result = getComponentSpec(decl);
    return `export declare const vars: ${JSON.stringify(result, null, 2)}`;
  }

  function getComponentSpecIndexMjs(decls: ComponentSpecDeclaration[]) {
    const result = decls.map((spec) => {
      return `export { vars as ${camelCase(spec.id, { mergeAmbiguousCharacters: true })} } from "./${spec.id}.mjs";`;
    });

    return result.join("\n");
  }

  function getComponentSpecIndexDts(decls: ComponentSpecDeclaration[]) {
    const result = decls.map((spec) => {
      return `export { vars as ${camelCase(spec.id, { mergeAmbiguousCharacters: true })} } from "./${spec.id}";`;
    });

    return result.join("\n");
  }

  function getTokenGroups(decls: TokenDeclaration[]): TokenGroup[] {
    const tokenExpressions = decls.map((decl) => decl.token);

    const groups: Record<string, TokenLit[]> = {};

    for (const expression of tokenExpressions) {
      for (let i = 0; i < expression.group.length; i++) {
        const group = expression.group.slice(0, i + 1).join("/");
        if (!groups[group]) {
          groups[group] = [];
        }
      }
    }

    for (const expression of tokenExpressions) {
      const group = expression.group.join("/");
      groups[group]!.push(expression);
    }

    return Object.entries(groups).map(([group, expressions]) => {
      const definitions = expressions.map((expression) => {
        const key = camelCasePreserveUnderscoreBetweenNumbers(expression.key);
        const value = cssStringifier.tokenReference(expression);
        return { key, value };
      });

      return {
        dir: group,
        code: definitions,
      };
    });
  }

  function generateTokenCode(
    groups: TokenGroup[],
    isDeclaration: boolean,
  ): { path: string; code: string }[] {
    return groups.map(({ dir, code }) => {
      const definitions = code
        .map(({ key, value }) => {
          const exportKeyword = isDeclaration ? "export declare const" : "export const";
          return `${exportKeyword} ${key} = "${value}";`;
        })
        .join("\n");

      const reExports = groups
        .filter(
          (g) =>
            g.dir.startsWith(`${dir}/`) && g.dir.split("/").length === dir.split("/").length + 1,
        )
        .map((g) => {
          const isTargetNested = groups.some((x) => x.dir.startsWith(`${g.dir}/`));
          const name = g.dir.replace(`${dir}/`, "");
          const relativePath = isTargetNested ? `${name}/index` : name;
          return `export * as ${camelCase(name)} from "./${isDeclaration ? name : `${relativePath}.mjs`}";`;
        })
        .join("\n");

      const path = isDeclaration
        ? reExports
          ? `${dir}/index.d.ts`
          : `${dir}.d.ts`
        : reExports
          ? `${dir}/index.mjs`
          : `${dir}.mjs`;

      return {
        path,
        code: [definitions, reExports].filter(Boolean).join("\n\n"),
      };
    });
  }

  function getTokenMjs(decls: TokenDeclaration[]): { path: string; code: string }[] {
    const groups = getTokenGroups(decls);
    return generateTokenCode(groups, false);
  }

  function getTokenDts(decls: TokenDeclaration[]): { path: string; code: string }[] {
    const groups = getTokenGroups(decls);
    return generateTokenCode(groups, true);
  }

  return {
    getComponentSpecMjs,
    getComponentSpecDts,
    getComponentSpecIndexMjs,
    getComponentSpecIndexDts,
    getTokenMjs,
    getTokenDts,
  };
}
