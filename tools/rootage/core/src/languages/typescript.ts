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

  function getComponentSpecCjs(decl: ComponentSpecDeclaration) {
    const result = getComponentSpec(decl);
    return `const vars = ${JSON.stringify(result, null, 2)}\n\nmodule.exports = { vars };`;
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

  function getComponentSpecIndexCjs(decls: ComponentSpecDeclaration[]) {
    const result = decls.map((spec) => {
      const varName = camelCase(spec.id, { mergeAmbiguousCharacters: true });
      return `const { vars: ${varName} } = require("./${spec.id}.cjs");`;
    });
    return `${result.join("\n")}\n\nmodule.exports = { ${decls.map((spec) => camelCase(spec.id, { mergeAmbiguousCharacters: true })).join(", ")} };`;
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
    format: "mjs" | "cjs" | "dts",
  ): { path: string; code: string }[] {
    return groups.map(({ dir, code }) => {
      const definitions = code
        .map(({ key, value }) => {
          if (format === "dts") {
            return `export declare const ${key} = "${value}";`;
          }
          if (format === "mjs") {
            return `export const ${key} = "${value}";`;
          }
          if (format === "cjs") {
            return `const ${key} = "${value}";`;
          }
          throw new Error(`Unsupported format: ${format}`);
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
          const camelName = camelCase(name);
          const relativePath = isTargetNested ? `${name}/index` : name;

          if (format === "mjs") {
            return `export * as ${camelName} from "./${relativePath}.mjs";`;
          }
          if (format === "cjs") {
            return `const ${camelName} = require("./${relativePath}.cjs");`;
          }

          // dts
          return `export * as ${camelName} from "./${name}";`;
        })
        .join("\n");

      const exports =
        format === "cjs" && (code.length > 0 || reExports)
          ? `\nmodule.exports = { ${[
              ...code.map(({ key }) => key),
              ...groups
                .filter(
                  (g) =>
                    g.dir.startsWith(`${dir}/`) &&
                    g.dir.split("/").length === dir.split("/").length + 1,
                )
                .map((g) => camelCase(g.dir.replace(`${dir}/`, ""))),
            ].join(", ")} };`
          : "";

      const extension =
        format === "dts"
          ? reExports
            ? `${dir}/index.d.ts`
            : `${dir}.d.ts`
          : reExports
            ? `${dir}/index.${format}`
            : `${dir}.${format}`;

      return {
        path: extension,
        code: [definitions, reExports, exports].filter(Boolean).join("\n\n"),
      };
    });
  }

  function getTokenCjs(decls: TokenDeclaration[]): { path: string; code: string }[] {
    const groups = getTokenGroups(decls);
    return generateTokenCode(groups, "cjs");
  }

  function getTokenMjs(decls: TokenDeclaration[]): { path: string; code: string }[] {
    const groups = getTokenGroups(decls);
    return generateTokenCode(groups, "mjs");
  }

  function getTokenDts(decls: TokenDeclaration[]): { path: string; code: string }[] {
    const groups = getTokenGroups(decls);
    return generateTokenCode(groups, "dts");
  }

  return {
    getComponentSpecMjs,
    getComponentSpecCjs,
    getComponentSpecDts,
    getComponentSpecIndexMjs,
    getComponentSpecIndexCjs,
    getComponentSpecIndexDts,
    getTokenMjs,
    getTokenCjs,
    getTokenDts,
  };
}
