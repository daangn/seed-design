import type { ComponentPropertyType, InstanceSwapPreferredValue } from "@figma/rest-api-spec";

export interface ComponentPropertyDefinition {
  type: ComponentPropertyType;
  preferredValues?: InstanceSwapPreferredValue[];
  variantOptions?: string[];
}

export type InferComponentPropertyType<T extends ComponentPropertyDefinition> =
  T["type"] extends "TEXT"
    ? string
    : T["type"] extends "BOOLEAN"
      ? boolean
      : T["type"] extends "INSTANCE_SWAP"
        ? string
        : T["type"] extends "VARIANT"
          ? T["variantOptions"] extends string[]
            ? T["variantOptions"][number]
            : never
          : never;

export type InferComponentDefinition<T extends Record<string, ComponentPropertyDefinition>> = {
  [K in keyof T]: {
    type: T[K]["type"];
    value: InferComponentPropertyType<T[K]>;
    readonly boundVariables?: {
      [field in VariableBindableComponentPropertyField]?: VariableAlias;
    };
  } & (T[K]["type"] extends "INSTANCE_SWAP"
    ? {
        componentKey: string;
        preferredValues: InstanceSwapPreferredValue[];
      }
    : {});
};
