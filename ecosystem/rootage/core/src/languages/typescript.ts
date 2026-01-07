import { camelCase } from "change-case";
import type {
  ComponentSpecDeclaration,
  StateExpression,
  TokenDeclaration,
  VariantExpression,
} from "../parser/ast";
import { createStringifier as createCssStringifier } from "./css";

interface TokenDefinition {
  key: string;
  value: string;
  description?: string;
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

    // Build variant value description lookup: variantName -> valueName -> description
    const variantValueDescLookup = new Map<string, Map<string, string>>();
    for (const variant of decl.schema.variants) {
      const valueDescMap = new Map<string, string>();

      for (const value of variant.values) {
        if (value.description === undefined) continue;

        valueDescMap.set(value.name, value.description);
      }

      if (valueDescMap.size === 0) continue;

      variantValueDescLookup.set(variant.name, valueDescMap);
    }

    // Build variant key -> descriptions map from actual variant declarations
    const variantKeyDescMap = new Map<string, string[]>();
    for (const variantDecl of decl.body) {
      const variantKey = stringifyVariantKey(variantDecl.variants);
      const descriptions: string[] = [];

      const isCompound = variantDecl.variants.length > 1;

      for (const variant of variantDecl.variants) {
        const valueDescMap = variantValueDescLookup.get(variant.name);
        const desc = valueDescMap?.get(variant.value);

        if (!desc) continue;

        if (isCompound) {
          descriptions.push(`- \`${variant.name}=${variant.value}\`: ${desc}`);

          continue;
        }

        descriptions.push(desc);
      }

      if (descriptions.length === 0) continue;

      variantKeyDescMap.set(variantKey, descriptions);
    }

    // Slot descriptions
    const slotDescMap = new Map<string, string>();
    for (const slot of decl.schema.slots) {
      if (!slot.description) continue;

      slotDescMap.set(slot.name, slot.description);
    }

    // Property descriptions
    const propertyDescMap = new Map<string, string>();
    for (const slot of decl.schema.slots) {
      for (const prop of slot.properties) {
        if (!prop.description) continue;

        propertyDescMap.set(prop.name, prop.description);
      }
    }

    let json = JSON.stringify(result, null, 2);

    // Add JSDoc for variant keys (indent: 2 spaces)
    for (const [key, descriptions] of variantKeyDescMap) {
      const jsdoc = `/**\n   * ${descriptions.join("\n   * ")}\n   */`;
      json = json.replaceAll(`"${key}":`, `${jsdoc}\n  "${key}":`);
    }

    // Add JSDoc for slots (indent: 6 spaces)
    for (const [key, desc] of slotDescMap) {
      json = json.replaceAll(`"${key}":`, `/** ${desc} */\n      "${key}":`);
    }

    // Add JSDoc for properties (indent: 8 spaces)
    for (const [key, desc] of propertyDescMap) {
      json = json.replaceAll(`"${key}":`, `/** ${desc} */\n        "${key}":`);
    }

    return `export declare const vars: ${json}`;
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
    const groups: Record<string, TokenDeclaration[]> = {};

    // Initialize all groups (including parent groups)
    for (const decl of decls) {
      for (let i = 0; i < decl.token.group.length; i++) {
        const group = decl.token.group.slice(0, i + 1).join("/");
        if (!groups[group]) {
          groups[group] = [];
        }
      }
    }

    // Add declarations to their groups
    for (const decl of decls) {
      const group = decl.token.group.join("/");
      groups[group]!.push(decl);
    }

    return Object.entries(groups).map(([group, groupDecls]) => {
      const definitions = groupDecls.map((decl) => {
        const key = camelCasePreserveUnderscoreBetweenNumbers(decl.token.key);

        if (key.match(/^\d/)) {
          throw new Error(`Token key cannot start with a number: ${decl.token.key}`);
        }

        const value = cssStringifier.tokenReference(decl.token);

        return { key, value, description: decl.description };
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
        .map(({ key, value, description }) => {
          const exportKeyword = isDeclaration ? "export declare const" : "export const";
          const jsdoc = isDeclaration && description ? `/** ${description} */\n` : "";
          return `${jsdoc}${exportKeyword} ${key} = "${value}";`;
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
