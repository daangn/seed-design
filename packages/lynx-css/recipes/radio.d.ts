declare interface RadioVariant {
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

declare type RadioVariantMap = {
  [key in keyof RadioVariant]: Array<RadioVariant[key]>;
};

export declare type RadioVariantProps = Partial<RadioVariant>;

export declare type RadioSlotName = "root" | "control" | "label";

export declare const radioVariantMap: RadioVariantMap;

export declare const radio: ((
  props?: RadioVariantProps,
) => Record<RadioSlotName, string>) & {
  splitVariantProps: <T extends RadioVariantProps>(
    props: T,
  ) => [RadioVariantProps, Omit<T, keyof RadioVariantProps>];
}

// Generated from Rootage component specs and Lynx recipe defaults by scripts/generate-seed-tag.mjs. Do not edit directly.
// `lynx-test-tag` spec: Rootage component name, Rootage variant axes in order, and this recipe's defaults for them.
export declare const radioSeedTagSpec: {
  readonly name: "Radio";
  readonly axes: readonly ["weight", "size"];
  readonly defaults: { readonly weight: "regular"; readonly size: "medium" };
};
