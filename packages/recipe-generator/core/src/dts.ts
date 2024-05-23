import { outdent } from "outdent";

import { escapeReservedWord } from "./reserved-words";
import type { SlotRecipeDefinition, SlotRecipeVariantRecord } from "./types";

const capitalize = (str: string) => str[0].toUpperCase() + str.slice(1);

export function generateDts(
  definition: SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>,
): string {
  const capitalizedName = capitalize(definition.name);
  const variantInterface = Object.entries(definition.variants)
    .map(([variantName, variant]) => {
      return `${variantName}: ${Object.keys(variant)
        .map((key) => (["true", "false"].includes(key) ? key : `"${key}"`))
        .join(" | ")}`;
    })
    .join(";\n  ");
  const slotNameType = definition.slots.map((slot) => `"${slot}"`).join(" | ");

  return outdent`
  interface ${capitalizedName}Variant {
    ${variantInterface}
  }
  
  type ${capitalizedName}VariantMap = {
    [key in keyof ${capitalizedName}Variant]: Array<${capitalizedName}Variant[key]>;
  };
  
  export type ${capitalizedName}VariantProps = Partial<${capitalizedName}Variant>;
  
  export type ${capitalizedName}SlotName = ${slotNameType};
  
  export const ${definition.name}VariantMap: ${capitalizedName}VariantMap;
  
  export function ${escapeReservedWord(definition.name)}(
    props?: ${capitalizedName}VariantProps,
  ): Record<${capitalizedName}SlotName, string>;
  `;
}
