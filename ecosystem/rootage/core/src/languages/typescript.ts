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

/**
 * `rest` names the rule that constrains no state — the values in force whatever
 * is going on. It is deliberately not `enabled`: those values apply while the
 * component is disabled too, and only get overridden there.
 */
function stringifyStateKey(states: StateExpression[]): string {
  if (states.length === 0) {
    return "rest";
  }

  return camelCase(states.map((s) => s.value).join("-"));
}

export function createStringifier(options: { prefix?: string } = {}) {
  const cssStringifier = createCssStringifier(options);

  function getComponentSpec(decl: ComponentSpecDeclaration) {
    const result: Record<string, Record<string, Record<string, Record<string, string>>>> = {};

    for (const rule of decl.rules) {
      const slot: Record<string, Record<string, string>> = {};

      for (const slotDecl of rule.body) {
        const property: Record<string, string> = {};

        for (const propertyDecl of slotDecl.body) {
          // An enum records a design decision rather than a value CSS can
          // consume, so it never becomes a custom property.
          if (propertyDecl.value.kind === "EnumLit") continue;

          property[propertyDecl.property] = cssStringifier.valueOrToken(propertyDecl.value);
        }

        // A slot holding nothing but enums, or a rule left with no slots, would
        // publish an empty object where consumers expect values.
        if (Object.keys(property).length === 0) continue;

        slot[slotDecl.slot] = property;
      }

      if (Object.keys(slot).length === 0) continue;

      const variant = (result[stringifyVariantKey(rule.variants)] ??= {});
      variant[stringifyStateKey(rule.states)] = slot;
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
    for (const rule of decl.rules) {
      const variantKey = stringifyVariantKey(rule.variants);
      if (variantKeyDescMap.has(variantKey)) continue;

      const descriptions: string[] = [];

      const isCompound = rule.variants.length > 1;

      for (const variant of rule.variants) {
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

const INDENT = "  ";

function stringifyLiteralType(value: unknown, depth: number): string {
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  const pad = INDENT.repeat(depth);
  const padInner = INDENT.repeat(depth + 1);

  if (Array.isArray(value)) {
    if (value.length === 0) return "readonly []";

    const items = value.map((item) => `${padInner}${stringifyLiteralType(item, depth + 1)}`);

    return `readonly [\n${items.join(",\n")},\n${pad}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return "{}";

  const props = entries.map(
    ([key, item]) => `${padInner}${JSON.stringify(key)}: ${stringifyLiteralType(item, depth + 1)}`,
  );

  return `{\n${props.join(";\n")};\n${pad}}`;
}

/**
 * Declares an exchange artifact with every literal kept narrow.
 *
 * A `.json` import cannot: TypeScript widens each literal, so a token reference and
 * an enum value both arrive as `string`, and an array of unlike entries collapses
 * into a union that cannot be indexed. A declaration keeps both, and costs less to
 * check — its types resolve lazily from syntax, where a JSON module's are
 * synthesized in full the moment it is loaded.
 *
 * The value is put through `JSON.stringify` rather than read as given: the declaration
 * has to describe the file that ships beside it, and only JSON itself knows what it
 * does to an `undefined` property or a non-finite number.
 */
export function getExchangeDts(value: unknown): string {
  const json: unknown = JSON.parse(JSON.stringify(value));

  return `declare const artifact: ${stringifyLiteralType(json, 0)};\nexport default artifact;\n`;
}

/**
 * Re-exports the sibling JSON instead of inlining it, so the data lives in one file
 * and the declaration beside this module is what supplies the narrow types.
 */
export function getExchangeMjs(jsonFileName: string): string {
  return `import artifact from "./${jsonFileName}" with { type: "json" };\nexport default artifact;\n`;
}
