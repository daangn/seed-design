import { outdent } from "outdent";

import { camelCase, pascalCase } from "change-case";
import { isBooleanString, not } from "./logic";
import { escapeReservedWord } from "./reserved-words";
import type {
  RecipeDefinition,
  RecipeKindDefinition,
  RecipeVariantRecord,
  SlotRecipeDefinition,
  SlotRecipeVariantRecord,
} from "./types";

const stringLiteralType = (value: string) => `"${value}"`;

const buildJsdocBlock = (sections: string[]) =>
  sections
    .join("\n\n")
    .split("\n")
    .map((line) => (line ? `  * ${line}` : `  *`))
    .join("\n");

const generateVariantInterface = (
  definition:
    | RecipeDefinition<RecipeVariantRecord>
    | SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>,
) => {
  const { variants, metadata } = definition;
  const defaultVariants = definition.defaultVariants as Record<string, string | boolean>;

  const generateVariantType = (variantName: string, variant: Record<string, any>) => {
    const values = Object.keys(variant);
    const booleanValues = values.filter(isBooleanString);
    const hasBoolean = booleanValues.length > 0;
    const stringLiterals = values.filter(not(isBooleanString)).map(stringLiteralType);
    const typeString = [hasBoolean ? "boolean" : undefined, ...stringLiterals]
      .filter(Boolean)
      .join(" | ");
    const defaultValue = defaultVariants?.[variantName];
    const variantMeta = metadata?.variants?.[variantName];
    const axisDescription = variantMeta?.description;
    const valueDescriptions = variantMeta?.values;

    const valueListLines = valueDescriptions
      ? values
          .filter(not(isBooleanString))
          .map((v) => {
            const desc = valueDescriptions[v]?.description;
            return desc ? `- \`${v}\`: ${desc}` : null;
          })
          .filter((line): line is string => line !== null)
      : [];

    const sections: string[] = [];
    if (axisDescription) sections.push(axisDescription);
    if (valueListLines.length > 0) sections.push(valueListLines.join("\n"));
    if (defaultValue !== undefined) {
      const defaultStr =
        typeof defaultValue === "string" ? stringLiteralType(defaultValue) : defaultValue;
      sections.push(`@default ${defaultStr}`);
    }

    if (sections.length === 0) return `${variantName}: ${typeString};`;

    return `/**\n${buildJsdocBlock(sections)}\n  */\n  ${variantName}: ${typeString};`;
  };

  return Object.entries(variants)
    .map(([variantName, variant]) => generateVariantType(variantName, variant))
    .join("\n");
};

export function generateRecipeDts(definition: RecipeDefinition<RecipeVariantRecord>): string {
  const capitalizedName = pascalCase(definition.name);
  const jsName = camelCase(definition.name);
  const variantInterface = generateVariantInterface(definition);

  return outdent`
  declare interface ${capitalizedName}Variant {
    ${variantInterface}
  }

  declare type ${capitalizedName}VariantMap = {
    [key in keyof ${capitalizedName}Variant]: Array<${capitalizedName}Variant[key]>;
  };

  export declare type ${capitalizedName}VariantProps = Partial<${capitalizedName}Variant>;

  export declare const ${jsName}VariantMap: ${capitalizedName}VariantMap;

  export declare const ${escapeReservedWord(jsName)}: ((
    props?: ${capitalizedName}VariantProps,
  ) => string) & {
    splitVariantProps: <T extends ${capitalizedName}VariantProps>(
      props: T,
    ) => [${capitalizedName}VariantProps, Omit<T, keyof ${capitalizedName}VariantProps>];
  }
  `;
}

export function generateSlotRecipeDts(
  definition: SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>,
): string {
  const capitalizedName = pascalCase(definition.name);
  const jsName = camelCase(definition.name);
  const variantInterface = generateVariantInterface(definition);
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

export function generateDts(definition: RecipeKindDefinition): string {
  if ("slots" in definition) {
    return generateSlotRecipeDts(definition);
  }
  return generateRecipeDts(definition);
}
