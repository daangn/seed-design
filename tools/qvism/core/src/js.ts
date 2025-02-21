import { outdent } from "outdent";

import { escapeReservedWord } from "./reserved-words";
import type { SlotRecipeDefinition, SlotRecipeVariantRecord } from "./types";
import { booleanStringToBoolean, isBooleanString } from "./logic";
import { camelCase } from "change-case";

const prefixName = (name: string, options: { prefix?: string } = {}) =>
  options.prefix ? `${options.prefix}-${name}` : name;

function generateCommonCode(
  definition: SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>,
  options: { prefix?: string } = {},
) {
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

  return {
    jsName,
    slotNames,
    variantMap,
    compoundVariants,
    defaultVariant: definition.defaultVariants ?? {},
  };
}

export function generateJs(
  definition: SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>,
  options: { prefix?: string; format?: "esm" | "cjs" } = { format: "esm" },
): string {
  const { jsName, slotNames, variantMap, compoundVariants, defaultVariant } = generateCommonCode(
    definition,
    options,
  );

  if (options.format === "cjs") {
    return outdent`
    const { createClassName } = require("./className.cjs");
    const { mergeVariants } = require("./mergeVariants.cjs");
    const { splitVariantProps } = require("./splitVariantProps.cjs");

    const ${jsName}SlotNames = ${JSON.stringify(slotNames, null, 2)};
    
    const defaultVariant = ${JSON.stringify(defaultVariant, null, 2)};

    const compoundVariants = ${JSON.stringify(compoundVariants, null, 2)};
    
    const ${jsName}VariantMap = ${JSON.stringify(variantMap, null, 2)};
    
    const ${jsName}VariantKeys = Object.keys(${jsName}VariantMap);
    
    function ${escapeReservedWord(jsName)}(props) {
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

    module.exports = ${escapeReservedWord(jsName)};
    module.exports.${jsName}VariantMap = ${jsName}VariantMap;
    module.exports.${jsName}VariantKeys = ${jsName}VariantKeys;
    `;
  }

  // ESM format (default)
  return outdent`
  import { createClassName } from "./className.mjs";
  import { mergeVariants } from "./mergeVariants.mjs";
  import { splitVariantProps } from "./splitVariantProps.mjs";

  const ${jsName}SlotNames = ${JSON.stringify(slotNames, null, 2)};
  
  const defaultVariant = ${JSON.stringify(defaultVariant, null, 2)};

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
  `;
}
