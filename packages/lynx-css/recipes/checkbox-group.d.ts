declare interface CheckboxGroupVariant {
  
}

declare type CheckboxGroupVariantMap = {
  [key in keyof CheckboxGroupVariant]: Array<CheckboxGroupVariant[key]>;
};

export declare type CheckboxGroupVariantProps = Partial<CheckboxGroupVariant>;

export declare type CheckboxGroupSlotName = "root" | "text";

export declare const checkboxGroupVariantMap: CheckboxGroupVariantMap;

export declare const checkboxGroup: ((
  props?: CheckboxGroupVariantProps,
) => Record<CheckboxGroupSlotName, string>) & {
  splitVariantProps: <T extends CheckboxGroupVariantProps>(
    props: T,
  ) => [CheckboxGroupVariantProps, Omit<T, keyof CheckboxGroupVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const checkboxGroupSeedTagSpec: {
  readonly name: "CheckboxGroup";
  readonly axes: readonly [];
  readonly defaults: {};
};
