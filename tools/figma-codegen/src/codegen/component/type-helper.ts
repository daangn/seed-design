interface ComponentPropertyDefinition {
  type: ComponentPropertyType;
  defaultValue: string | boolean;
  preferredValues?: InstanceSwapPreferredValue[];
  variantOptions?: string[];
}

export type InferPropertyType<T extends ComponentPropertyDefinition> =
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

export type InferFromDefinition<
  T extends Record<string, ComponentPropertyDefinition>,
> = {
  [K in keyof T]: {
    type: T[K]["type"];
    value: InferPropertyType<T[K]>;
    preferredValues?: InstanceSwapPreferredValue[];
    readonly boundVariables?: {
      [field in VariableBindableComponentPropertyField]?: VariableAlias;
    };
  };
};
