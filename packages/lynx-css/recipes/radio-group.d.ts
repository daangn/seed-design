declare interface RadioGroupVariant {
  
}

declare type RadioGroupVariantMap = {
  [key in keyof RadioGroupVariant]: Array<RadioGroupVariant[key]>;
};

export declare type RadioGroupVariantProps = Partial<RadioGroupVariant>;

export declare type RadioGroupSlotName = "root" | "text";

export declare const radioGroupVariantMap: RadioGroupVariantMap;

export declare const radioGroup: ((
  props?: RadioGroupVariantProps,
) => Record<RadioGroupSlotName, string>) & {
  splitVariantProps: <T extends RadioGroupVariantProps>(
    props: T,
  ) => [RadioGroupVariantProps, Omit<T, keyof RadioGroupVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const radioGroupSeedTagSpec: {
  readonly name: "RadioGroup";
  readonly axes: readonly [];
  readonly defaults: {};
};
