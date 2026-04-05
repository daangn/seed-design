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

const generateVariantInterface = (
  variants:
    | SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>["variants"]
    | RecipeDefinition<RecipeVariantRecord>["variants"],
  defaultVariants?:
    | SlotRecipeDefinition<string, SlotRecipeVariantRecord<string>>["defaultVariants"]
    | RecipeDefinition<RecipeVariantRecord>["defaultVariants"],
) => {
  const generateVariantType = (
    variantName: keyof typeof defaultVariants,
    variant: Record<string, any>,
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
          * @default ${typeof defaultValue === "string" ? stringLiteralType(defaultValue) : defaultValue}
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

export function generateRecipeDts(definition: RecipeDefinition<RecipeVariantRecord>): string {
  const capitalizedName = pascalCase(definition.name);
  const jsName = camelCase(definition.name);
  const variantInterface = generateVariantInterface(
    definition.variants,
    definition.defaultVariants,
  );

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

export function generateRecipeDtsWithSlots(
  definition: RecipeDefinition<RecipeVariantRecord>,
  options: { targetSlots?: string[]; extraVariants?: Record<string, (string | boolean)[]> } = {},
): string {
  const capitalizedName = pascalCase(definition.name);
  const jsName = camelCase(definition.name);
  const variantInterface = generateVariantInterface(
    definition.variants,
    definition.defaultVariants,
  );

  // CSS 후처리로 생성된 추가 variant의 타입 생성
  // generateVariantInterface와 동일한 패턴: boolean 값은 리터럴(true) 대신 boolean 타입으로 생성
  const extraVariantInterface = options.extraVariants
    ? Object.entries(options.extraVariants)
        .map(([key, values]) => {
          const booleanValues = values.filter((v) => typeof v === "boolean");
          const stringValues = values.filter((v): v is string => typeof v === "string");
          const typeString = [
            booleanValues.length > 0 ? "boolean" : undefined,
            ...stringValues.map(stringLiteralType),
          ]
            .filter(Boolean)
            .join(" | ");
          return `${key}?: ${typeString};`;
        })
        .join("\n  ")
    : "";

  const slotNameType = (options.targetSlots ?? []).map((slot) => `"${slot}"`).join(" | ");

  return outdent`
  declare interface ${capitalizedName}Variant {
    ${variantInterface}
  ${extraVariantInterface ? `  ${extraVariantInterface}` : ""}}

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

export function generateDts(
  definition: RecipeKindDefinition,
  options: { targetSlots?: string[]; extraVariants?: Record<string, (string | boolean)[]> } = {},
): string {
  if ("slots" in definition) {
    return generateSlotRecipeDts(definition);
  }
  if (options.targetSlots?.length) {
    return generateRecipeDtsWithSlots(definition as RecipeDefinition<RecipeVariantRecord>, options);
  }
  return generateRecipeDts(definition);
}
