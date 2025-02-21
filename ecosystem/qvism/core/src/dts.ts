import { outdent } from "outdent";

import { camelCase, pascalCase } from "change-case";
import { isBooleanString, not } from "./logic";
import { escapeReservedWord } from "./reserved-words";
import type { SlotRecipeDefinition, SlotRecipeVariantRecord, StyleObject } from "./types";

const stringLiteralType = (key: string) => `"${key}"`;

const generateVariantInterface = (
  variants: SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>["variants"],
  defaultVariants?: SlotRecipeDefinition<
    string,
    SlotRecipeVariantRecord<string>
  >["defaultVariants"],
) => {
  const generateVariantType = (
    variantName: keyof typeof defaultVariants,
    variant: Record<string, Partial<Record<string, StyleObject>>>,
  ) => {
    const values = Object.keys(variant);
    const booleanValues = values.filter(isBooleanString);
    const hasBoolean = booleanValues.length > 0;
    const stringLiterals = values.filter(not(isBooleanString)).map(stringLiteralType);
    const typeString = [hasBoolean ? "boolean" : undefined, ...stringLiterals]
      .filter(Boolean)
      .join(" | ");
    const defaultValue = defaultVariants?.[variantName];

    if (defaultValue !== undefined) {
      return outdent`
        /**
          * @default ${defaultValue}
          */
          ${variantName}: ${typeString};
      `;
    }

    return `${variantName}: ${typeString};`;
  };

  return Object.entries(variants)
    .map(([variantName, variant]) =>
      generateVariantType(variantName as keyof typeof defaultVariants, variant),
    )
    .join("\n");
};

export function generateDts(
  definition: SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>,
): string {
  const capitalizedName = pascalCase(definition.name);
  const jsName = camelCase(definition.name);
  const variantInterface = generateVariantInterface(
    definition.variants,
    definition.defaultVariants,
  );
  const slotNameType = definition.slots.map((slot) => `"${slot}"`).join(" | ");

  return outdent`
  declare interface ${capitalizedName}Variant {
    ${variantInterface}
  }
  
  declare type ${capitalizedName}VariantMap = {
    [key in keyof ${capitalizedName}Variant]: Array<${capitalizedName}Variant[key]>;
  };
  
  export declare type ${capitalizedName}VariantProps = Partial<${capitalizedName}Variant>;
  
  export declare type ${capitalizedName}SlotName = ${slotNameType};
  
  export declare const ${jsName}VariantMap: ${capitalizedName}VariantMap;
  
  export declare const ${escapeReservedWord(jsName)}: ((
    props?: ${capitalizedName}VariantProps,
  ) => Record<${capitalizedName}SlotName, string>) & {
    splitVariantProps: <T extends ${capitalizedName}VariantProps>(
      props: T,
    ) => [${capitalizedName}VariantProps, Omit<T, keyof ${capitalizedName}VariantProps>];
  }
  `;
}
