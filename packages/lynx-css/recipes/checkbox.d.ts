declare interface CheckboxVariant {
  /**
  * @default "regular"
  */
  weight: "regular" | "bold";
/**
  * @default "medium"
  */
  size: "medium" | "large";
/**
  * @default false
  */
  disabled: boolean;
}

declare type CheckboxVariantMap = {
  [key in keyof CheckboxVariant]: Array<CheckboxVariant[key]>;
};

export declare type CheckboxVariantProps = Partial<CheckboxVariant>;

export declare type CheckboxSlotName = "root" | "control" | "label";

export declare const checkboxVariantMap: CheckboxVariantMap;

export declare const checkbox: ((
  props?: CheckboxVariantProps,
) => Record<CheckboxSlotName, string>) & {
  splitVariantProps: <T extends CheckboxVariantProps>(
    props: T,
  ) => [CheckboxVariantProps, Omit<T, keyof CheckboxVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const checkboxSeedTagSpec: {
  readonly name: "Checkbox";
  readonly axes: readonly ["weight", "size"];
  readonly defaults: { readonly weight: "regular"; readonly size: "medium" };
};
