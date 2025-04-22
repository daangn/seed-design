import { outdent } from "outdent";

import { escapeReservedWord } from "./reserved-words";
import type {
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
  RecipeDefinition,
  RecipeVariantRecord,
  RecipeKindDefinition,
  StyleObject,
} from "./types";
import { booleanStringToBoolean, isBooleanString } from "./logic";
import { camelCase } from "change-case";
import { sharedMjs } from "./fixture";

const prefixName = (name: string, options: { prefix?: string } = {}) =>
  options.prefix ? `${options.prefix}-${name}` : name;

export function generateSharedJs(): string {
  return sharedMjs;
}

export function generateSlotRecipeJs(
  definition: SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>,
  options: { prefix?: string; importCss?: boolean } = {},
): string {
  const { importCss = true } = options;
  const jsName = camelCase(definition.name);

  const slotNames = definition.slots.map((slot) => [
    slot,
    `${prefixName(definition.name, options)}__${slot}`,
  ]);

  const variantMap = Object.fromEntries(
    Object.entries(definition.variants).map(([variantName, variant]) => [
      variantName,
      Object.keys(variant).map((key) => (isBooleanString(key) ? booleanStringToBoolean(key) : key)),
    ]),
  );

  const compoundVariants = definition.compoundVariants?.map(({ css, ...rest }) => rest) ?? [];

  return (
    (importCss ? `import './${definition.name}.css';\n` : "") +
    outdent`
  import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";

  const ${jsName}SlotNames = ${JSON.stringify(slotNames, null, 2)};
  
  const defaultVariant = ${JSON.stringify(definition.defaultVariants ?? {}, null, 2)};

  const compoundVariants = ${JSON.stringify(compoundVariants, null, 2)};
  
  export const ${jsName}VariantMap = ${JSON.stringify(variantMap, null, 2)};
  
  export const ${jsName}VariantKeys = Object.keys(${jsName}VariantMap);
  
  export function ${escapeReservedWord(jsName)}(props) {
    return Object.fromEntries(
      ${jsName}SlotNames.map(([slot, className]) => {
        return [
          slot,
          createClassName(className, mergeVariants(defaultVariant, props), compoundVariants),
        ];
      }),
    );
  }
  
  Object.assign(${escapeReservedWord(jsName)}, { splitVariantProps: (props) => splitVariantProps(props, ${jsName}VariantMap) });

  // @recipe(seed): ${definition.name}
  `
  );
}

export function generateRecipeJs(
  definition: RecipeDefinition<RecipeVariantRecord>,
  options: { prefix?: string; importCss?: boolean } = {},
): string {
  const { importCss = true } = options;
  const jsName = camelCase(definition.name);

  const variantMap = Object.fromEntries(
    Object.entries(definition.variants).map(([variantName, variant]) => [
      variantName,
      Object.keys(variant as Record<string, StyleObject>).map((key) =>
        isBooleanString(key) ? booleanStringToBoolean(key) : key,
      ),
    ]),
  );

  const compoundVariants =
    definition.compoundVariants?.map(({ css, ...rest }: { css: StyleObject }) => rest) ?? [];

  return (
    (importCss ? `import './${definition.name}.css';\n` : "") +
    outdent`
  import { createClassName, mergeVariants, splitVariantProps } from "./shared.mjs";
  
  const defaultVariant = ${JSON.stringify(definition.defaultVariants ?? {}, null, 2)};

  const compoundVariants = ${JSON.stringify(compoundVariants, null, 2)};
  
  export const ${jsName}VariantMap = ${JSON.stringify(variantMap, null, 2)};
  
  export const ${jsName}VariantKeys = Object.keys(${jsName}VariantMap);
  
  export function ${escapeReservedWord(jsName)}(props) {
    return createClassName(
      "${prefixName(definition.name, options)}",
      mergeVariants(defaultVariant, props),
      compoundVariants,
    );
  }
  
  Object.assign(${escapeReservedWord(jsName)}, { splitVariantProps: (props) => splitVariantProps(props, ${jsName}VariantMap) });

  // @recipe(seed): ${definition.name}
  `
  );
}

export function generateJs(
  definition: RecipeKindDefinition,
  options: { prefix?: string } = {},
): string {
  if ("slots" in definition) {
    return generateSlotRecipeJs(definition, options);
  }
  return generateRecipeJs(definition, options);
}
